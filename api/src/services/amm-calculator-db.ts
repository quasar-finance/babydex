import { DatabaseService, PoolBalance, SwapData } from './database.js';
import { ContractService } from './contracts.js';
import { PoolAssetInfo } from '../types/coingecko.js';

export interface PoolPriceData {
  spotPrice: number;
  volume24h: {
    baseVolume: string;
    targetVolume: string;
    usdVolume?: number;
  };
  high24h: number | null;
  low24h: number | null;
  priceChange24h: number | null;
}

export class AMMCalculatorDB {
  private databaseService: DatabaseService;
  private contractService: ContractService;

  constructor(
    databaseService: DatabaseService,
    contractService: ContractService
  ) {
    this.databaseService = databaseService;
    this.contractService = contractService;
  }

  /**
   * Get pool price data from database and calculate bid/ask
   */
  async getPoolPriceData(
    poolAddress: string,
    decimalsMap?: Map<string, number>
  ): Promise<PoolPriceData | null> {
    try {
      // Parallel fetch all required data to reduce database round trips
      const [poolBalance, volumeData, recentTrades] = await Promise.all([
        this.databaseService.getPoolBalance(poolAddress),
        this.databaseService.get24HourVolume(poolAddress),
        this.databaseService.getHistoricalTrades(poolAddress, 20) // For spot price calculation
      ]);
      
      if (!poolBalance) {
        // No pool balance found
        return null;
      }
      
      // Get decimals for tokens
      const baseDecimals = decimalsMap?.get(poolBalance.token0Denom) || 6;
      const targetDecimals = decimalsMap?.get(poolBalance.token1Denom) || 6;

      // Calculate spot price from last swap using pre-fetched trades
      const spotPrice = this.calculateSpotPriceFromTradesSync(
        recentTrades,
        poolBalance,
        baseDecimals,
        targetDecimals
      );


      // Calculate 24h price change if we have high/low
      let priceChange24h = null;
      if (volumeData.high && volumeData.low) {
        const high = parseFloat(volumeData.high);
        const low = parseFloat(volumeData.low);
        if (low > 0) {
          priceChange24h = ((high - low) / low) * 100;
        }
      }

      return {
        spotPrice,
        volume24h: {
          baseVolume: volumeData.baseVolume,
          targetVolume: volumeData.targetVolume,
        },
        high24h: volumeData.high ? parseFloat(volumeData.high) : null,
        low24h: volumeData.low ? parseFloat(volumeData.low) : null,
        priceChange24h,
      };
    } catch (error) {
      console.error(`Error getting pool price data for ${poolAddress}:`, error);
      return null;
    }
  }

  /**
   * Get pool balance directly from database
   */
  async getPoolBalance(poolAddress: string): Promise<PoolBalance | null> {
    return await this.databaseService.getPoolBalance(poolAddress);
  }

  /**
   * Get pool balances for multiple pools efficiently
   */
  async getBatchPoolBalances(poolAddresses: string[]): Promise<Map<string, PoolBalance>> {
    const balances = await this.databaseService.getBatchPoolBalances(poolAddresses);
    const balanceMap = new Map<string, PoolBalance>();
    
    for (const balance of balances) {
      balanceMap.set(balance.poolAddress, balance);
    }
    
    return balanceMap;
  }


  /**
   * Fallback: Calculate spot price from pool reserves
   */
  private calculateSpotPriceFromReserves(
    baseReserve: string,
    targetReserve: string,
    baseDecimals: number,
    targetDecimals: number
  ): number {
    const baseAmount = Number(baseReserve) / Math.pow(10, baseDecimals);
    const targetAmount = Number(targetReserve) / Math.pow(10, targetDecimals);
    
    if (baseAmount === 0) return 0;
    return targetAmount / baseAmount;
  }


