import type {DbCredentials} from "@towerfi/types";
import {drizzle, NodePgDatabase} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import {type PgSelect} from "drizzle-orm/pg-core";
import {asc, desc} from "drizzle-orm";
import {StringChunk} from "drizzle-orm/sql/sql";
import {
    addLiquidityInV1Cosmos,
    historicPoolYieldInV1Cosmos,
    incentivizeInV1Cosmos,
    poolBalanceInV1Cosmos,
    poolFeePeriodsInV1Cosmos,
    poolUserSharesInV1Cosmos,
    swapInV1Cosmos,
    withdrawLiquidityInV1Cosmos,
} from "./drizzle/schema.js";


export const IndexerViews = {
    "addLiquidity": addLiquidityInV1Cosmos,
    "historicPoolYield": historicPoolYieldInV1Cosmos,
    "incentivize": incentivizeInV1Cosmos,
    "poolBalance": poolBalanceInV1Cosmos,
    "poolFeePeriods": poolFeePeriodsInV1Cosmos,
    "poolUserShares": poolUserSharesInV1Cosmos,
    "swap": swapInV1Cosmos,
    "withdrawLiquidity": withdrawLiquidityInV1Cosmos
}

export class Indexer {
    private queryier: NodePgDatabase<Record<string, never>> & { $client: Pool };

    constructor(credentials: DbCredentials) {
        this.queryier = drizzle(new Pool({
            host: credentials.host,
            port: credentials.port,
            user: credentials.user,
            password: credentials.password,
            database: credentials.database,
            ssl: credentials.ssl,
        }));
    }

    public async queryView(viewName: string, input?: {
        orderBy?: "asc" | "desc" | null | undefined;
        limit?: number | null | undefined;
        orderByColumn?: string | null | undefined;
        page?: number | null | undefined;
    } | null) {
        const viewNameValue = IndexerViews[viewName as keyof typeof IndexerViews];
        const query = this.queryier.select().from(viewNameValue);

        if (!input) {
            return query;
        }

        const dynamicQuery = query.$dynamic();
        const orderBy = input?.orderBy ?? "asc";
        const orderByColumn = input?.orderByColumn;
        const page = input?.page ?? 1;
        const limit = input?.limit ?? 50;

        return this.withPagination(dynamicQuery, page, limit, orderBy, orderByColumn);
    }

    private withPagination<T extends PgSelect>(
        qb: T,
        page = 1,
        pageSize = 50,
        orderBy: "asc" | "desc",
        orderByColumn?: string | null | undefined,
    ) {
        qb
            .limit(pageSize)
            .offset((page - 1) * pageSize);

        if (orderByColumn) {
            const orderByColumnSQL = new StringChunk(orderByColumn);
            qb.orderBy(orderBy == "asc" ? asc(orderByColumnSQL) : desc(orderByColumnSQL));
        }

        return qb;
    }
}
