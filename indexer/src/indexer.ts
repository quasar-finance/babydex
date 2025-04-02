import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import {asc, desc, eq, sql, type SQL} from "drizzle-orm";
import {StringChunk} from "drizzle-orm/sql/sql";

import {
  materializedAddLiquidityInV1Cosmos,
  materializedHistoricPoolYieldInV1Cosmos,
  materializedIncentivizeInV1Cosmos,
  materializedPoolBalanceInV1Cosmos,
  materializedPoolsInV1Cosmos,
  materializedPoolUserSharesInV1Cosmos,
  materializedStakeLiquidityInV1Cosmos,
  materializedSwapInV1Cosmos,
  materializedUnstakeLiquidityInV1Cosmos,
  materializedWithdrawLiquidityInV1Cosmos,
} from "./drizzle/schema.js";
import {integer, pgSchema, serial, text} from "drizzle-orm/pg-core";

const v1Cosmos = pgSchema("v1_cosmos");
const userShares = v1Cosmos.table("pool_user_shares", {
  pool_address: text("pool_address").notNull(),
  owner: text("owner").notNull(),
  staked_share_amount: integer("staked_share_amount").notNull(),
  unstaked_share_amount: integer("unstaked_share_amount").notNull(),
  total_share_amount: integer("total_share_amount").notNull(),
  incentive_address: text("incentive_address"),
});

const poolLpToken = v1Cosmos.table("pool_lp_token", {
  id: serial("id").primaryKey(),
  pool: text("pool").notNull(),
  lp_token: text("lp_token").notNull(),
});

export const views = {
  addLiquidity: materializedAddLiquidityInV1Cosmos,
  stakeLiquidity: materializedStakeLiquidityInV1Cosmos,
  unstakeLiquidity: materializedUnstakeLiquidityInV1Cosmos,
  withdrawLiquidity: materializedWithdrawLiquidityInV1Cosmos,
  incentivize: materializedIncentivizeInV1Cosmos,
  swap: materializedSwapInV1Cosmos,
  pools: materializedPoolsInV1Cosmos,
  poolBalance: materializedPoolBalanceInV1Cosmos,
  poolUserShares: materializedPoolUserSharesInV1Cosmos,
  historicPoolYield: materializedHistoricPoolYieldInV1Cosmos,
} as const;

