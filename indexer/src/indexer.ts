import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import {asc, desc, sql} from "drizzle-orm";
import {StringChunk} from "drizzle-orm/sql/sql";

import {
  addLiquidityInV1Cosmos,
  historicPoolYieldInV1Cosmos,
  incentivizeInV1Cosmos,
  poolBalanceInV1Cosmos,
  poolFeePeriodsInV1Cosmos,
  poolsInV1Cosmos,
  poolUserSharesInV1Cosmos,
  swapInV1Cosmos,
  withdrawLiquidityInV1Cosmos,
} from "./drizzle/schema.js";

const views = {
  addLiquidity: addLiquidityInV1Cosmos,
  historicPoolYield: historicPoolYieldInV1Cosmos,
  incentivize: incentivizeInV1Cosmos,
  pools: poolsInV1Cosmos,
  poolBalance: poolBalanceInV1Cosmos,
  poolFeePeriods: poolFeePeriodsInV1Cosmos,
  poolUserShares: poolUserSharesInV1Cosmos,
  swap: swapInV1Cosmos,
  withdrawLiquidity: withdrawLiquidityInV1Cosmos,
} as const;

export type Indexer = {
  queryView: <T extends keyof typeof views>(
    viewName: T,
    filters?: IndexerFilters,
  ) => Promise<(typeof views)[T]["$inferSelect"][]>;
  getCurrentPoolBalances: (
    page: number,
    limit: number
  ) => Promise<Record<string, unknown>[] | null>;
  getPoolBalancesByPoolAddresses: (
    addresses: string[]
  ) => Promise<Record<string, unknown>[] | null>;
  getCurrentPoolVolumes: (
    page: number,
    limit: number
  ) => Promise<Record<string, unknown>[] | null>;
  getPoolVolumesByPoolAddresses: (
    addresses: string[]
  ) => Promise<Record<string, unknown>[] | null>;
  getCurrentPoolAprs: (
    interval: number,
    page: number,
    limit: number
  ) => Promise<Record<string, unknown>[] | null>;
  getPoolAprsByPoolAddresses: (
    interval: number,
    addresses: string[]
  ) => Promise<Record<string, unknown>[] | null>;
};

export type IndexerFilters = {
  orderBy?: "asc" | "desc";
  limit?: number;
  orderByColumn?: string;
  page?: number;
};

export type IndexerDbCredentials = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
};

