import type {DbCredentials} from "@towerfi/types";
import {drizzle, NodePgDatabase} from "drizzle-orm/node-postgres";
import {Pool} from "pg";
import {type PgSelect, type PgViewWithSelection} from "drizzle-orm/pg-core";
import {asc, desc} from "drizzle-orm";
import {StringChunk} from "drizzle-orm/sql/sql";

export class Indexer {
    private queryier: NodePgDatabase<Record<string, never>> & { $client: Pool };

    constructor(credentials: DbCredentials) {
        this.queryier = drizzle(new Pool({
            host: credentials.host,
            port: credentials.port,
            user: credentials.user,
            password: credentials.password,
            database: credentials.database,
            // ssl: credentials.ssl,
        }));
    }

    public async queryView<G>(viewName: G, input?: {
        orderBy?: "asc" | "desc" | null | undefined;
        limit?: number | null | undefined;
        orderByColumn?: string | null | undefined;
        page?: number | null | undefined;
    } | null) {
        const query = this.queryier.select().from(viewName as PgViewWithSelection);

        if (!input) {
            return await query;
        }

        const dynamicQuery = query.$dynamic();
        const orderBy = input?.orderBy ?? "asc";
        const orderByColumn = input?.orderByColumn;
        const page = input?.page ?? 1;
        const limit = input?.limit ?? 50;

        return await this.withPagination(dynamicQuery, page, limit, orderBy, orderByColumn);
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