export type Indexer = {
  queryView: <T extends keyof typeof views>(
    viewName: T,
    filters?: IndexerFilters,
  ) => Promise<(typeof views)[T]["$inferSelect"][]>;
  getUserBalances: (
    address: string,
  ) => Promise<((typeof userShares)["$inferSelect"] & { lpToken: string })[]>;
  getCurrentPoolBalances: (
    page: number,
    limit: number,
  ) => Promise<Record<string, unknown>[] | null>;
  getPoolBalancesByPoolAddresses: (
    addresses: string[],
  ) => Promise<Record<string, unknown>[] | null>;
  getCurrentPoolAprs: (
    interval: number,
    page: number,
    limit: number,
  ) => Promise<Record<string, unknown>[] | null>;
  getPoolAprsByPoolAddresses: (
    interval: number,
    addresses: string[],
  ) => Promise<Record<string, unknown>[] | null>;
  getCurrentPoolIncentives: (
    interval: number,
    page: number,
    limit: number,
  ) => Promise<Record<string, unknown>[] | null>;
  getPoolIncentivesByPoolAddresses: (
    interval: number,
    addresses: string[],
  ) => Promise<Record<string, unknown>[] | null>;
  getCurrentPoolVolumes: (page: number, limit: number) => Promise<Record<string, unknown>[] | null>;
  getPoolVolumesByPoolAddresses: (addresses: string[]) => Promise<Record<string, unknown>[] | null>;
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

  async function getUserBalances(address: string) {
    try {
      const response = await client
        .select()
        .from(userShares)
        .leftJoin(poolLpToken, eq(poolLpToken.pool, userShares.pool_address))
        .where(eq(userShares.owner, address));

      return response.map(({pool_user_shares, pool_lp_token}) => ({
        ...pool_user_shares,
        lpToken: pool_lp_token?.lp_token,
      }));
    } catch (error) {
      console.error("Error executing raw query:", error);

      throw error;
    }
  }

  async function getCurrentPoolBalances(
    page: number,
    limit: number,
  ): Promise<Record<string, unknown>[] | null> {
    const offset = (Math.max(1, page) - 1) * limit;
    const query = sql`
        SELECT p.*
        FROM v1_cosmos.materialized_pool_balance p
                 INNER JOIN (SELECT pool_address,
                                    MAX(height) AS max_height
                             FROM v1_cosmos.materialized_pool_balance
                             GROUP BY pool_address) latest
                            ON p.pool_address = latest.pool_address AND p.height = latest.max_height
        ORDER BY p.pool_address
        LIMIT ${limit} OFFSET ${offset};
    `;

    try {
      const result = await client.execute(query);

      return result.rows;
    } catch (error) {
      console.error("Error executing raw query:", error);

      throw error;
    }
  }

  async function getPoolBalancesByPoolAddresses(
    addresses: string[],
  ): Promise<Record<string, unknown>[] | null> {
    const pool_addresses_sql = createPoolAddressArraySql(addresses);
    const query = sql`
        SELECT p.*
        FROM v1_cosmos.materialized_pool_balance p
                 INNER JOIN (SELECT pool_address,
                                    MAX(height) AS max_height
                             FROM v1_cosmos.materialized_pool_balance
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
      console.error("Error executing raw query:", error);

      throw error;
    }
  }

  async function getCurrentPoolVolumes(
    page: number,
    limit: number,
  ): Promise<Record<string, unknown>[] | null> {
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
        FROM v1_cosmos.materialized_swap s
                 JOIN
             v1_cosmos.materialized_pool_balance pb ON s.pool_address = pb.pool_address
        GROUP BY s.pool_address
        ORDER BY s.pool_address
        LIMIT ${limit} OFFSET ${offset};
    `;
    try {
      const result = await client.execute(query);

      return result.rows;
    } catch (error) {
      console.error("Error executing raw query:", error);

      throw error;
    }
  }

  async function getPoolVolumesByPoolAddresses(
    addresses: string[],
  ): Promise<Record<string, unknown>[] | null> {
    const pool_addresses_sql = createPoolAddressArraySql(addresses);
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
        FROM v1_cosmos.materialized_swap s
                 JOIN
             v1_cosmos.materialized_pool_balance pb ON s.pool_address = pb.pool_address
        WHERE s.pool_address = ${pool_addresses_sql}
        GROUP BY s.pool_address;
    `;

    try {
      const result = await client.execute(query);

      return result.rows;
    } catch (error) {
      console.error("Error executing raw query:", error);

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
  async function getCurrentPoolAprs(
    interval: number,
    page: number,
    limit: number,
  ): Promise<Record<string, unknown>[] | null> {
    const intervalSql = createIntervalSql(interval);
    const offset = (Math.max(1, page) - 1) * limit;
    const query = sql`
        WITH daily_yield AS (SELECT pool_address,
                                    fees_usd / total_liquidity_usd / (EXTRACT(EPOCH FROM (LEAD(timestamp, 1, NOW())
                                                                                          OVER (PARTITION BY pool_address ORDER BY timestamp) -
                                                                                          timestamp)) /
                                                                      86400) AS daily_yield
                             FROM v1_cosmos.materialized_historic_pool_yield
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
      console.error("Error executing raw query:", error);
      throw error;
    }
  }

  async function getPoolAprsByPoolAddresses(
    interval: number,
    addresses: string[],
  ): Promise<Record<string, unknown>[] | null> {
    const intervalSql = createIntervalSql(interval);
    const poolAddressesSql = createPoolAddressArraySql(addresses);
    const query = sql`
        WITH daily_yield AS (SELECT pool_address,
                                    fees_usd / total_liquidity_usd / (EXTRACT(EPOCH FROM (LEAD(timestamp, 1, NOW())
                                                                                          OVER (PARTITION BY pool_address ORDER BY timestamp) -
                                                                                          timestamp)) /
                                                                      86400) AS daily_yield
                             FROM v1_cosmos.materialized_historic_pool_yield
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
      console.error("Error executing raw query:", error);

      throw error;
    }
  }

  /**
   *
   * @param interval
   * @param page
   * @param limit
   *
   * @description
   *
   * SUM(i.rewards_per_second * (...)): We calculate the total incentives for each
   * pool by summing the product of rewards_per_second and the duration of each incentive period.
   *
   * The CASE statement handles different scenarios:
   *
   *     WHEN i.end_ts <= EXTRACT(EPOCH FROM NOW()) THEN i.end_ts - i.start_ts:
   *        If the incentive period ended before the current time, we use the full duration of the period.
   *     WHEN i.start_ts >= EXTRACT(EPOCH FROM NOW()) - (days * 86400) THEN EXTRACT(EPOCH FROM NOW()) - i.start_ts:
   *        If the incentive period started within the specified timeframe, we calculate the duration from the start time to the current time.
   *     ELSE EXTRACT(EPOCH FROM NOW()) - (EXTRACT(EPOCH FROM NOW()) - (days * 86400)):
   *        If the incentive period spans the beginning of the timeframe, we calculate the duration of the period that falls within the timeframe.
   */
  async function getCurrentPoolIncentives(
    interval: number,
    page: number,
    limit: number,
  ): Promise<Record<string, unknown>[] | null> {
    const intervalSql = createIntervalSql(interval);
    const offset = (Math.max(1, page) - 1) * limit;
    const dayInSecondsSql = sql.raw("86400");
    const query = sql`
        SELECT plt.pool     AS pool_address,
               plt.lp_token AS lp_token_address,
               CASE
                   WHEN SUM(i.rewards_per_second * (
                       CASE
                           WHEN i.end_ts <= EXTRACT(EPOCH FROM NOW()) THEN i.end_ts - i.start_ts
                           WHEN i.start_ts >= EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql})
                               THEN EXTRACT(EPOCH FROM NOW()) - i.start_ts
                           ELSE EXTRACT(EPOCH FROM NOW()) -
                                (EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql}))
                           END
                       )) IS NULL THEN NULL
                   ELSE SUM(i.rewards_per_second * (
                       CASE
                           WHEN i.end_ts <= EXTRACT(EPOCH FROM NOW()) THEN i.end_ts - i.start_ts
                           WHEN i.start_ts >= EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql})
                               THEN EXTRACT(EPOCH FROM NOW()) - i.start_ts
                           ELSE EXTRACT(EPOCH FROM NOW()) -
                                (EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql}))
                           END
                       ))
                   END      AS total_incentives
        FROM v1_cosmos.pool_lp_token plt
                 LEFT JOIN
             v1_cosmos.materialized_incentivize i ON plt.lp_token = i.lp_token
        WHERE i.timestamp >= NOW() - (${intervalSql} || ' days')::INTERVAL
        GROUP BY plt.pool, plt.lp_token
        ORDER BY plt.pool
        LIMIT ${limit} OFFSET ${offset};
    `;

    try {
      const result = await client.execute(query);
      return result.rows;
    } catch (error) {
      console.error("Error executing raw query:", error);
      throw error;
    }
  }

  /**
   *
   * @param interval
   * @param addresses
   *
   * @description See getCurrentPoolIncentives
   */
  async function getPoolIncentivesByPoolAddresses(
    interval: number,
    addresses: string[],
  ): Promise<Record<string, unknown>[] | null> {
    const intervalSql = createIntervalSql(interval);
    const poolAddressesSql = createPoolAddressArraySql(addresses);
    const dayInSecondsSql = sql.raw("86400");
    const query = sql`
        SELECT plt.pool     AS pool_address,
               plt.lp_token AS lp_token_address,
               CASE
                   WHEN SUM(i.rewards_per_second * (
                       CASE
                           WHEN i.end_ts <= EXTRACT(EPOCH FROM NOW()) THEN i.end_ts - i.start_ts
                           WHEN i.start_ts >= EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql})
                               THEN EXTRACT(EPOCH FROM NOW()) - i.start_ts
                           ELSE EXTRACT(EPOCH FROM NOW()) -
                                (EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql}))
                           END
                       )) IS NULL THEN NULL
                   ELSE SUM(i.rewards_per_second * (
                       CASE
                           WHEN i.end_ts <= EXTRACT(EPOCH FROM NOW()) THEN i.end_ts - i.start_ts
                           WHEN i.start_ts >= EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql})
                               THEN EXTRACT(EPOCH FROM NOW()) - i.start_ts
                           ELSE EXTRACT(EPOCH FROM NOW()) -
                                (EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql}))
                           END
                       ))
                   END      AS total_incentives
        FROM v1_cosmos.pool_lp_token plt
                 LEFT JOIN
             v1_cosmos.materialized_incentivize i ON plt.lp_token = i.lp_token
        WHERE i.timestamp >= NOW() - (${intervalSql} || ' days')::INTERVAL
          AND plt.pool = ${poolAddressesSql}
        GROUP BY plt.pool, plt.lp_token
        ORDER BY plt.pool;
    `;

    try {
      const result = await client.execute(query);
      return result.rows;
    } catch (error) {
      console.error("Error executing raw query:", error);
      throw error;
    }
  }

  function createPoolAddressArraySql(addresses: string[]): SQL<unknown> {
    if (!addresses || addresses.length === 0) {
      return sql.raw(`ANY('{}'::text[])`);
    }

    const quotedAddresses = addresses.map((address) => `"${address}"`).join(",");

    return sql.raw(`ANY('{${quotedAddresses}}'::text[])`);
  }

  function createIntervalSql(interval: number) {
    return sql.raw(Math.min(Math.max(1, interval), 365).toString());
  }

  return {
    queryView,
    getUserBalances,
    getCurrentPoolBalances,
    getPoolBalancesByPoolAddresses,
    getCurrentPoolVolumes,
    getPoolVolumesByPoolAddresses,
    getCurrentPoolAprs,
    getPoolAprsByPoolAddresses,
    getCurrentPoolIncentives,
    getPoolIncentivesByPoolAddresses,
  } as Indexer;
};
