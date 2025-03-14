import type {Indexer, QueryInput} from "@towerfi/types";
import {Indexer as IndexerService} from "@towerfi/indexer";

export function createIndexerService(db_credentials: string): Indexer {
    async function queryView<T>(viewName: string, input?: QueryInput): Promise<T | null> {
        const credentials = JSON.parse(db_credentials);
        const indexer = new IndexerService({
            host: credentials.host,
            port: Number(credentials.port),
            user: credentials.user,
            password: credentials.password,
            database: credentials.database,
            ssl: credentials.ssl,
        });

        const e = indexer.queryView(viewName, input);

        return e ? (e as T) : null;
    }

    return {
        queryView,
    }
}
