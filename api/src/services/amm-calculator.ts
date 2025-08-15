import { PoolAsset } from './contracts.js';
import { ContractService } from './contracts.js';

export class AMMCalculator {
  private contractService: ContractService;
  
  constructor(contractService: ContractService) {
    this.contractService = contractService;
  }
  
  /**
   * Calculate bid/ask prices by simulating small swaps
   * Uses on-chain simulation for accurate pricing including fees
   */
  async calculateBidAsk(
    poolAddress: string,
    baseAssetInfo: any,
    targetAssetInfo: any,
    poolReserves: PoolAsset[],
    decimalsMap?: Map<string, number>
  ): Promise<{ bid: number; ask: number; spread: number }> {
    // Get decimals for both tokens
    let baseDecimals = 6;
    let targetDecimals = 6;
    
    if (decimalsMap) {
      const baseTokenId = baseAssetInfo.native_token?.denom || baseAssetInfo.token?.contract_addr || '';
      const targetTokenId = targetAssetInfo.native_token?.denom || targetAssetInfo.token?.contract_addr || '';
      baseDecimals = decimalsMap.get(baseTokenId) || 6;
      targetDecimals = decimalsMap.get(targetTokenId) || 6;
    }

    // Use 0.1% of base reserve for price discovery
    // This is a small enough amount to minimize price impact
    const baseReserve = poolReserves[0].amount;
    const targetReserve = poolReserves[1].amount;
    const baseTestAmount = (BigInt(baseReserve) / 1000n).toString();
    const targetTestAmount = (BigInt(targetReserve) / 1000n).toString();
    
    try {
      // Ask price: How much target we get for base (buying target with base)
      const askSimulation = await this.contractService.simulateSwap(
        poolAddress,
        {
          info: baseAssetInfo,
          amount: baseTestAmount
        }
      );
      // Ask price = base_amount / target_amount_received (adjusted for decimals)
      const baseAmountNormalized = Number(baseTestAmount) / Math.pow(10, baseDecimals);
      const targetAmountNormalized = Number(askSimulation.return_amount) / Math.pow(10, targetDecimals);
      const askPrice = baseAmountNormalized / targetAmountNormalized;
      
      // Bid price: How much base we get for target (selling target for base)
      const bidSimulation = await this.contractService.simulateSwap(
        poolAddress,
        {
          info: targetAssetInfo,
          amount: targetTestAmount
        }
      );
      // Bid price = base_amount_received / target_amount (adjusted for decimals)
      const baseReturnNormalized = Number(bidSimulation.return_amount) / Math.pow(10, baseDecimals);
      const targetInputNormalized = Number(targetTestAmount) / Math.pow(10, targetDecimals);
      const bidPrice = baseReturnNormalized / targetInputNormalized;
      
      const spread = (askPrice - bidPrice) / askPrice;
      
      return { bid: bidPrice, ask: askPrice, spread };
    } catch (error) {
      // Fallback to simple calculation if simulation fails
      const baseNormalized = Number(baseReserve) / Math.pow(10, baseDecimals);
      const targetNormalized = Number(targetReserve) / Math.pow(10, targetDecimals);
      const currentPrice = targetNormalized / baseNormalized;
      const defaultSpread = 0.003; // 0.3% default
      return {
        bid: currentPrice * (1 - defaultSpread),
        ask: currentPrice * (1 + defaultSpread),
        spread: defaultSpread * 2
      };
    }
  }
  
  /**
   * Calculate price impact for a given swap amount using on-chain simulation
   */
  async calculatePriceImpact(
    poolAddress: string,
    offerAsset: any,
    offerReserve: string,
    returnReserve: string,
    isOfferBase: boolean = true,
    decimalsMap?: Map<string, number>
  ): Promise<number> {
    // Get decimals for proper price calculation
    let offerDecimals = 6;
    let returnDecimals = 6;
    
    if (decimalsMap && offerAsset.info) {
      const offerTokenId = offerAsset.info.native_token?.denom || offerAsset.info.token?.contract_addr || '';
      offerDecimals = decimalsMap.get(offerTokenId) || 6;
      // For return decimals, we need to find the other token in the pool
      // This is a simplified approach - ideally we'd pass this info explicitly
      for (const [tokenId, decimals] of decimalsMap.entries()) {
        if (tokenId !== offerTokenId) {
          returnDecimals = decimals;
          break;
        }
      }
    }
    
    try {
      const simulation = await this.contractService.simulateSwap(
        poolAddress,
        offerAsset
      );
      
      // Calculate spot price before swap (normalized for decimals)
      const offerReserveNormalized = Number(offerReserve) / Math.pow(10, offerDecimals);
      const returnReserveNormalized = Number(returnReserve) / Math.pow(10, returnDecimals);
      
      // If offering base (asset 0), price is return/offer
      // If offering target (asset 1), price is offer/return
      const spotPriceBefore = isOfferBase 
        ? returnReserveNormalized / offerReserveNormalized
        : offerReserveNormalized / returnReserveNormalized;
      
      // Effective price of this swap (normalized for decimals)
      const offerAmountNormalized = Number(offerAsset.amount) / Math.pow(10, offerDecimals);
      const returnAmountNormalized = Number(simulation.return_amount) / Math.pow(10, returnDecimals);
      
      const effectivePrice = isOfferBase
        ? returnAmountNormalized / offerAmountNormalized
        : offerAmountNormalized / returnAmountNormalized;
      
      // Price impact is the difference between spot price and effective price
      const priceImpact = (spotPriceBefore - effectivePrice) / spotPriceBefore;
      return Math.abs(priceImpact);
    } catch (error) {
      console.error('Failed to calculate price impact:', error);
      return 0;
    }
  }
  
