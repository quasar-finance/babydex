import { drizzle } from 'drizzle-orm/node-postgres';
import { sql, eq, desc, and, gte, lte, inArray } from 'drizzle-orm';
import pg from 'pg';
const { Client } = pg;
import { 
  materializedSwapInV1Cosmos,
  materializedPoolBalanceInV1Cosmos,
  materializedPoolsInV1Cosmos,
  tokenPricesInV1Cosmos,
  tokenInV1Cosmos
} from '../../../indexer/src/drizzle/schema.js';

export interface DatabaseConfig {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
  ssl?: boolean;
  schema?: string;
  hyperdrive?: any; // Cloudflare Hyperdrive binding
}

export interface PoolInfo {
  poolAddress: string;
  token0: string;
  token1: string;
  timestamp: string;
  height: number;
}

export interface SwapData {
  sender: string;
  receiver: string | null;
  offerAsset: string;
  offerAmount: string;
  askAsset: string;
  returnAmount: string;
  commissionAmount: string | null;
  poolAddress: string;
  timestamp: string;
  transactionHash: string | null;
  height: number;
}

export interface PoolBalance {
  poolAddress: string;
  token0Denom: string;
  token0Balance: string;
  token1Denom: string;
  token1Balance: string;
  height: number;
}

export interface TokenPrice {
  token: string | null;
  price: string | null;
  lastUpdatedAt: string | null;
}

export class DatabaseService {
  private db!: ReturnType<typeof drizzle>;
  private client: InstanceType<typeof Client>;
  private schema: string;
  private isConnected: boolean = false;

  constructor(config: DatabaseConfig) {
    this.schema = config.schema || 'public';
    
    // Use Hyperdrive if available, otherwise fallback to direct connection
    if (config.hyperdrive) {
      // Use Hyperdrive connection in Cloudflare Workers
      this.client = new Client({
        connectionString: config.hyperdrive.connectionString,
        connectionTimeoutMillis: 10000,
      });
    } else {
      // Direct connection for local development
      this.client = new Client({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        ssl: config.ssl ? { rejectUnauthorized: false } : false,
        connectionTimeoutMillis: 10000,
      });
    }
  }

  /**
   * Initialize connection - MUST be called before any queries
   */
  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
      
      // Create drizzle instance after connecting
      this.db = drizzle(this.client);
      
