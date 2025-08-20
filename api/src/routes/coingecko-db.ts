import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { AMMCalculatorDB } from '../services/amm-calculator-db.js';
import { DatabaseService } from '../services/database.js';
import { ContractService } from '../services/contracts.js';
import { EXCLUDED_POOLS } from '../config/excluded-pools.js';
import { 
  TickerResponse, 
  OrderBookResponse, 
  HistoricalTradesResponse,
  PoolAssetInfo 
} from '../types/coingecko.js';
import { getTokenIdentifier, createTickerId, getAssetInfo } from '../utils/token-utils.js';
import { handleError } from '../utils/error-utils.js';

const coingeckoDBRoute = new Hono<{
  Variables: {
    database: DatabaseService;
    contracts: ContractService;
    ammCalculatorDB: AMMCalculatorDB;
  }
}>();

// Helper functions moved to ../utils/token-utils.js

// Helper function to get token decimals
async function getTokenDecimals(contracts: ContractService, denom: string): Promise<number> {
  try {
    const assetInfo = getAssetInfo(denom);
    return await contracts.getTokenDecimals(assetInfo as PoolAssetInfo);
  } catch {
    return 6; // Default to 6 decimals
  }
}

// Helper function to simulate XYK pool depth
async function simulateXYKDepth(
  poolBalance: any,
  currentPrice: number,
  targetPrice: number,
  baseDecimals: number,
  targetDecimals: number,
  isPriceIncrease: boolean
): Promise<any> {
  // Get normalized reserves
  const x = Number(poolBalance.token0Balance) / Math.pow(10, baseDecimals); // base token
  const y = Number(poolBalance.token1Balance) / Math.pow(10, targetDecimals); // target token
  
  // Constant product k = x * y
  const k = x * y;
  
  let swapAmount: number;
  let swapToken: string;
  
  if (isPriceIncrease) {
    // Price increase: need to sell base token (x) to get target token (y)
    // New price P = y'/x' where y' = y - Δy, x' = x + Δx
    // From x*y=k: (x + Δx)(y - Δy) = k
    // Target price: targetPrice = (y - Δy)/(x + Δx)
    // Solving: Δx = √(k/targetPrice) - x
    const newX = Math.sqrt(k / targetPrice);
    swapAmount = Math.abs(newX - x); // Take absolute value to ensure positive
    swapToken = 'base';
  } else {
    // Price decrease: need to sell target token (y) to get base token (x)
    // New price P = (y + Δy)/(x - Δx) where we're adding y and removing x
    // Target price: targetPrice = (y + Δy)/(x - Δx)
    // Solving: Δy = targetPrice * √(k * targetPrice) - y
    const newY = targetPrice * Math.sqrt(k * targetPrice);
    swapAmount = Math.abs(newY - y); // Take absolute value to ensure positive
    swapToken = 'target';
  }
  
  return {
    swap_amount: swapAmount.toString(),
    swap_token: swapToken,
    impact_on_reserves: {
      base_token_change: isPriceIncrease ? swapAmount.toString() : (-swapAmount / targetPrice).toString(),
      target_token_change: isPriceIncrease ? (-swapAmount * currentPrice).toString() : swapAmount.toString()
    },
    formula: 'XYK: x*y=k constant product'
  };
}

