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

const coingeckoDBRoute = new Hono<{
  Variables: {
    database: DatabaseService;
    contracts: ContractService;
    ammCalculatorDB: AMMCalculatorDB;
  }
}>();

// Helper function to get token identifier
function getTokenIdentifier(assetInfo: PoolAssetInfo | string): string {
  if (typeof assetInfo === 'string') {
    return assetInfo;
  }
  if (assetInfo.token) {
    return assetInfo.token.contract_addr;
  } else if (assetInfo.native_token) {
    return assetInfo.native_token.denom;
  }
  return '';
}

// Helper function to create ticker ID
function createTickerId(base: string, target: string): string {
  return `${base}_${target}`;
}

// Helper function to get token decimals
async function getTokenDecimals(contracts: ContractService, denom: string): Promise<number> {
  try {
    const assetInfo = denom.startsWith('ibc/') 
      ? { native_token: { denom } }
      : denom.startsWith('u') 
      ? { native_token: { denom } }
      : { token: { contract_addr: denom } };
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
    swapAmount = newX - x;
    swapToken = 'base';
  } else {
    // Price decrease: need to sell target token (y) to get base token (x)
    // New price P = (y + Δy)/(x - Δx) where we're adding y and removing x
    // Target price: targetPrice = (y + Δy)/(x - Δx)
    // Solving: Δy = targetPrice * √(k * targetPrice) - y
    const newY = targetPrice * Math.sqrt(k * targetPrice);
    swapAmount = newY - y;
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

// Helper function to simulate PCL pool depth using Curve CryptoSwap math
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

    // Calculate depth using simplified Curve CryptoSwap approach
    const depth = calculateCurveDepth({
      b0,
      b1, 
      priceScale,
      A,
      gamma,
      percentage
    });

    return {
      pool_params: {
        amp: A,
        gamma: gamma,
        price_scale: priceScale
      },
      current_reserves: { base: b0, target: b1 },
      depth_calculation: depth,
      formula: 'PCL: Curve CryptoSwap with amp/gamma parameters'
    };
    
  } catch (error) {
    console.error('PCL depth simulation error:', error);
    return {
      error: 'Unable to simulate PCL depth: ' + (error as Error).message,
      formula: 'PCL: Concentrated liquidity with custom curve'
    };
  }
}

// Simplified Curve CryptoSwap depth calculation
function calculateCurveDepth(params: {
  b0: number;
  b1: number; 
  priceScale: number;
  A: number;
  gamma: number;
  percentage: number;
}): any {
  const { b0, b1, priceScale, A, gamma, percentage } = params;
  
  // Transform to scaled space (x0 = b0, x1 = b1 * priceScale)
  const x0 = b0;
  const x1 = b1 * priceScale;
  
  // Simplified invariant calculation (full implementation would solve D iteratively)
  const D_approx = Math.sqrt(x0 * x1 * 4); // Simplified, actual is more complex
  
  // Current spot price approximation
  const currentSpot = (x1 / x0) / priceScale;
  const targetPrice = currentSpot * (1 + percentage / 100);
  
  // Simplified depth estimation using geometric mean and amplification
  const liquidityDepth = Math.sqrt(x0 * x1) / A; // Higher A = lower depth needed
  const baseDepthEstimate = liquidityDepth * Math.abs(percentage) / 100;
  
  return {
    estimated_swap_amount: baseDepthEstimate,
    current_spot_price: currentSpot,
    target_price: targetPrice,
    method: 'simplified_curve_approximation',
    note: 'This is a simplified approximation. Full implementation requires iterative D calculation.',
    recommendation: 'Use contract simulation for precise values'
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
      console.warn('Cache read failed:', e);
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
        const assetInfo = token.startsWith('ibc/') 
          ? { native_token: { denom: token } }
          : token.startsWith('u') 
          ? { native_token: { denom: token } }
          : { token: { contract_addr: token } };
        const decimals = await contracts.getTokenDecimals(assetInfo as PoolAssetInfo);
        return { token, decimals };
      } catch {
        return { token, decimals: 6 }; // Default to 6 decimals
      }
    });
    
    const decimalsResults = await Promise.all(decimalsPromises);
    for (const { token, decimals } of decimalsResults) {
      decimalsMap.set(token, decimals);
    }
    
    // Get token prices for USD calculations
    const tokenPrices = await database.getTokenPrices(Array.from(uniqueTokens));
    const priceMap = new Map<string, number>();
    for (const tokenPrice of tokenPrices) {
      if (tokenPrice.token && tokenPrice.price) {
        priceMap.set(tokenPrice.token, parseFloat(tokenPrice.price));
      }
    }
    
    // Process each pool
    for (const pool of pools) {
      const poolBalance = poolBalances.get(pool.poolAddress);
      if (!poolBalance) continue;
      
      try {
        // Get real price data from AMMCalculatorDB
        const priceData = await ammCalculatorDB.getPoolPriceData(pool.poolAddress, decimalsMap);
        
        if (!priceData) {
          console.warn(`No price data available for pool ${pool.poolAddress}`);
          continue;
        }
        
        // Calculate liquidity in USD
        const liquidityUSD = await ammCalculatorDB.calculateLiquidityUSD(
          poolBalance,
          priceMap,
          decimalsMap
        );
        
        // Format the ticker response with real data
        // Note: CoinGecko spec requires contract addresses for DEX, not symbols
        const ticker: TickerResponse = {
          ticker_id: createTickerId(poolBalance.token0Denom, poolBalance.token1Denom),
          base_currency: poolBalance.token0Denom,  // Contract address/denom as per CoinGecko DEX spec
          target_currency: poolBalance.token1Denom, // Contract address/denom as per CoinGecko DEX spec
          pool_id: pool.poolAddress,
          last_price: priceData.spotPrice.toString(),
          base_volume: priceData.volume24h.baseVolume,
          target_volume: priceData.volume24h.targetVolume,
          liquidity_in_usd: liquidityUSD.toString(),
          bid: priceData.bidPrice.toString(),
          ask: priceData.askPrice.toString(),
          high: priceData.high24h?.toString() || priceData.spotPrice.toString(),
          low: priceData.low24h?.toString() || priceData.spotPrice.toString()
        };
        
        tickers.push(ticker);
      } catch (poolError) {
        console.error(`Error processing pool ${pool.poolAddress}:`, poolError);
        // Skip this pool and continue with others
        continue;
      }
    }
    
    // Cache the response for 30 seconds (for Cloudflare Workers)
    if (kv && tickers.length > 0) {
      try {
        await kv.put(cacheKey, JSON.stringify(tickers), {
          expirationTtl: 30 // 30 seconds cache
        });
      } catch (e) {
        console.warn('Cache write failed:', e);
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
    
    // Find the pool with these assets from database
    const allPools = await database.getPools(100);
    const pools = allPools.filter(pool => !EXCLUDED_POOLS.has(pool.poolAddress));
    
    // Find matching pool and its balance
    let matchingPool = null;
    let poolBalance = null;
    for (const pool of pools) {
      const balance = await database.getPoolBalance(pool.poolAddress);
      if (balance) {
        if ((balance.token0Denom === base && balance.token1Denom === target) ||
            (balance.token0Denom === target && balance.token1Denom === base)) {
          matchingPool = pool;
          poolBalance = balance;
          break;
        }
      }
    }
    
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