  /**
   * Calculate liquidity in USD using database prices
   */
  async calculateLiquidityUSD(
    poolBalance: PoolBalance,
    tokenPrices?: Map<string, number>,
    decimalsMap?: Map<string, number>
  ): Promise<number> {
    const baseDecimals = decimalsMap?.get(poolBalance.token0Denom) || 6;
    const targetDecimals = decimalsMap?.get(poolBalance.token1Denom) || 6;
    
    const baseAmount = Number(poolBalance.token0Balance) / Math.pow(10, baseDecimals);
    const targetAmount = Number(poolBalance.token1Balance) / Math.pow(10, targetDecimals);
    
    const basePrice = tokenPrices?.get(poolBalance.token0Denom) || 0;
    const targetPrice = tokenPrices?.get(poolBalance.token1Denom) || 0;
    
    return (baseAmount * basePrice) + (targetAmount * targetPrice);
  }

  /**
   * Get historical trades for a pool
   */
  async getHistoricalTrades(
    poolAddress: string,
    limit: number = 100,
    startTime?: number,
    endTime?: number
  ): Promise<SwapData[]> {
    return await this.databaseService.getHistoricalTrades(
      poolAddress,
      limit,
      startTime,
      endTime
    );
  }

  /**
   * Calculate price impact based on historical trades
   */
  async calculatePriceImpact(
    poolAddress: string,
    tradeAmount: string,
    isBase: boolean = true,
    decimalsMap?: Map<string, number>
  ): Promise<number> {
    try {
      const poolBalance = await this.databaseService.getPoolBalance(poolAddress);
      if (!poolBalance) return 0;

      const baseDecimals = decimalsMap?.get(poolBalance.token0Denom) || 6;
      const targetDecimals = decimalsMap?.get(poolBalance.token1Denom) || 6;
      
      const spotPrice = this.calculateSpotPriceFromReserves(
        poolBalance.token0Balance,
        poolBalance.token1Balance,
        baseDecimals,
        targetDecimals
      );

      // For database approach, we can use historical trade data to estimate impact
      // Get trades of similar size to estimate impact
      const recentTrades = await this.databaseService.getHistoricalTrades(
        poolAddress,
        50
      );

      // Find trades of similar size
      const tradeAmountNum = Number(tradeAmount);
      const similarTrades = recentTrades.filter(trade => {
        const amount = isBase ? Number(trade.offerAmount) : Number(trade.returnAmount);
        return amount >= tradeAmountNum * 0.5 && amount <= tradeAmountNum * 2;
      });

      if (similarTrades.length > 0) {
        // Calculate average price impact from similar trades
        let totalImpact = 0;
        let validTrades = 0;

        for (const trade of similarTrades) {
          if (trade.offerAmount && trade.returnAmount) {
            const offerAmount = Number(trade.offerAmount) / Math.pow(10, baseDecimals);
            const returnAmount = Number(trade.returnAmount) / Math.pow(10, targetDecimals);
            
            if (offerAmount > 0) {
              const effectivePrice = returnAmount / offerAmount;
              const impact = Math.abs((spotPrice - effectivePrice) / spotPrice);
              if (isFinite(impact)) {
                totalImpact += impact;
                validTrades++;
              }
            }
          }
        }

        if (validTrades > 0) {
          return totalImpact / validTrades;
        }
      }

      // Fallback: Estimate based on pool size
      const poolSize = isBase 
        ? Number(poolBalance.token0Balance) 
        : Number(poolBalance.token1Balance);
      
      const tradePercent = tradeAmountNum / poolSize;
      
      // Simple approximation: impact increases with trade size
      // 0.1% trade = ~0.05% impact, 1% trade = ~0.5% impact, 10% trade = ~5% impact
      return tradePercent * 0.5;
      
    } catch (error) {
      console.error('Error calculating price impact:', error);
      return 0;
    }
  }

  /**
   * Get all pools from database
   */
  async getAllPools(limit: number = 100) {
    return await this.databaseService.getPools(limit);
  }

