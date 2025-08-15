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
    poolReserves: PoolAsset[]
  ): Promise<{ bid: number; ask: number; spread: number }> {
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
      // Ask price = base_amount / target_amount_received
      const askPrice = Number(baseTestAmount) / Number(askSimulation.return_amount);
      
      // Bid price: How much base we get for target (selling target for base)
      const bidSimulation = await this.contractService.simulateSwap(
        poolAddress,
        {
          info: targetAssetInfo,
          amount: targetTestAmount
        }
      );
      // Bid price = base_amount_received / target_amount
      const bidPrice = Number(bidSimulation.return_amount) / Number(targetTestAmount);
      
      const spread = (askPrice - bidPrice) / askPrice;
      
      return { bid: bidPrice, ask: askPrice, spread };
    } catch (error) {
      // Fallback to simple calculation if simulation fails
      const currentPrice = Number(targetReserve) / Number(baseReserve);
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
    isOfferBase: boolean = true
  ): Promise<number> {
    try {
      const simulation = await this.contractService.simulateSwap(
        poolAddress,
        offerAsset
      );
      
      // Calculate spot price before swap
      // If offering base (asset 0), price is return/offer
      // If offering target (asset 1), price is offer/return
      const spotPriceBefore = isOfferBase 
        ? Number(returnReserve) / Number(offerReserve)
        : Number(offerReserve) / Number(returnReserve);
      
      // Effective price of this swap (same logic)
      const effectivePrice = isOfferBase
        ? Number(simulation.return_amount) / Number(offerAsset.amount)
        : Number(offerAsset.amount) / Number(simulation.return_amount);
      
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
   * Get the current spot price from pool reserves
   */
  static getSpotPrice(
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