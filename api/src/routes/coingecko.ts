import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { ContractService } from '../services/contracts.js';
import { VolumeTracker } from '../services/volume-tracker.js';
import { PriceService } from '../services/price.js';
import { AMMCalculator } from '../services/amm-calculator.js';
import { 
  TickerResponse, 
  OrderBookResponse, 
  HistoricalTradesResponse,
  PoolAssetInfo 
} from '../types/coingecko.js';

const coingeckoRoute = new Hono<{
  Variables: {
    contracts: ContractService;
    volumeTracker: VolumeTracker;
    priceService: PriceService;
    ammCalculator: AMMCalculator;
  };
}>();

// Helper function to get token identifier
function getTokenIdentifier(assetInfo: PoolAssetInfo): string {
  if (assetInfo.token) {
    return assetInfo.token.contract_addr;
  } else if (assetInfo.native_token) {
    return assetInfo.native_token.denom;
  }
  return '';
}

// Helper function to create ticker ID
function createTickerId(baseAsset: PoolAssetInfo, targetAsset: PoolAssetInfo): string {
  const base = getTokenIdentifier(baseAsset);
  const target = getTokenIdentifier(targetAsset);
  return `${base}_${target}`;
}

/**
 * Endpoint 1: /tickers - Market Info
 * Provides 24-hour pricing and volume information for all market pairs
 */
coingeckoRoute.get('/tickers', async (c) => {
  const contracts = c.get('contracts');
  const volumeTracker = c.get('volumeTracker');
  const priceService = c.get('priceService');
  
  try {
    // Get all pools
    const pools = await contracts.getPools(200); // Get up to 200 pools
    const tickers: TickerResponse[] = [];
    
    // Collect all token addresses for batch price fetching
    const tokenAddresses = new Set<string>();
    for (const pool of pools) {
      if (pool.asset_infos.length >= 2) {
        tokenAddresses.add(getTokenIdentifier(pool.asset_infos[0]));
        tokenAddresses.add(getTokenIdentifier(pool.asset_infos[1]));
      }
    }
    
    // Get prices for all tokens
    const prices = await priceService.getBatchPrices(Array.from(tokenAddresses));
    
    // Process each pool
    for (const pool of pools) {
      if (pool.asset_infos.length < 2) continue;
      
      const [baseAsset, targetAsset] = pool.asset_infos;
      const poolAddress = pool.contract_addr;
      
      // Get pool shares (liquidity)
      const poolShares = await contracts.getPoolShares(poolAddress);
      
      // Get 24hr volume and price stats
      const volumeStats = await volumeTracker.get24HourVolume(poolAddress);
      
      // Get AMM calculator from context
      const ammCalculator = c.get('ammCalculator');
      
      // Calculate current price from reserves
      const currentPrice = AMMCalculator.getSpotPrice(
        poolShares.assets[0].amount,
        poolShares.assets[1].amount
      );
      
      // Calculate bid/ask using on-chain simulations
      // poolShares.assets contains the actual token reserves in the pool
      const { bid, ask } = await ammCalculator.calculateBidAsk(
        poolAddress,
        baseAsset,
        targetAsset,
        poolShares.assets
      );
      
      // Calculate liquidity in USD
      const liquidityUSD = AMMCalculator.calculateLiquidityUSD(poolShares.assets, prices);
      
      const ticker: TickerResponse = {
        ticker_id: createTickerId(baseAsset, targetAsset),
        base_currency: getTokenIdentifier(baseAsset),
        target_currency: getTokenIdentifier(targetAsset),
        pool_id: poolAddress,
        last_price: currentPrice.toString(),
        base_volume: volumeStats.base.toString(),
        target_volume: volumeStats.target.toString(),
        liquidity_in_usd: liquidityUSD.toString(),
        bid: bid.toString(),
        ask: ask.toString(),
        high: (volumeStats.high || currentPrice).toString(),
        low: (volumeStats.low || currentPrice).toString()
      };
      
      tickers.push(ticker);
    }
    
    return c.json(tickers);
  } catch (error) {
    console.error('Error fetching tickers:', error);
    return c.json({ error: 'Failed to fetch ticker data' }, 500);
  }
});

/**
 * Endpoint 2: /orderbook - Order book depth
 * For AMM DEX, we provide the formula instead of actual orderbook
 * CoinGecko will use the formula to calculate depth
 */
const orderbookSchema = z.object({
  ticker_id: z.string(),
  depth: z.string().regex(/^\d+$/).transform(Number).optional().default(100)
});

coingeckoRoute.get('/orderbook', zValidator('query', orderbookSchema), async (c) => {
  const { ticker_id, depth } = c.req.valid('query');
  
  // Since we're an AMM, we return a message about using the formula
  // CoinGecko expects either orderbook data or they will use Uniswap V2 formula
  
  return c.json({
    ticker_id,
    timestamp: Date.now().toString(),
    message: 'This is an AMM DEX. Please use the liquidity_in_usd from /tickers endpoint and apply the appropriate AMM formula for depth calculation.',
    formula: 'Pool-specific formulas: XYK pools use x*y=k, PCL pools use concentrated liquidity formula',
    bids: [],
    asks: []
  });
});

/**
 * Endpoint 3: /historical_trades - Historical trade data
 */
const historicalTradesSchema = z.object({
  ticker_id: z.string(),
  type: z.enum(['buy', 'sell', 'all']).optional().default('all'),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(100),
  start_time: z.string().regex(/^\d+$/).transform(Number).optional(),
  end_time: z.string().regex(/^\d+$/).transform(Number).optional()
});

coingeckoRoute.get('/historical_trades', zValidator('query', historicalTradesSchema), async (c) => {
  const { ticker_id, type, limit, start_time, end_time } = c.req.valid('query');
  const volumeTracker = c.get('volumeTracker');
  const contracts = c.get('contracts');
  
  try {
    // Parse ticker_id to get pool
    const [base, target] = ticker_id.split('_');
    
    // Find the pool with these assets
    const pools = await contracts.getPools(100);
    const pool = pools.find(p => {
      const baseId = getTokenIdentifier(p.asset_infos[0]);
      const targetId = getTokenIdentifier(p.asset_infos[1]);
      return (baseId === base && targetId === target) || 
             (baseId === target && targetId === base);
    });
    
    if (!pool) {
      return c.json({ error: 'Pool not found' }, 404);
    }
    
    // Get historical trades from volume tracker
    const trades = await volumeTracker.getHistoricalTrades(
      pool.contract_addr,
      limit,
      start_time,
      end_time
    );
    
    // Convert to CoinGecko format
    const buyTrades: any[] = [];
    const sellTrades: any[] = [];
    
    trades.forEach((trade, index) => {
      const formattedTrade = {
        trade_id: Date.now() + index, // Generate unique trade ID
        price: trade.price.toString(),
        base_volume: trade.baseVolume.toString(),
        target_volume: trade.targetVolume.toString(),
        trade_timestamp: trade.timestamp.toString(),
        type: index % 2 === 0 ? 'buy' as const : 'sell' as const // TODO: Determine actual trade type
      };
      
      if (formattedTrade.type === 'buy') {
        buyTrades.push(formattedTrade);
      } else {
        sellTrades.push(formattedTrade);
      }
    });
    
    const response: HistoricalTradesResponse = {
      buy: type === 'sell' ? [] : buyTrades,
      sell: type === 'buy' ? [] : sellTrades
    };
    
    return c.json(response);
  } catch (error) {
    console.error('Error fetching historical trades:', error);
    return c.json({ error: 'Failed to fetch historical trades' }, 500);
  }
});

export default coingeckoRoute;