  /**
   * Calculate spot price from pre-fetched trades (synchronous)
   * This replaces the async calculateSpotPriceFromLastSwap for better performance
   */
  private calculateSpotPriceFromTradesSync(
    recentTrades: any[],
    poolBalance: any,
    baseDecimals: number,
    targetDecimals: number
  ): number {
    if (recentTrades.length === 0) {
      // Fallback to reserve calculation if no swaps found
      return this.calculateSpotPriceFromReserves(
        poolBalance.token0Balance,
        poolBalance.token1Balance,
        baseDecimals,
        targetDecimals
      );
    }

    const lastSwap = recentTrades[0];
    
    // Determine if the swap was token0 -> token1 or token1 -> token0
    const isToken0Offer = lastSwap.offerAsset === poolBalance.token0Denom;
    const isToken1Offer = lastSwap.offerAsset === poolBalance.token1Denom;
    
    if (!isToken0Offer && !isToken1Offer) {
      return this.calculateSpotPriceFromReserves(
        poolBalance.token0Balance,
        poolBalance.token1Balance,
        baseDecimals,
        targetDecimals
      );
    }

    // Calculate the effective price from the swap
    const offerAmount = Number(lastSwap.offerAmount);
    const returnAmount = Number(lastSwap.returnAmount);
    
    if (offerAmount === 0 || returnAmount === 0) {
      return this.calculateSpotPriceFromReserves(
        poolBalance.token0Balance,
        poolBalance.token1Balance,
        baseDecimals,
        targetDecimals
      );
    }

    let spotPrice: number;
    
    if (isToken0Offer) {
      // Swap was token0 -> token1
      const token0AmountNormalized = offerAmount / Math.pow(10, baseDecimals);
      const token1AmountNormalized = returnAmount / Math.pow(10, targetDecimals);
      spotPrice = token1AmountNormalized / token0AmountNormalized;
    } else {
      // Swap was token1 -> token0
      const token1AmountNormalized = offerAmount / Math.pow(10, targetDecimals);
      const token0AmountNormalized = returnAmount / Math.pow(10, baseDecimals);
      spotPrice = token1AmountNormalized / token0AmountNormalized;
    }

    return spotPrice;
  }


  /**
   * Get 24-hour volume data
   */
  async get24HourVolume(poolAddress: string) {
    return await this.databaseService.get24HourVolume(poolAddress);
  }

  /**
   * Format price for display
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

  /**
   * Hybrid approach: Use database for historical data, contracts for real-time
   * This method can fall back to contract queries if database is behind
   */
  async getHybridSpotPrice(
    poolAddress: string,
    baseAssetInfo: PoolAssetInfo,
    targetAssetInfo: PoolAssetInfo,
    decimalsMap?: Map<string, number>
  ): Promise<number> {
    try {
      // First try database
      const poolBalance = await this.databaseService.getPoolBalance(poolAddress);
      
      if (poolBalance) {
        const baseDecimals = decimalsMap?.get(poolBalance.token0Denom) || 6;
        const targetDecimals = decimalsMap?.get(poolBalance.token1Denom) || 6;
        
        return this.calculateSpotPriceFromReserves(
          poolBalance.token0Balance,
          poolBalance.token1Balance,
          baseDecimals,
          targetDecimals
        );
      }

      // Fallback to contract simulation
      // Database balance not found, falling back to contract
      
      const baseDecimals = decimalsMap?.get(
        baseAssetInfo.native_token?.denom || baseAssetInfo.token?.contract_addr || ''
      ) || 6;
      
      const testAmount = Math.pow(10, baseDecimals).toString();
      
      const simulation = await this.contractService.simulateSwap(
        poolAddress,
        {
          info: baseAssetInfo,
          amount: testAmount
        }
      );
      
      const targetDecimals = decimalsMap?.get(
        targetAssetInfo.native_token?.denom || targetAssetInfo.token?.contract_addr || ''
      ) || 6;
      
      const baseAmountNormalized = Number(testAmount) / Math.pow(10, baseDecimals);
      const targetAmountNormalized = Number(simulation.return_amount) / Math.pow(10, targetDecimals);
      
      return targetAmountNormalized / baseAmountNormalized;
      
    } catch (error) {
      console.error('Error in hybrid spot price calculation:', error);
      return 1.0; // Default price if all fails
    }
  }
}