// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {drizzle} from "npm:drizzle-orm/postgres-js";
import postgres from "npm:postgres";
import {sql} from "npm:drizzle-orm";

console.info('server started');
type PoolMetric = {
  pool_address: string,
  height: bigint,
  token0_denom: string,
  token0_balance: bigint,
  token0_decimals: number,
  token0_price: number,
  token0_swap_volume: number,
  token1_denom: string,
  token1_balance: bigint,
  token1_decimals: number,
  token1_price: number,
  token1_swap_volume: number,
  tvl_usd: number,
  average_apr: number,
  lp_token_address: string,
  total_incentives: bigint,
  metric_start_height: bigint | null,
  metric_end_height: bigint | null,
}
const connectionString = Deno.env.get("DATABASE_URL");
const client = postgres(connectionString, {
  prepare: false
});
const db = drizzle(client);
Deno.serve(async (req) => {
  const {addresses, startDate, endDate} = await req.json();
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
           DailyYield AS (SELECT hpy.pool_address,
                                 CASE
                                     WHEN hpy.total_liquidity_usd > 0 AND
                                          (EXTRACT(EPOCH FROM (LEAD(hpy.timestamp, 1, NOW())
                                                               OVER (PARTITION BY hpy.pool_address ORDER BY hpy.timestamp) -
                                                               hpy.timestamp)) / 86400) > 0
                                         THEN hpy.fees_usd / hpy.total_liquidity_usd / (EXTRACT(EPOCH FROM (
                                                 LEAD(hpy.timestamp, 1, NOW())
                                                 OVER (PARTITION BY hpy.pool_address ORDER BY hpy.timestamp) -
                                                 hpy.timestamp)) /
                                                                                        86400)
                                     ELSE 0
                                     END AS daily_yield
                          FROM v1_cosmos.materialized_historic_pool_yield hpy
                          WHERE hpy.pool_address = ${poolAddressesSql}
                              ${createHeightsFilterSql("hpy", startHeight, endHeight)}),
           AvgDailyYield AS (SELECT pool_address,
                                    AVG(daily_yield) * 365 AS avg_apr
                             FROM DailyYield
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
                          GROUP BY plt.pool, plt.lp_token)
      SELECT pb.pool_address,
             pb.height,
             pb.token0_denom,
             pb.token0_balance,
             t0.decimals        AS token0_decimals,
             tp0.price          AS token0_price,
             sv.token0_volume   AS token0_swap_volume,
             pb.token1_denom,
             pb.token1_balance,
             t1.decimals        AS token1_decimals,
             tp1.price          AS token1_price,
             sv.token1_volume   AS token1_swap_volume,
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
                 )              AS tvl_usd,
             ady.avg_apr        AS average_apr,
             i.lp_token_address AS lp_token_address,
             i.total_incentives AS total_incentives
      FROM PoolBalances pb
               LEFT JOIN v1_cosmos.token t0 ON pb.token0_denom = t0.denomination
               LEFT JOIN v1_cosmos.token t1 ON pb.token1_denom = t1.denomination
               LEFT JOIN TokenPrices tp0 ON t0.token_name = tp0.token
               LEFT JOIN TokenPrices tp1 ON t1.token_name = tp1.token
               LEFT JOIN SwapVolumes sv ON pb.pool_address = sv.pool_address
               LEFT JOIN AvgDailyYield ady ON pb.pool_address = ady.pool_address
               LEFT JOIN Incentives i ON pb.pool_address = i.pool_address
      ORDER BY pb.pool_address;
  `;
  try {
    let result = await db.execute(query);
    result.map((row) => ({
      [row.pool_address]: {
        ...row,
        metric_start_height: startHeight ? BigInt(startHeight) : null,
        metric_end_height: endHeight ? BigInt(endHeight) : null
      } as PoolMetric
    }));
    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error("Error executing raw query:", error);
    throw error;
  }
});

function createPoolAddressArraySql(addresses) {
  if (!addresses || addresses.length === 0) {
    return sql.raw(`ANY('{}'::text[])`);
  }
  const quotedAddresses = addresses.map((address) => `"${address}"`).join(",");
  return sql.raw(`ANY('{${quotedAddresses}}'::text[])`);
}

function createIntervalSql(interval) {
  return sql.raw(Math.min(Math.max(1, interval), 365).toString());
}

async function findHeightsByDateRange(startDate, endDate) {
  let startHeight;
  let endHeight;
  if (startDate || endDate) {
    const minMaxHeightsQuery = sql`
        SELECT MIN(mp.height) AS min_height,
               MAX(mp.height) AS max_height
        FROM v1_cosmos.materialized_pools mp
        WHERE mp.timestamp >= ${startDate || new Date(0)}
          AND mp.timestamp <= ${endDate || new Date()};
    `;
    try {
      const heightsResult = await db.execute(minMaxHeightsQuery);
      if (heightsResult.rows.length > 0) {
        startHeight = heightsResult.rows[0]?.min_height ?? null;
        endHeight = heightsResult.rows[0]?.max_height ?? null;
        return {
          startHeight: startHeight,
          endHeight: endHeight
        };
      }
    } catch (error) {
      console.error("Error fetching min/max heights:", error);
      throw error;
    }
  }
  return {
    startHeight: null,
    endHeight: null
  };
}

function createHeightsFilterSql(table, startHeight, endHeight) {
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

function calculateIntervalInDays(startDate, endDate) {
  const start = startDate ? new Date(startDate) : new Date(0);
  const end = endDate ? new Date(endDate) : new Date();
  const timeDifferenceMs = end.getTime() - start.getTime();
  return Math.floor(timeDifferenceMs / (24 * 60 * 60 * 1000));
}