  /**
   * Calculate depth at ±2% price levels using on-chain simulations
   * This shows how much liquidity is available at different price points
   */
  async calculateDepthLevels(
    poolAddress: string,
    baseAssetInfo: any,
    targetAssetInfo: any,
    currentPrice: number,
    levels: number[] = [0.01, 0.02, 0.05, 0.1] // 1%, 2%, 5%, 10%
  ): Promise<{
    bids: Array<[number, number]>; // [price, amount]
    asks: Array<[number, number]>; // [price, amount]
  }> {
    const bids: Array<[number, number]> = [];
    const asks: Array<[number, number]> = [];
    
    for (const level of levels) {
      // For bids (buying pressure pushes price up)
      const bidPrice = currentPrice * (1 - level);
      
      // For asks (selling pressure pushes price down)  
      const askPrice = currentPrice * (1 + level);
      
      // To find the amount needed to move price by level%, we need to use reverse simulation
      // This is complex and might require binary search with simulations
      // For now, we'll estimate based on pool reserves
      
      // Simplified estimation (should be replaced with actual simulation)
      const estimatedBidAmount = level * 1000; // Placeholder
      const estimatedAskAmount = level * 1000; // Placeholder
      
      bids.push([bidPrice, estimatedBidAmount]);
      asks.push([askPrice, estimatedAskAmount]);
    }
    
    return { bids, asks };
  }
  
  /**
   * Calculate liquidity in USD
   */
  static calculateLiquidityUSD(
    assets: PoolAsset[],
    prices: Map<string, number>,
    decimals: Map<string, number> = new Map()
  ): number {
    let totalUSD = 0;
    
    for (const asset of assets) {
      const amount = BigInt(asset.amount);
      let tokenId: string;
      
      if (asset.info.token) {
        tokenId = asset.info.token.contract_addr;
      } else if (asset.info.native_token) {
        tokenId = asset.info.native_token.denom;
      } else {
        continue;
      }
      
      const price = prices.get(tokenId) || 0;
      const decimal = decimals.get(tokenId) || 6; // Default to 6 if not found
      const tokenAmount = Number(amount) / Math.pow(10, decimal);
      totalUSD += tokenAmount * price;
    }
    
    return totalUSD;
  }
  
  /**
   * Get the current spot price from the contract using a minimal simulation
   */
  async getSpotPrice(
    poolAddress: string,
    baseAssetInfo: any,
    targetAssetInfo: any,
    decimalsMap?: Map<string, number>
  ): Promise<number> {
    // Get decimals for proper price calculation
    let baseDecimals = 6;
    let targetDecimals = 6;
    
    if (decimalsMap) {
      const baseTokenId = baseAssetInfo.native_token?.denom || baseAssetInfo.token?.contract_addr || '';
      const targetTokenId = targetAssetInfo.native_token?.denom || targetAssetInfo.token?.contract_addr || '';
      baseDecimals = decimalsMap.get(baseTokenId) || 6;
      targetDecimals = decimalsMap.get(targetTokenId) || 6;
    }

    try {
      // Use a very small amount (1 unit) to get spot price without significant impact
      const testAmount = Math.pow(10, baseDecimals).toString(); // 1 token in base units
      
      const simulation = await this.contractService.simulateSwap(
        poolAddress,
        {
          info: baseAssetInfo,
          amount: testAmount
        }
      );
      
      // Calculate spot price: how much target we get for 1 base token
      const baseAmountNormalized = Number(testAmount) / Math.pow(10, baseDecimals);
      const targetAmountNormalized = Number(simulation.return_amount) / Math.pow(10, targetDecimals);
      
      return targetAmountNormalized / baseAmountNormalized;
      
    } catch (error) {
      console.log('Failed to get spot price from simulation:', (error as Error).message);
      // Return a default price of 1.0 if simulation fails
      return 1.0;
    }
  }

  /**
   * Fallback method: Get spot price from pool reserves (static calculation)
   */
  static getSpotPriceFromReserves(
    baseReserve: string,
    targetReserve: string,
    baseDecimals: number = 6,
    targetDecimals: number = 6
  ): number {
    const baseAmount = Number(baseReserve) / Math.pow(10, baseDecimals);
    const targetAmount = Number(targetReserve) / Math.pow(10, targetDecimals);
    return targetAmount / baseAmount;
  }
  
  /**
   * Format price for display (handling very small/large numbers)
   */
  static formatPrice(price: number, significantDigits: number = 6): string {
    if (price === 0) return '0';
    
    if (price < 0.000001) {
      return price.toExponential(significantDigits - 1);
    } else if (price > 1000000) {
      return price.toExponential(significantDigits - 1);
    } else {
      return price.toFixed(significantDigits);
    }
  }
}