export const createIndexerService = (config: IndexerDbCredentials) => {
  const pool = new Pool(config);

  const client = drizzle(pool);

  async function queryView(viewName: keyof typeof views, filters?: IndexerFilters) {
    const query = client.select().from(views[viewName]);

    if (!filters) return await query;

    const {orderBy = "asc", page = 1, limit = 50, orderByColumn} = filters;

    const dynamicQuery = query.$dynamic();

    dynamicQuery.limit(limit).offset((page - 1) * limit);

    if (orderByColumn) {
      const orderByColumnSQL = new StringChunk(orderByColumn);
      dynamicQuery.orderBy(orderBy === "asc" ? asc(orderByColumnSQL) : desc(orderByColumnSQL));
    }

    return await dynamicQuery;
  }

  async function getCurrentPoolBalances(page: number, limit: number): Promise<Record<string, unknown>[] | null> {
    const offset = (Math.max(1, page) - 1) * limit;
    const query = sql`
        SELECT p.*
        FROM v1_cosmos.pool_balance p
                 INNER JOIN (SELECT pool_address,
                                    MAX(height) AS max_height
                             FROM v1_cosmos.pool_balance
                             GROUP BY pool_address) latest
                            ON p.pool_address = latest.pool_address AND p.height = latest.max_height
        ORDER BY p.pool_address
        LIMIT ${limit} OFFSET ${offset};
    `;

    try {
      const result = await client.execute(query);

      return result.rows;
    } catch (error) {
      console.error('Error executing raw query:', error);

      throw error;
    }
  }

  async function getPoolBalancesByPoolAddresses(addresses: string[]): Promise<Record<string, unknown>[] | null> {
    const pool_addresses_sql = sql.raw(createPoolAddressArraySql(addresses));
    const query = sql`
        SELECT p.*
        FROM v1_cosmos.pool_balance p
                 INNER JOIN (SELECT pool_address,
                                    MAX(height) AS max_height
                             FROM v1_cosmos.pool_balance
                             WHERE pool_address = ${pool_addresses_sql}
                             GROUP BY pool_address) latest
                            ON p.pool_address = latest.pool_address AND p.height = latest.max_height
        WHERE p.pool_address = ${pool_addresses_sql}
        ORDER BY p.pool_address;
    `;

    try {
      const result = await client.execute(query);

      return result.rows;
    } catch (error) {
      console.error('Error executing raw query:', error);

      throw error;
    }
  }

  async function getCurrentPoolVolumes(page: number, limit: number): Promise<Record<string, unknown>[] | null> {
    const offset = (Math.max(1, page) - 1) * limit;
    const query = sql`
        SELECT s.pool_address,
               SUM(
                       CASE
                           WHEN s.offer_asset = pb.token0_denom THEN offer_amount
                           ELSE 0
                           END
               ) AS token0_volume,
               SUM(
                       CASE
                           WHEN s.offer_asset = pb.token1_denom THEN offer_amount
                           ELSE 0
                           END
               ) AS token1_volume
        FROM v1_cosmos.swap s
                 JOIN
             v1_cosmos.pool_balance pb ON s.pool_address = pb.pool_address
        GROUP BY s.pool_address
        ORDER BY s.pool_address
        LIMIT ${limit} OFFSET ${offset};
    `;
    try {
      const result = await client.execute(query);

      return result.rows;
    } catch (error) {
      console.error('Error executing raw query:', error);

      throw error;
    }
  }

  async function getPoolVolumesByPoolAddresses(addresses: string[]): Promise<Record<string, unknown>[] | null> {
    const pool_addresses_sql = sql.raw(createPoolAddressArraySql(addresses));
    const query = sql`
        SELECT s.pool_address,
               SUM(
                       CASE
                           WHEN s.offer_asset = pb.token0_denom THEN offer_amount
                           ELSE 0
                           END
               ) AS token0_volume,
               SUM(
                       CASE
                           WHEN s.offer_asset = pb.token1_denom THEN offer_amount
                           ELSE 0
                           END
               ) AS token1_volume
        FROM v1_cosmos.swap s
                 JOIN
             v1_cosmos.pool_balance pb ON s.pool_address = pb.pool_address
        WHERE s.pool_address = ${pool_addresses_sql}
        GROUP BY s.pool_address;
    `;

    try {
      const result = await client.execute(query);

      return result.rows;
    } catch (error) {
      console.error('Error executing raw query:', error);

      throw error;
    }
  }

  /**
   * @param interval
   * @param page
   * @param limit
   *
   * @description Daily Interval Calculation
   *
   *     LEAD(timestamp, 1, NOW()) OVER (PARTITION BY pool_address ORDER BY timestamp): This window function retrieves
   *     the timestamp of the next row for the same pool_address, ordered by timestamp. If there's no next row, it defaults to NOW().
   *     LEAD(...) - timestamp: This calculates the time difference between the current row's timestamp and the next row's timestamp.
   *     EXTRACT(EPOCH FROM (...)): This converts the time difference to seconds.
   *     / 86400: This converts the time difference from seconds to days.
   *     fees_usd / total_liquidity_usd / (...): This divides the fees earned by the liquidity and the calculated interval in days to get the daily yield.
   *     * 365: This annualizes the daily yield to get the APR.
   *     AVG(...): This calculates the average APR for each pool.
   */
  async function getCurrentPoolAprs(interval: number, page: number, limit: number): Promise<Record<string, unknown>[] | null> {
    const intervalSql = sql.raw(Math.min(Math.max(1, interval), 365).toString());
    const offset = (Math.max(1, page) - 1) * limit;
    const query = sql`
        WITH daily_yield AS (SELECT pool_address,
                                    fees_usd / total_liquidity_usd / (EXTRACT(EPOCH FROM (LEAD(timestamp, 1, NOW())
                                                                                          OVER (PARTITION BY pool_address ORDER BY timestamp) -
                                                                                          timestamp)) /
                                                                      86400) AS daily_yield
                             FROM v1_cosmos.historic_pool_yield
                             WHERE timestamp >= NOW() - INTERVAL '${intervalSql} day'
                               AND total_liquidity_usd > 0)
        SELECT pool_address,
               AVG(daily_yield) * 365 AS avg_apr
        FROM daily_yield
        GROUP BY pool_address
        ORDER BY pool_address
        LIMIT ${limit} OFFSET ${offset};
    `;

    try {
      const result = await client.execute(query);
      return result.rows;
    } catch (error) {
      console.error('Error executing raw query:', error);
      throw error;
    }
  }

  async function getPoolAprsByPoolAddresses(interval: number, addresses: string[]): Promise<Record<string, unknown>[] | null> {
    const intervalSql = sql.raw(Math.min(Math.max(1, interval), 365).toString());
    const poolAddressesSql = sql.raw(createPoolAddressArraySql(addresses));
    const query = sql`
        WITH daily_yield AS (SELECT pool_address,
                                    fees_usd / total_liquidity_usd / (EXTRACT(EPOCH FROM (LEAD(timestamp, 1, NOW())
                                                                                          OVER (PARTITION BY pool_address ORDER BY timestamp) -
                                                                                          timestamp)) /
                                                                      86400) AS daily_yield
                             FROM v1_cosmos.historic_pool_yield
                             WHERE timestamp >= NOW() - INTERVAL '${intervalSql} day'
                               AND total_liquidity_usd > 0
                               AND pool_address = ${poolAddressesSql})
        SELECT pool_address,
               AVG(daily_yield) * 365 AS avg_apr
        FROM daily_yield
        GROUP BY pool_address
        ORDER BY pool_address;
    `;

    try {
      const result = await client.execute(query);

      return result.rows;
    } catch (error) {
      console.error('Error executing raw query:', error);

      throw error;
    }
  }

  function createPoolAddressArraySql(addresses: string[]): string {
    if (!addresses || addresses.length === 0) {
      return `ANY('{}'::text[])`;
    }

    const quotedAddresses = addresses.map(address => `"${address}"`).join(',');

    return `ANY('{${quotedAddresses}}'::text[])`;
  }

  return {
    queryView,
    getCurrentPoolBalances,
    getPoolBalancesByPoolAddresses,
    getCurrentPoolVolumes,
    getPoolVolumesByPoolAddresses,
    getCurrentPoolAprs,
    getPoolAprsByPoolAddresses,
  } as Indexer;
}
