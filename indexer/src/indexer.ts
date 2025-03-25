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
    const offset = (page - 1) * limit;
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
        SELECT
            p.*
        FROM
            v1_cosmos.pool_balance p
                INNER JOIN (
                SELECT
                    pool_address,
                    MAX(height) AS max_height
                FROM
                    v1_cosmos.pool_balance
                WHERE
                    pool_address = ${pool_addresses_sql}
                GROUP BY
                    pool_address
            ) latest ON p.pool_address = latest.pool_address AND p.height = latest.max_height
        WHERE
            p.pool_address = ${pool_addresses_sql}
        ORDER BY
            p.pool_address;
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

  return {queryView, getCurrentPoolBalances, getPoolBalancesByPoolAddresses} as Indexer;
}
