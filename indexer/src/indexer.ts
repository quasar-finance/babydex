import {drizzle} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import {asc, desc, eq, sql, type SQL} from "drizzle-orm";
import {StringChunk} from "drizzle-orm/sql/sql";
import type {PoolIncentive, PoolMetric} from "@towerfi/types";

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
  ) => Promise<Record<string, PoolIncentive> | null>;
  getCurrentPoolVolumes: (page: number, limit: number) => Promise<Record<string, unknown>[] | null>;
  getPoolVolumesByPoolAddresses: (addresses: string[]) => Promise<Record<string, unknown>[] | null>;
  getPoolMetricsByPoolAddresses: (addresses: string[], startDate?: Date | null, endDate?: Date | null) => Promise<Record<string, PoolMetric> | null>;
  getPoolIncentiveAprsByPoolAddresses: (addresses: string[], startDate?: Date | null, endDate?: Date | null) => Promise<Record<string, unknown> | null>;
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
                                    CASE
                                        WHEN total_liquidity_usd > 0 AND (EXTRACT(EPOCH FROM (LEAD(timestamp, 1, NOW())
                                                                                              OVER (PARTITION BY pool_address ORDER BY timestamp) -
                                                                                              timestamp)) / 86400) > 0
                                            THEN fees_usd / total_liquidity_usd / (EXTRACT(EPOCH FROM (
                                                    LEAD(timestamp, 1, NOW())
                                                    OVER (PARTITION BY pool_address ORDER BY timestamp) - timestamp)) /
                                                                                   86400)
                                        ELSE 0
                                        END AS daily_yield
                             FROM v1_cosmos.materialized_historic_pool_yield
                             WHERE timestamp >= NOW() - INTERVAL '${intervalSql} day')
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
                                    CASE
                                        WHEN total_liquidity_usd > 0 AND (EXTRACT(EPOCH FROM (LEAD(timestamp, 1, NOW())
                                                                                              OVER (PARTITION BY pool_address ORDER BY timestamp) -
                                                                                              timestamp)) / 86400) > 0
                                            THEN fees_usd / total_liquidity_usd / (EXTRACT(EPOCH FROM (
                                                    LEAD(timestamp, 1, NOW())
                                                    OVER (PARTITION BY pool_address ORDER BY timestamp) - timestamp)) /
                                                                                   86400)
                                        ELSE 0
                                        END AS daily_yield
                             FROM v1_cosmos.materialized_historic_pool_yield
                             WHERE timestamp >= NOW() - INTERVAL '${intervalSql} day'
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
               i.rewards_per_second, as rewards_per_second,
               i.reward as reward_token,
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
                LEFT JOIN v1_cosmos.token t0 ON i.reward = t0.denomination
        WHERE i.timestamp >= NOW() - (${intervalSql} || ' days')::INTERVAL
        GROUP BY plt.pool, plt.lp_token, i.rewards_per_second, i.reward
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
  ): Promise<Record<string, PoolIncentive> | null> {
    const intervalSql = createIntervalSql(interval);
    const poolAddressesSql = createPoolAddressArraySql(addresses);
    const dayInSecondsSql = sql.raw("86400");
    const query = sql`
        SELECT plt.pool     AS pool_address,
               plt.lp_token AS lp_token_address,
               i.rewards_per_second AS rewards_per_second,
               i.reward AS reward_token,
               t0.decimals AS token_decimals,
               i.start_ts,
               i.end_ts,
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
                LEFT JOIN v1_cosmos.token t0 ON i.reward = t0.denomination
        WHERE i.timestamp >= NOW() - (${intervalSql} || ' days')::INTERVAL
          AND plt.pool = ${poolAddressesSql}
        GROUP BY plt.pool, plt.lp_token, i.rewards_per_second, i.reward, t0.decimals, i.start_ts, i.end_ts
        ORDER BY plt.pool;
    `;

    try {
      const result = await client.execute(query);
      return result.rows.reduce<Record<string, PoolIncentive>>((acc, row) => ({
        ...acc,
        [row.pool_address as string]: {
          ...row as unknown as PoolIncentive
        } as PoolIncentive,
      }), {});    } catch (error) {
      console.error("Error executing raw query:", error);
      throw error;
    }
  }



  async function getPoolIncentiveAprsByPoolAddresses(
    addresses: string[],
    startDate?: Date,
    endDate?: Date,
  ): Promise<Record<string, unknown>[] | null> {
    try {
      const now = new Date();
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : now;

      if (startDate && start > now) {
        throw new Error("Start date cannot be in the future.");
      }

      if (start > end) {
        throw new Error("Start date cannot be after the end date.");
      }

      const poolAddressesSql = createPoolAddressArraySql(addresses);
      const query = sql`
          WITH current_incentives AS (SELECT i.lp_token,
                                             i.reward AS incentive_token_denom,
                                             i.rewards_per_second,
                                             i.start_ts,
                                             i.end_ts
                                      FROM v1_cosmos.materialized_incentivize i
                                      WHERE i.start_ts <= EXTRACT(EPOCH FROM ${end}::timestamp)
                                        AND i.end_ts >= EXTRACT(EPOCH FROM ${start}::timestamp)),
               incentives_value_over_time AS (SELECT ci.lp_token,
                                                     SUM(ci.rewards_per_second /
                                                         power(10, t_incentive.decimals) *
                                                         COALESCE(tp_incentive.price, 0) *
                                                         (LEAST(ci.end_ts, EXTRACT(EPOCH FROM ${end}::timestamp)) -
                                                          GREATEST(ci.start_ts, EXTRACT(EPOCH FROM ${start}::timestamp)))) AS total_incentive_value_usd
                                              FROM current_incentives ci
                                                       JOIN v1_cosmos.token t_incentive
                                                            ON ci.incentive_token_denom = t_incentive.token_name
                                                       LEFT JOIN v1_cosmos.token_prices tp_incentive
                                                                 ON t_incentive.token_name = tp_incentive.token AND
                                                                    tp_incentive.created_at = (SELECT MAX(created_at)
                                                                                               FROM v1_cosmos.token_prices
                                                                                               WHERE token = t_incentive.token_name
                                                                                                 AND price IS NOT NULL
                                                                                                 AND created_at <= ${now}::timestamp)
                                              GROUP BY ci.lp_token),
               pool_info AS (SELECT DISTINCT plt.pool AS pool_address,
                                             plt.lp_token
                             FROM v1_cosmos.pool_lp_token plt
                             WHERE plt.pool  = ${poolAddressesSql})
          SELECT pi.pool_address,
                 AVG(COALESCE(iv.total_incentive_value_usd, 0) / NULLIF(mpl.total_liquidity_usd, 0) *
                     (365 * 24 * 3600) /
                     (EXTRACT(EPOCH FROM ${end}::timestamp) - EXTRACT(EPOCH FROM ${start}::timestamp)) *
                     100) AS incentive_apr
          FROM pool_info pi
                   JOIN v1_cosmos.materialized_pool_liquidity mpl ON pi.pool_address = mpl.pool_address
                   LEFT JOIN incentives_value_over_time iv ON pi.lp_token = iv.lp_token
          WHERE mpl.total_liquidity_usd > 0
          GROUP BY pi.pool_address;
      `;

      const results = await client.execute(query);

      return results.rows;
    } catch (error) {
      console.error('Error calculating incentive APR for pools (raw query):', error);
      return [];
    }
  }

  /**
   * Explanation of how using start and end dates affects the PoolMetric:
   *
   * When a start and end date are provided to this function returning PoolMetric data,
   * the dates influence the timeframe over which certain aggregate metrics are calculated.
   * Specifically, they will affect:
   *
   * 1. `token0_swap_volume` and `token1_swap_volume`:
   * - With date filters, these volumes would represent the total
   * swapped amount of each token within the specified start and end date range. If no dates
   * are given, the individual token swap volumes represent the total volume since the pool's inception.
   *
   * 2. `average_apr`:
   * - The calculation of the average APR depends on the historical incentive rewards and trading fees generated by the pool.
   * - Providing a start and end date will constrain the period over which these historical
   * data points are considered when calculating the average APR. A shorter date range might
   * yield a more recent average, while a wider range will provide a longer-term average.
   *
   * 3. `metric_start_height` and `metric_end_height`:
   * - These properties are explicitly intended to define the block height range relevant to the
   * calculation of other metrics. When start and end dates are provided, the system
   * translates these dates into corresponding block heights.
   * - `metric_start_height` represents the approximate block height at the `startDate`.
   * - `metric_end_height` represents the approximate block height at the `endDate` (or the latest
   * available height if `endDate` is in the future or not provided).
   * - The swap volumes and average APR are then be calculated based on data within this `metric_start_height`
   * and `metric_end_height` range.
   *
   * 4. `tvl_usd`, `token0_balance`, `token1_balance`, `token0_price`, `token1_price`:
   * - These metrics represent a snapshot of the pool's state at a specific `height`. While the
   * start and end dates might filter which `height` records are retrieved (e.g., the latest
   * record within the date range), the values themselves are point-in-time.
   *
   * Providing start and end dates allows for the calculation of time-dependent metrics
   * (like swap volume and average APR) over a specific historical period, defined by the date range
   * which is translated into a corresponding block height range (`metric_start_height` and
   * `metric_end_height`). If no dates are provided, the calculations defaults to the entire
   * history of the pool.
   */
  async function getPoolMetricsByPoolAddresses(
    addresses: string[],
    startDate?: Date,
    endDate?: Date,
  ): Promise<Record<string, PoolMetric> | null> {
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : now;

    if (startDate && start > now) {
      throw new Error("Start date cannot be in the future.");
    }

    if (start > end) {
      throw new Error("Start date cannot be after the end date.");
    }

    const heights = await findHeightsByDateRange(startDate, endDate);
    const startHeight = heights.startHeight;
    const endHeight = heights.endHeight;
    const poolAddressesSql = createPoolAddressArraySql(addresses);
    const interval = calculateIntervalInDays(startDate, endDate);
    const intervalSql = createIntervalSql(interval);
    const dayInSecondsSql = sql.raw("86400");
    const yearInSecondsSql = sql.raw("31557600"); // 86400 * 365.25

    const query = sql`
        WITH LatestBalances AS (SELECT p.pool_address,
                                       p.token0_denom,
                                       p.token0_balance,
                                       p.token1_denom,
                                       p.token1_balance,
                                       p.height,
                                       ROW_NUMBER() OVER (PARTITION BY p.pool_address ORDER BY p.height DESC) as rn
                                FROM v1_cosmos.materialized_pool_balance p
                                WHERE p.pool_address = ${poolAddressesSql}
                                    ${createHeightsFilterSql("p", startHeight, endHeight)}),
             PoolBalances AS (SELECT lb.pool_address,
                                     lb.token0_denom,
                                     lb.token0_balance,
                                     lb.token1_denom,
                                     lb.token1_balance,
                                     lb.height
                              FROM LatestBalances lb
                              WHERE lb.rn = 1),
             LatestTokenPrices AS (SELECT tp.token,
                                          tp.price,
                                          tp.created_at,
                                          ROW_NUMBER() OVER (PARTITION BY tp.token ORDER BY tp.created_at DESC) as rn
                                   from v1_cosmos.token_prices tp),
             TokenPrices AS (select * from LatestTokenPrices ltp where ltp.rn = 1),
             SwapVolumes AS (SELECT s.pool_address,
                                    SUM(
                                            CASE
                                                WHEN s.offer_asset = pb.token0_denom THEN s.offer_amount
                                                ELSE 0
                                                END
                                    ) AS token0_volume,
                                    SUM(
                                            CASE
                                                WHEN s.offer_asset = pb.token1_denom THEN s.offer_amount
                                                ELSE 0
                                                END
                                    ) AS token1_volume
                             FROM v1_cosmos.materialized_swap s
                                      JOIN PoolBalances pb ON s.pool_address = pb.pool_address
                             WHERE s.pool_address = ${poolAddressesSql}
                                 ${createHeightsFilterSql("s", startHeight, endHeight)}
                             GROUP BY s.pool_address),
             YieldPeriods AS (SELECT hpy.pool_address,
                                     hpy.timestamp,
                                     hpy.total_liquidity_usd,
                                     hpy.fees_usd + hpy.incentives_usd                                               AS total_yield_usd,
                                     LEAD(hpy.timestamp)
                                     OVER (PARTITION BY hpy.pool_address ORDER BY hpy.timestamp)                     AS next_timestamp
                              FROM v1_cosmos.materialized_historic_pool_yield hpy
                              WHERE hpy.pool_address = ${poolAddressesSql}
                                  ${createHeightsFilterSql("hpy", startHeight, endHeight)}),
             AnnualizedYields AS (SELECT pool_address,
                                         total_yield_usd,
                                         total_liquidity_usd,
                                         EXTRACT(EPOCH FROM (next_timestamp - timestamp)) / ${yearInSecondsSql} AS duration_years,
                                         CASE
                                             WHEN total_liquidity_usd > 0 AND (next_timestamp IS NOT NULL)
                                                 THEN (total_yield_usd / total_liquidity_usd) /
                                                      (EXTRACT(EPOCH FROM (next_timestamp - timestamp)) / ${yearInSecondsSql})
                                             ELSE 0
                                             END                                                                AS apr_row
                                  FROM YieldPeriods
                                  WHERE next_timestamp IS NOT NULL),
             PoolAPR AS (SELECT pool_address,
                                CASE
                                    WHEN SUM(total_liquidity_usd * duration_years) > 0
                                        THEN SUM(total_yield_usd) / SUM(total_liquidity_usd * duration_years)
                                    ELSE 0
                                    END AS average_apr
                         FROM AnnualizedYields
                         GROUP BY pool_address),
             Incentives As (SELECT plt.pool     AS pool_address,
                                   plt.lp_token AS lp_token_address,
                                   CASE
                                       WHEN SUM(i.rewards_per_second * (
                                           CASE
                                               WHEN i.end_ts <= EXTRACT(EPOCH FROM NOW()) THEN i.end_ts - i.start_ts
                                               WHEN i.start_ts >=
                                                    EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql})
                                                   THEN EXTRACT(EPOCH FROM NOW()) - i.start_ts
                                               ELSE EXTRACT(EPOCH FROM NOW()) -
                                                    (EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql}))
                                               END
                                           )) IS NULL THEN NULL
                                       ELSE SUM(i.rewards_per_second * (
                                           CASE
                                               WHEN i.end_ts <= EXTRACT(EPOCH FROM NOW()) THEN i.end_ts - i.start_ts
                                               WHEN i.start_ts >=
                                                    EXTRACT(EPOCH FROM NOW()) - (${intervalSql} * ${dayInSecondsSql})
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
                            GROUP BY plt.pool, plt.lp_token),
             TokenInfo as (select pb.pool_address,
                                  tp0.price       as token0_price,
                                  t0.decimals     as token0_decimals,
                                  t0.denomination as token0_denom,
                                  tp1.price       as token1_price,
                                  t1.decimals     as token1_decimals,
                                  t1.denomination as token1_denom,
                                  COALESCE(
                                          CASE
                                              WHEN tp0.price IS NOT NULL AND t0.decimals IS NOT NULL
                                                  THEN (pb.token0_balance / POWER(10, t0.decimals)) * tp0.price
                                              ELSE 0
                                              END,
                                          0
                                  ) + COALESCE(
                                          CASE
                                              WHEN tp1.price IS NOT NULL AND t1.decimals IS NOT NULL
                                                  THEN (pb.token1_balance / POWER(10, t1.decimals)) * tp1.price
                                              ELSE 0
                                              END,
                                          0
                                      )           AS tvl_usd

                           from PoolBalances pb
                                    LEFT JOIN v1_cosmos.token t0 ON pb.token0_denom = t0.denomination
                                    LEFT JOIN v1_cosmos.token t1 ON pb.token1_denom = t1.denomination
                                    LEFT JOIN TokenPrices tp0 ON t0.token_name = tp0.token
                                    LEFT JOIN TokenPrices tp1 ON t1.token_name = tp1.token
                           where pb.pool_address = ${poolAddressesSql})
        SELECT pb.pool_address,
               pb.height,
               pb.token0_denom,
               pb.token0_balance,
               ti.token0_decimals,
               ti.token0_price,
               sv.token0_volume   AS token0_swap_volume,
               pb.token1_denom,
               pb.token1_balance,
               ti.token1_decimals,
               ti.token1_price,
               sv.token1_volume   AS token1_swap_volume,
               ti.tvl_usd,
               apr.average_apr    AS average_apr,
               i.lp_token_address AS lp_token_address,
               i.total_incentives AS total_incentives
        FROM PoolBalances pb
                 LEFT JOIN TokenInfo ti ON pb.pool_address = ti.pool_address
                 LEFT JOIN SwapVolumes sv ON pb.pool_address = sv.pool_address
                 LEFT JOIN PoolAPR apr ON pb.pool_address = apr.pool_address
                 LEFT JOIN Incentives i ON pb.pool_address = i.pool_address
        ORDER BY pb.pool_address;
    `;

    try {
      const result = await client.execute(query);

      return result.rows.reduce<Record<string, PoolMetric>>((acc, row) => ({
        ...acc,
        [row.pool_address as string]: {
          ...row as Omit<PoolMetric, 'metric_start_height' | 'metric_end_height'>,
          metric_start_height: startHeight ? startHeight.toString() : null,
          metric_end_height: endHeight ? endHeight.toString() : null,
        } as PoolMetric,
      }), {});
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

  async function findHeightsByDateRange(startDate?: Date, endDate?: Date): Promise<{
    startHeight: bigint | null,
    endHeight: bigint | null
  }> {
    let startHeight: bigint | null;
    let endHeight: bigint | null;

    if (startDate || endDate) {
      const minMaxHeightsQuery = sql`
          SELECT MIN(mp.height) AS min_height,
                 MAX(mp.height) AS max_height
          FROM v1_cosmos.materialized_swap mp
          WHERE mp.timestamp >= ${startDate || new Date(0)}
            AND mp.timestamp <= ${endDate || new Date()};
      `;

      try {
        const heightsResult = await client.execute(minMaxHeightsQuery);
        if (heightsResult.rows.length > 0) {
          startHeight = heightsResult.rows[0]?.min_height as bigint ?? null;
          endHeight = heightsResult.rows[0]?.max_height as bigint ?? null;

          return {startHeight: startHeight, endHeight: endHeight}
        }

      } catch (error) {
        console.error("Error fetching min/max heights:", error);
        throw error;
      }
    }

    return {startHeight: null, endHeight: null}
  }

  function createHeightsFilterSql(table: string, startHeight?: bigint | null, endHeight?: bigint | null) {
    let heightFilter = sql``;

    if (startHeight || endHeight) {
      if (startHeight !== null && endHeight !== null) {
        heightFilter = sql.raw(`AND ${table}.height >= ${startHeight} AND ${table}.height <= ${endHeight}`);
      } else if (startHeight !== null) {
        heightFilter = sql.raw(`AND ${table}.height >= ${startHeight}`);
      } else if (endHeight !== null) {
        heightFilter = sql.raw(`AND ${table}.height <= ${endHeight}`);
      }
    }

    return heightFilter;
  }

  function calculateIntervalInDays(startDate?: Date, endDate?: Date): number {
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    const timeDifferenceMs = end.getTime() - start.getTime();

    return Math.floor(timeDifferenceMs / (24 * 60 * 60 * 1000));
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
    getPoolMetricsByPoolAddresses,
    getPoolIncentiveAprsByPoolAddresses
  } as Indexer;
};