// Helper function to simulate PCL pool depth using contract simulation
async function simulatePCLDepth(
  contracts: ContractService,
  poolId: string,
  assetInfos: PoolAssetInfo[],
  percentage: number,
  baseDecimals: number,
  targetDecimals: number
): Promise<any> {
  try {
    // Get PCL pool configuration and pool balances
    const pclConfig = await contracts.getPCLPoolConfig(poolId);
    const poolShares = await contracts.getPoolShares(poolId);
    
    if (!pclConfig || !poolShares) {
      throw new Error('Unable to fetch PCL pool configuration or balances');
    }

    // Extract balances from pool response
    const b0 = Number(poolShares.assets[0].amount) / Math.pow(10, baseDecimals);
    const b1 = Number(poolShares.assets[1].amount) / Math.pow(10, targetDecimals);
    
    // Extract PCL parameters from config.params (which is base64 encoded JSON)
    let pclParams;
    try {
      const paramsJson = Buffer.from(pclConfig.params, 'base64').toString();
      pclParams = JSON.parse(paramsJson);
    } catch {
      throw new Error('Unable to decode PCL parameters');
    }
    
    const priceScale = Number(pclParams.price_scale || 1);
    const A = Number(pclParams.amp || 1);
    const gamma = Number(pclParams.gamma || 0.001);
    
    if (b0 === 0 || b1 === 0) {
      throw new Error('Invalid pool reserves');
    }

    // Get current spot price from a small test swap
    const currentSpotPrice = await getCurrentSpotPrice(contracts, poolId, assetInfos, baseDecimals, targetDecimals);
    const targetPrice = currentSpotPrice * (1 + percentage / 100);
    
    // Use binary search to find the exact swap amount needed for the target price
    const swapResult = await findSwapAmountForTargetPrice(
      contracts,
      poolId,
      assetInfos,
      currentSpotPrice,
      targetPrice,
      percentage > 0, // isPriceIncrease
      baseDecimals,
      targetDecimals
    );

    return {
      pool_params: {
        amp: A,
        gamma: gamma,
        price_scale: priceScale
      },
      current_reserves: { base: b0, target: b1 },
      current_spot_price: currentSpotPrice,
      target_price: targetPrice,
      swap_amount: swapResult.swapAmount,
      swap_token: swapResult.swapToken,
      effective_price: swapResult.effectivePrice,
      price_impact: Math.abs((swapResult.effectivePrice - currentSpotPrice) / currentSpotPrice * 100),
      method: 'contract_simulation_binary_search',
      formula: 'PCL: Contract simulation with binary search'
    };
    
  } catch (error) {
    console.error('PCL depth simulation error:', error);
    return {
      error: 'Unable to simulate PCL depth: ' + (error as Error).message,
      formula: 'PCL: Concentrated liquidity with custom curve'
    };
  }
}

// Helper function to get current spot price using a small test swap
async function getCurrentSpotPrice(
  contracts: ContractService,
  poolId: string,
  assetInfos: PoolAssetInfo[],
  baseDecimals: number,
  targetDecimals: number
): Promise<number> {
  try {
    // Use a small test amount (0.01% of typical reserves)
    const testAmount = Math.pow(10, Math.max(baseDecimals - 4, 0)).toString();
    
    const simulation = await contracts.simulateSwap(poolId, {
      info: assetInfos[0],
      amount: testAmount
    });
    
    const baseAmountNormalized = Number(testAmount) / Math.pow(10, baseDecimals);
    const targetAmountNormalized = Number(simulation.return_amount) / Math.pow(10, targetDecimals);
    
    return targetAmountNormalized / baseAmountNormalized;
  } catch (error) {
    console.error('Error getting current spot price:', error);
    throw error;
  }
}

