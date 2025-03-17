import type {DbCredentials, Indexer, QueryInput} from "@towerfi/types";
import {Indexer as IndexerService} from "@towerfi/indexer";

export function createIndexerService(dbCredentials: DbCredentials): Indexer {
    async function queryView<T>(viewName: string, input?: QueryInput): Promise<T | null> {
        const indexer = new IndexerService({
            host: dbCredentials.host,
            port: dbCredentials.port,
            user: dbCredentials.user,
            password: dbCredentials.password,
            database: dbCredentials.database,
            ssl: dbCredentials.ssl,
        });

        const e = indexer.queryView(viewName, input);

        return e ? (e as T) : null;
    }

    return {
        queryView,
    }
}