      // Set schema search path
      if (this.schema && this.schema !== 'public') {
        await this.db.execute(sql`SET search_path TO ${sql.raw(this.schema)}, public`);
      }
    }
  }

  /**
   * Ensure connected before queries
   */
  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  /**
   * Get all pools with their token pairs
   */
  async getPools(limit: number = 100): Promise<PoolInfo[]> {
    await this.ensureConnected();
    const pools = await this.db
      .select({
        poolAddress: materializedPoolsInV1Cosmos.poolAddress,
        token0: materializedPoolsInV1Cosmos.token0,
        token1: materializedPoolsInV1Cosmos.token1,
        timestamp: materializedPoolsInV1Cosmos.timestamp,
        height: materializedPoolsInV1Cosmos.height,
      })
      .from(materializedPoolsInV1Cosmos)
      .orderBy(desc(materializedPoolsInV1Cosmos.height))
      .limit(limit);

    return pools.map((pool: any) => ({
      poolAddress: pool.poolAddress || '',
      token0: pool.token0 || '',
      token1: pool.token1 || '',
      timestamp: pool.timestamp || '',
      height: Number(pool.height || 0),
    }));
  }

  /**
   * Get current pool balance for a specific pool
   */
  async getPoolBalance(poolAddress: string): Promise<PoolBalance | null> {
    await this.ensureConnected();
    const result = await this.db
      .select({
        poolAddress: materializedPoolBalanceInV1Cosmos.poolAddress,
        token0Denom: materializedPoolBalanceInV1Cosmos.token0Denom,
        token0Balance: materializedPoolBalanceInV1Cosmos.token0Balance,
        token1Denom: materializedPoolBalanceInV1Cosmos.token1Denom,
        token1Balance: materializedPoolBalanceInV1Cosmos.token1Balance,
        height: materializedPoolBalanceInV1Cosmos.height,
      })
      .from(materializedPoolBalanceInV1Cosmos)
      .where(eq(materializedPoolBalanceInV1Cosmos.poolAddress, poolAddress))
      .orderBy(desc(materializedPoolBalanceInV1Cosmos.height))
      .limit(1);

    if (result.length === 0) return null;

    const balance = result[0];
    return {
      poolAddress: balance.poolAddress || '',
      token0Denom: balance.token0Denom || '',
      token0Balance: balance.token0Balance?.toString() || '0',
      token1Denom: balance.token1Denom || '',
      token1Balance: balance.token1Balance?.toString() || '0',
      height: Number(balance.height || 0),
    };
  }

  /**
   * Get pool balances for multiple pools
   */
  async getBatchPoolBalances(poolAddresses: string[]): Promise<PoolBalance[]> {
    if (poolAddresses.length === 0) return [];
    
    // Get latest balance for each pool
    const latestBalances = await this.db
      .select({
        poolAddress: materializedPoolBalanceInV1Cosmos.poolAddress,
        token0Denom: materializedPoolBalanceInV1Cosmos.token0Denom,
        token0Balance: materializedPoolBalanceInV1Cosmos.token0Balance,
        token1Denom: materializedPoolBalanceInV1Cosmos.token1Denom,
        token1Balance: materializedPoolBalanceInV1Cosmos.token1Balance,
        height: materializedPoolBalanceInV1Cosmos.height,
        maxHeight: sql<number>`max(${materializedPoolBalanceInV1Cosmos.height}) over (partition by ${materializedPoolBalanceInV1Cosmos.poolAddress})`,
      })
      .from(materializedPoolBalanceInV1Cosmos)
      .where(inArray(materializedPoolBalanceInV1Cosmos.poolAddress, poolAddresses))
      .orderBy(desc(materializedPoolBalanceInV1Cosmos.height));

    // Filter to only latest heights for each pool
    const filteredBalances = latestBalances.filter((balance: any) => 
      Number(balance.height) === Number(balance.maxHeight)
    );

    return filteredBalances.map((balance: any) => ({
      poolAddress: balance.poolAddress || '',
      token0Denom: balance.token0Denom || '',
      token0Balance: balance.token0Balance?.toString() || '0',
      token1Denom: balance.token1Denom || '',
      token1Balance: balance.token1Balance?.toString() || '0',
      height: Number(balance.height || 0),
    }));
  }

  /**
   * Get 24-hour trading volume for a pool
   */
  async get24HourVolume(poolAddress: string): Promise<{
    baseVolume: string;
    targetVolume: string;
    high: string | null;
    low: string | null;
    swapCount: number;
  }> {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const swaps = await this.db
      .select({
        offerAsset: materializedSwapInV1Cosmos.offerAsset,
        offerAmount: materializedSwapInV1Cosmos.offerAmount,
        askAsset: materializedSwapInV1Cosmos.askAsset,
        returnAmount: materializedSwapInV1Cosmos.returnAmount,
      })
      .from(materializedSwapInV1Cosmos)
      .where(
        and(
          eq(materializedSwapInV1Cosmos.poolAddress, poolAddress),
          gte(materializedSwapInV1Cosmos.timestamp, oneDayAgo.toISOString())
        )
      );

    // Group by asset and sum volumes
    const volumeMap = new Map<string, bigint>();
    let swapCount = 0;
    let prices: number[] = [];

    for (const swap of swaps) {
      swapCount++;
      
      // Only count input volume (offer amounts) to avoid double-counting
      if (swap.offerAsset && swap.offerAmount) {
        const current = volumeMap.get(swap.offerAsset) || 0n;
        volumeMap.set(swap.offerAsset, current + BigInt(swap.offerAmount.toString()));
      }

      // Calculate price for high/low
      if (swap.offerAmount && swap.returnAmount) {
        const price = Number(swap.returnAmount.toString()) / Number(swap.offerAmount.toString());
        if (price > 0 && isFinite(price)) {
          prices.push(price);
        }
      }
    }

    const volumes = Array.from(volumeMap.entries());
    const baseVolume = volumes.length > 0 ? volumes[0][1].toString() : '0';
    const targetVolume = volumes.length > 1 ? volumes[1][1].toString() : '0';

    const high = prices.length > 0 ? Math.max(...prices).toString() : null;
    const low = prices.length > 0 ? Math.min(...prices).toString() : null;

    return {
      baseVolume,
      targetVolume,
      high,
      low,
      swapCount,
    };
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
    // Add time filters if provided
    const conditions = [eq(materializedSwapInV1Cosmos.poolAddress, poolAddress)];
    
    if (startTime) {
      conditions.push(gte(materializedSwapInV1Cosmos.timestamp, new Date(startTime * 1000).toISOString()));
    }
    
    if (endTime) {
      conditions.push(lte(materializedSwapInV1Cosmos.timestamp, new Date(endTime * 1000).toISOString()));
    }

    const trades = await this.db
      .select({
        sender: materializedSwapInV1Cosmos.sender,
        receiver: materializedSwapInV1Cosmos.receiver,
        offerAsset: materializedSwapInV1Cosmos.offerAsset,
        offerAmount: materializedSwapInV1Cosmos.offerAmount,
        askAsset: materializedSwapInV1Cosmos.askAsset,
        returnAmount: materializedSwapInV1Cosmos.returnAmount,
        commissionAmount: materializedSwapInV1Cosmos.commissionAmount,
        poolAddress: materializedSwapInV1Cosmos.poolAddress,
        timestamp: materializedSwapInV1Cosmos.timestamp,
        transactionHash: materializedSwapInV1Cosmos.transactionHash,
        height: materializedSwapInV1Cosmos.height,
      })
      .from(materializedSwapInV1Cosmos)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0])
      .orderBy(desc(materializedSwapInV1Cosmos.timestamp))
      .limit(limit);

    return trades.map((trade: any) => ({
      sender: trade.sender || '',
      receiver: trade.receiver,
      offerAsset: trade.offerAsset || '',
      offerAmount: trade.offerAmount?.toString() || '0',
      askAsset: trade.askAsset || '',
      returnAmount: trade.returnAmount?.toString() || '0',
      commissionAmount: trade.commissionAmount?.toString() || null,
      poolAddress: trade.poolAddress || '',
      timestamp: trade.timestamp || '',
      transactionHash: trade.transactionHash,
      height: Number(trade.height || 0),
    }));
  }

  /**
   * Get token prices
   */
  async getTokenPrices(tokens: string[]): Promise<TokenPrice[]> {
    if (tokens.length === 0) return [];

    // Get only the latest price for each token using window function
    const latestPrices = await this.db.execute(sql`
      WITH latest_prices AS (
        SELECT DISTINCT ON (token) token, price, last_updated_at
        FROM v1_cosmos.token_prices 
        WHERE token = ANY(${sql.raw(`ARRAY[${tokens.map(token => `'${token.replace(/'/g, "''")}'`).join(',')}]`)})
        ORDER BY token, created_at DESC
      )
      SELECT token, price, last_updated_at 
      FROM latest_prices
    `);

    return latestPrices.rows.map((row: any) => ({
      token: row.token,
      price: row.price?.toString() || null,
      lastUpdatedAt: row.last_updated_at?.toString() || null,
    }));
  }

  /**
   * Get token metadata including decimals by token name
   */
  async getTokenInfo(tokenName: string): Promise<{
    decimals: number | null;
    denomination: string | null;
    coingeckoId: string;
  } | null> {
    const result = await this.db
      .select({
        decimals: tokenInV1Cosmos.decimals,
        denomination: tokenInV1Cosmos.denomination,
        coingeckoId: tokenInV1Cosmos.coingeckoId,
      })
      .from(tokenInV1Cosmos)
      .where(eq(tokenInV1Cosmos.tokenName, tokenName))
      .limit(1);

    if (result.length === 0) return null;

    const token = result[0];
    return {
      decimals: token.decimals ? Number(token.decimals) : null,
      denomination: token.denomination,
      coingeckoId: token.coingeckoId,
    };
  }

  /**
   * Get token decimals by denomination
   */
  async getTokenDecimals(denomination: string): Promise<number | null> {
    const result = await this.db
      .select({
        decimals: tokenInV1Cosmos.decimals,
      })
      .from(tokenInV1Cosmos)
      .where(eq(tokenInV1Cosmos.denomination, denomination))
      .limit(1);

    if (result.length === 0) return null;

    return result[0].decimals ? Number(result[0].decimals) : null;
  }

  /**
   * Get token symbols for multiple tokens by their denomination/contract address
   */
  async getTokenSymbols(denoms: string[]): Promise<Map<string, string>> {
    if (denoms.length === 0) return new Map();

    const tokens = await this.db
      .select({
        tokenName: tokenInV1Cosmos.tokenName,
        denomination: tokenInV1Cosmos.denomination,
      })
      .from(tokenInV1Cosmos)
      .where(inArray(tokenInV1Cosmos.denomination, denoms));

    const symbolMap = new Map<string, string>();
    for (const token of tokens) {
      if (token.denomination && token.tokenName) {
        symbolMap.set(token.denomination, token.tokenName);
      }
    }

    // Add fallback for tokens not in database
    for (const denom of denoms) {
      if (!symbolMap.has(denom)) {
        // Use shortened version for IBC tokens
        if (denom.startsWith('ibc/')) {
          symbolMap.set(denom, 'IBC_' + denom.slice(4, 10));
        } else if (denom.startsWith('u')) {
          // Native denoms like ubbn -> BBN
          symbolMap.set(denom, denom.slice(1).toUpperCase());
        } else {
          // Contract addresses - use first/last 6 chars
          symbolMap.set(denom, denom.slice(0, 6) + '...' + denom.slice(-6));
        }
      }
    }

    return symbolMap;
  }

  /**
   * Close database connection
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.end();
      this.isConnected = false;
    }
  }

  /**
   * Test database connection
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.connect(); // Set schema
      const result = await this.db.execute(sql`SELECT 1 as test`);
      return Array.isArray(result) ? result.length > 0 : result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}