// Helper function to find swap amount needed for target price using binary search
async function findSwapAmountForTargetPrice(
  contracts: ContractService,
  poolId: string,
  assetInfos: PoolAssetInfo[],
  currentPrice: number,
  targetPrice: number,
  isPriceIncrease: boolean,
  baseDecimals: number,
  targetDecimals: number
): Promise<{ swapAmount: number; swapToken: string; effectivePrice: number }> {
  // Determine which asset to swap based on price direction
  // Rule: swapping asset0 lowers price, swapping asset1 increases price
  const swapAssetInfo = isPriceIncrease ? assetInfos[1] : assetInfos[0];
  const swapToken = isPriceIncrease ? 'asset1' : 'asset0';
  // For decimals: when swapping asset0, use baseDecimals; when swapping asset1, use targetDecimals
  const swapDecimals = isPriceIncrease ? targetDecimals : baseDecimals;
  const receiveDecimals = isPriceIncrease ? baseDecimals : targetDecimals;
  
  // Get current pool reserves to calculate reasonable swap limits
  const poolShares = await contracts.getPoolShares(poolId);
  const baseReserve = poolShares?.assets[0]?.amount ? Number(poolShares.assets[0].amount) : 0;
  const targetReserve = poolShares?.assets[1]?.amount ? Number(poolShares.assets[1].amount) : 0;
  
  // Set maximum swap to 80% of the reserve we're swapping from
  const swapReserve = isPriceIncrease ? targetReserve : baseReserve;
  const maxReasonableSwap = Math.floor(swapReserve * 0.8); // 80% of reserve
  
  // Ensure we have a reasonable maximum even if pool reserves are small
  const minReasonableMax = Math.pow(10, swapDecimals + 1); // At least 10 tokens
  const finalMaxAmount = Math.max(maxReasonableSwap, minReasonableMax);
  
  // Binary search parameters - use reasonable limits based on pool size  
  let minAmount = Math.pow(10, swapDecimals); // Start with 1.0 normalized units  
  let maxAmount = finalMaxAmount;
  const tolerance = 0.01; // 1% tolerance on the percentage change
  const maxIterations = 50;
  
  const targetPercentageChange = ((targetPrice - currentPrice) / currentPrice) * 100;
  
  
  
  let bestAmount = minAmount;
  let bestPrice = currentPrice;
  
  for (let i = 0; i < maxIterations; i++) {
    const testAmount = Math.floor((minAmount + maxAmount) / 2);
    
    try {
      const simulation = await contracts.simulateSwap(poolId, {
        info: swapAssetInfo,
        amount: testAmount.toString()
      });
      
      
      // Calculate effective price from simulation
      const swapAmountNormalized = testAmount / Math.pow(10, swapDecimals);
      const returnAmountNormalized = Number(simulation.return_amount) / Math.pow(10, receiveDecimals);
      
      // Calculate the new effective price after the swap
      // The pool price is defined as: how much of token1 you get for 1 token0
      // When we swap token1 for token0, the new price should be lower
      // When we swap token0 for token1, the new price should be higher
      let effectivePrice: number;
      if (isPriceIncrease) {
        // Swapping asset1 (target) for asset0 (base): price = target_offered / base_received
        effectivePrice = swapAmountNormalized / returnAmountNormalized;
      } else {
        // Swapping asset0 (base) for asset1 (target): price = target_received / base_offered
        effectivePrice = returnAmountNormalized / swapAmountNormalized;
      }
      
      // Calculate the actual percentage change achieved
      const actualPercentageChange = ((effectivePrice - currentPrice) / currentPrice) * 100;
      
      // Check if we're close enough to target percentage change (within 5% relative error)
      const percentageError = Math.abs(actualPercentageChange - targetPercentageChange) / Math.abs(targetPercentageChange);
      
      if (percentageError < tolerance) {
        return {
          swapAmount: swapAmountNormalized,
          swapToken,
          effectivePrice
        };
      }
      
      // Update best result if this is closer to target percentage
      const bestActualPercentage = ((bestPrice - currentPrice) / currentPrice) * 100;
      const bestPercentageError = Math.abs(bestActualPercentage - targetPercentageChange) / Math.abs(targetPercentageChange);
      
      if (percentageError < bestPercentageError) {
        bestAmount = testAmount;
        bestPrice = effectivePrice;
      }
      
      // Adjust search range based on whether we've achieved enough percentage change
      if (Math.abs(actualPercentageChange) < Math.abs(targetPercentageChange)) {
        // Haven't achieved enough percentage change, need larger swap
        minAmount = testAmount + 1;
      } else {
        // Achieved too much percentage change, need smaller swap  
        maxAmount = testAmount - 1;
      }
      
      if (minAmount >= maxAmount) break;
      
    } catch (error) {
      // Swap failed, probably too large
      maxAmount = testAmount - 1;
      if (minAmount >= maxAmount) break;
    }
  }
  
  // Return best result found - bestAmount is already in raw units
  return {
    swapAmount: bestAmount / Math.pow(10, swapDecimals),
    swapToken,
    effectivePrice: bestPrice
  };
}

/**
 * Endpoint 1: /tickers - Market Info using Database
 * Provides 24-hour pricing and volume information from database
 */
