import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {asc, desc, sql} from "drizzle-orm";
import { StringChunk } from "drizzle-orm/sql/sql";

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
  ) => Promise<(typeof views)[T]["$inferSelect"]>;
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

    const { orderBy = "asc", page = 1, limit = 50, orderByColumn } = filters;

    const dynamicQuery = query.$dynamic();

    dynamicQuery.limit(limit).offset((page - 1) * limit);

    if (orderByColumn) {
      const orderByColumnSQL = new StringChunk(orderByColumn);
      dynamicQuery.orderBy(orderBy === "asc" ? asc(orderByColumnSQL) : desc(orderByColumnSQL));
    }

    return await dynamicQuery;
  }

  async function getLatestPoolBalances(limit: number, offset: number) {
    const query = `
        SELECT
            p.*
        FROM
            pool_balance p
        INNER JOIN (
            SELECT
                pool_address,
                MAX(height) AS max_height
            FROM
                pool_balance
            GROUP BY
                pool_address
        ) latest ON p.pool_address = latest.pool_address AND p.height = latest.max_height
        ORDER BY p.pool_address
        LIMIT ${limit}
        OFFSET ${offset};
    `;

    try {
      const result = await client.execute(sql`${query}`);

      return result.rows;
    } catch (error) {
      console.error('Error executing raw query:', error);

      return null;
    }
  }

  return { queryView, getLatestPoolBalances } as Indexer;
};