coingeckoDBRoute.get('/tickers', async (c) => {
  const database = c.get('database');
  const contracts = c.get('contracts');
  const ammCalculatorDB = c.get('ammCalculatorDB');
  
  // Try to get cached response first (for Cloudflare Workers)
  const cacheKey = 'tickers:all';
  const env = c.env as any;
  const kv = env?.KV_BINDING || env?.CACHE_KV;
  
  if (kv) {
    try {
      const cached = await kv.get(cacheKey);
      if (cached) {
        return c.json(JSON.parse(cached));
      }
    } catch (e) {
      // Cache read failed - proceeding without cache
    }
  }
  
  try {
    // Get pools and filter out excluded ones
    const allPools = await database.getPools(100);
    const pools = allPools.filter(pool => !EXCLUDED_POOLS.has(pool.poolAddress));
    const tickers: TickerResponse[] = [];
    
    // Batch fetch pool balances for filtered pools
    const poolAddresses = pools.map(p => p.poolAddress);
    const poolBalances = await ammCalculatorDB.getBatchPoolBalances(poolAddresses);
    
    // Get decimals for all unique tokens
    const uniqueTokens = new Set<string>();
    for (const [_, balance] of poolBalances) {
      uniqueTokens.add(balance.token0Denom);
      uniqueTokens.add(balance.token1Denom);
    }
    
    // Create decimals map - use Promise.all for parallel fetching
    const decimalsMap = new Map<string, number>();
    const decimalsPromises = Array.from(uniqueTokens).map(async (token) => {
      try {
        // First try to get decimals from database (more reliable for IBC tokens)
        const tokenDecimals = await database.getTokenDecimals(token);
        if (tokenDecimals !== null) {
          return { token, decimals: tokenDecimals };
        }
        
        // Fallback to contract query
        const assetInfo = token.startsWith('ibc/') 
          ? { native_token: { denom: token } }
          : token.startsWith('u') 
          ? { native_token: { denom: token } }
          : { token: { contract_addr: token } };
        const decimals = await contracts.getTokenDecimals(assetInfo as PoolAssetInfo);
        return { token, decimals };
      } catch (error) {
        return { token, decimals: 6 }; // Default to 6 decimals
      }
    });
    
    const decimalsResults = await Promise.all(decimalsPromises);
    for (const { token, decimals } of decimalsResults) {
      decimalsMap.set(token, decimals);
    }
    
    // Get token symbols/names from denominations
    const tokenSymbols = await database.getTokenSymbols(Array.from(uniqueTokens));
    
    // Get token prices using the token names/symbols
    const tokenNames = Array.from(tokenSymbols.values());
    const tokenPrices = await database.getTokenPrices(tokenNames);
    
    // Create a price map keyed by denomination (not token name)
    const priceMap = new Map<string, number>();
    
    // Map prices back to denominations
    for (const tokenPrice of tokenPrices) {
      if (tokenPrice.token && tokenPrice.price) {
        const price = parseFloat(tokenPrice.price);
        // Find the denomination that maps to this token name
        for (const [denom, tokenName] of tokenSymbols) {
          if (tokenName === tokenPrice.token) {
            priceMap.set(denom, price);
            break;
          }
        }
      }
    }
    
    // Process pools in parallel batches to avoid overwhelming the database
    const BATCH_SIZE = 10; // Process 10 pools at a time
    const poolBatches = [];
    
    // Split pools into batches
    for (let i = 0; i < pools.length; i += BATCH_SIZE) {
      poolBatches.push(pools.slice(i, i + BATCH_SIZE));
    }
    
    // Process each batch in parallel
    for (const batch of poolBatches) {
      const batchPromises = batch.map(async (pool) => {
        const poolBalance = poolBalances.get(pool.poolAddress);
        if (!poolBalance) return null;
        
        try {
          // Parallel fetch of price data and liquidity calculation
          const [priceData, liquidityUSD] = await Promise.all([
            ammCalculatorDB.getPoolPriceData(pool.poolAddress, decimalsMap),
            ammCalculatorDB.calculateLiquidityUSD(poolBalance, priceMap, decimalsMap)
          ]);
          
          if (!priceData) {
            return null; // No price data available for pool
          }
          
          // Format the ticker response with real data
          const ticker: TickerResponse = {
            ticker_id: createTickerId(poolBalance.token0Denom, poolBalance.token1Denom),
            base_currency: poolBalance.token0Denom,
            target_currency: poolBalance.token1Denom,
            pool_id: pool.poolAddress,
            last_price: priceData.spotPrice.toString(),
            base_volume: priceData.volume24h.baseVolume,
            target_volume: priceData.volume24h.targetVolume,
            liquidity_in_usd: liquidityUSD.toString()
          };
          
          return ticker;
        } catch (poolError) {
          console.error(`Error processing pool ${pool.poolAddress}:`, poolError);
          return null;
        }
      });
      
      // Wait for this batch to complete
      const batchResults = await Promise.all(batchPromises);
      
      // Add valid tickers to the results
      const validTickers = batchResults.filter((ticker): ticker is TickerResponse => ticker !== null);
      tickers.push(...validTickers);
      
      // Small delay between batches to prevent overwhelming the database
      if (poolBatches.indexOf(batch) < poolBatches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    // Cache the response for 30 seconds (for Cloudflare Workers)
    if (kv && tickers.length > 0) {
      try {
        await kv.put(cacheKey, JSON.stringify(tickers), {
          expirationTtl: 30 // 30 seconds cache
        });
      } catch (e) {
      // Cache write failed - ignoring
      }
    }
    
    return c.json(tickers);
  } catch (error) {
    console.error('Error fetching tickers from database:', error);
    return c.json({ error: 'Failed to fetch ticker data' }, 500);
  }
});

/**
 * Endpoint 2: /orderbook - Order book depth
 * For AMM DEX, we provide simulation endpoints instead of actual orderbook
 */
const orderbookSchema = z.object({
  ticker_id: z.string(),
  depth: z.string().regex(/^\d+$/).transform(Number).optional().default('100')
});

coingeckoDBRoute.get('/orderbook', zValidator('query', orderbookSchema), async (c) => {
  const { ticker_id } = c.req.valid('query');
  
  return c.json({
    ticker_id,
    timestamp: Date.now().toString(),
    message: 'This is an AMM DEX. Use /simulate_depth endpoint to calculate depth for specific price movements.',
    simulation_endpoint: '/simulate_depth?pool_id={pool_address}&percentage={2|-2}',
    example: '/simulate_depth?pool_id=bbn1qjn06jt7zjhdqxgud07nylkpgnaurq6x6vad38vztwxec4rr5ntsnn4dd3&percentage=2',
    bids: [],
    asks: []
  });
});

/**
 * Endpoint: /simulate_depth - Calculate depth for price movements
 * Simulates how much liquidity is available at specific price levels
 */
const simulateDepthSchema = z.object({
  pool_id: z.string(),
  percentage: z.string().regex(/^-?\d+(\.\d+)?$/).transform(Number),
  amount_usd: z.string().regex(/^\d+(\.\d+)?$/).transform(Number).optional()
});

coingeckoDBRoute.get('/simulate_depth', zValidator('query', simulateDepthSchema), async (c) => {
  const { pool_id, percentage, amount_usd } = c.req.valid('query');
  const database = c.get('database');
  const contracts = c.get('contracts');
  const ammCalculatorDB = c.get('ammCalculatorDB');
  
  try {
    // Check if pool is excluded
    if (EXCLUDED_POOLS.has(pool_id)) {
      return c.json({ error: 'Pool not available for simulation' }, 404);
    }
    
    // Get pool balance from database
    const poolBalance = await database.getPoolBalance(pool_id);
    if (!poolBalance) {
      return c.json({ error: 'Pool not found' }, 404);
    }
    
    // Get pool info to determine type
    const pool = await contracts.getPool(pool_id);
    const poolType = pool.pair_type.xyk ? 'XYK' : 'PCL';
    
    // Get decimals for calculations
    const baseDecimals = await getTokenDecimals(contracts, poolBalance.token0Denom);
    const targetDecimals = await getTokenDecimals(contracts, poolBalance.token1Denom);
    
    // Get current price data
    const priceData = await ammCalculatorDB.getPoolPriceData(pool_id);
    if (!priceData) {
      return c.json({ error: 'Unable to get pool price data' }, 500);
    }
    
    const currentPrice = priceData.spotPrice;
    const targetPrice = currentPrice * (1 + percentage / 100);
    
    // Calculate depth based on pool type
    let depthResult;
    
    if (poolType === 'XYK') {
      depthResult = await simulateXYKDepth(
        poolBalance,
        currentPrice,
        targetPrice,
        baseDecimals,
        targetDecimals,
        percentage > 0
      );
    } else {
      // For PCL pools, use contract simulation
      depthResult = await simulatePCLDepth(
        contracts,
        pool_id,
        pool.asset_infos,
        percentage,
        baseDecimals,
        targetDecimals
      );
    }
    
    return c.json({
      pool_id,
      pool_type: poolType,
      current_price: currentPrice.toString(),
      target_price: targetPrice.toString(),
      percentage_change: percentage,
      depth: depthResult,
      timestamp: Date.now().toString()
    });
    
  } catch (error) {
    console.error('Error simulating depth:', error);
    return c.json({ error: 'Failed to simulate depth' }, 500);
  }
});

/**
 * Endpoint 3: /historical_trades - Historical trade data from database
 */
const historicalTradesSchema = z.object({
  ticker_id: z.string(),
  type: z.enum(['buy', 'sell', 'all']).optional().default('all'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default('100'),
  start_time: z.string().regex(/^\d+$/).transform(Number).optional(),
  end_time: z.string().regex(/^\d+$/).transform(Number).optional()
});

coingeckoDBRoute.get('/historical_trades', zValidator('query', historicalTradesSchema), async (c) => {
  const { ticker_id, type, limit, start_time, end_time } = c.req.valid('query');
  const database = c.get('database');
  const contracts = c.get('contracts');
  
  try {
    // Parse ticker_id to get tokens
    const [base, target] = ticker_id.split('_');
    
    // Optimized: Get all pools and their balances in parallel
    const allPools = await database.getPools(100);
    const pools = allPools.filter(pool => !EXCLUDED_POOLS.has(pool.poolAddress));
    
    // Parallel fetch all pool balances
    const poolBalancePromises = pools.map(async (pool) => {
      const balance = await database.getPoolBalance(pool.poolAddress);
      return { pool, balance };
    });
    
    const poolBalanceResults = await Promise.all(poolBalancePromises);
    
    // Find matching pool from results
    const matchingResult = poolBalanceResults.find(({ balance }) => 
      balance && (
        (balance.token0Denom === base && balance.token1Denom === target) ||
        (balance.token0Denom === target && balance.token1Denom === base)
      )
    );
    
    const matchingPool = matchingResult?.pool || null;
    const poolBalance = matchingResult?.balance || null;
    
    if (!matchingPool || !poolBalance) {
      return c.json({ error: 'Pool not found' }, 404);
    }
    
    // Get decimals for proper price calculation
    const baseDecimals = await getTokenDecimals(contracts, base);
    const targetDecimals = await getTokenDecimals(contracts, target);
    
    // Get historical trades from database
    const trades = await database.getHistoricalTrades(
      matchingPool.poolAddress,
      limit,
      start_time,
      end_time
    );
    
    // Convert to CoinGecko format
    const buyTrades: any[] = [];
    const sellTrades: any[] = [];
    
    let tradeIdCounter = 1;
    
    trades.forEach((trade) => {
      // Determine trade type based on offer/ask assets matching base
      const isBuy = trade.offerAsset === base;
      
      // Calculate normalized price with decimals
      const offerAmount = Number(trade.offerAmount);
      const returnAmount = Number(trade.returnAmount);
      
      let price: number;
      let baseVolume: string;
      let targetVolume: string;
      
      if (isBuy) {
        // Buy: offering base, getting target
        const normalizedOffer = offerAmount / Math.pow(10, baseDecimals);
        const normalizedReturn = returnAmount / Math.pow(10, targetDecimals);
        price = normalizedReturn / normalizedOffer; // How much target per base
        baseVolume = normalizedOffer.toString();
        targetVolume = normalizedReturn.toString();
      } else {
        // Sell: offering target, getting base
        const normalizedOffer = offerAmount / Math.pow(10, targetDecimals);
        const normalizedReturn = returnAmount / Math.pow(10, baseDecimals);
        price = normalizedOffer / normalizedReturn; // How much target per base
        baseVolume = normalizedReturn.toString();
        targetVolume = normalizedOffer.toString();
      }
      
      const formattedTrade = {
        trade_id: trade.transactionHash || tradeIdCounter++,
        price: price.toString(),
        base_volume: baseVolume,
        target_volume: targetVolume,
        trade_timestamp: new Date(trade.timestamp).getTime().toString(),
        type: isBuy ? 'buy' as const : 'sell' as const
      };
      
      if (formattedTrade.type === 'buy' && type !== 'sell') {
        buyTrades.push(formattedTrade);
      } else if (formattedTrade.type === 'sell' && type !== 'buy') {
        sellTrades.push(formattedTrade);
      }
    });
    
    const response: HistoricalTradesResponse = {
      buy: buyTrades,
      sell: sellTrades
    };
    
    return c.json(response);
  } catch (error) {
    console.error('Error fetching historical trades:', error);
    return c.json({ error: 'Failed to fetch historical trades' }, 500);
  }
});

export default coingeckoDBRoute;