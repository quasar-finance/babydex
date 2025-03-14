export type QueryInput = {
    page?: number | null | undefined;
    limit?: number | null | undefined;
    orderBy?: "asc" | "desc" | null | undefined;
    orderByColumn?: string | null | undefined;
}

export type Indexer = {
    queryView<T>(viewName: string, input?: QueryInput | undefined | null): Promise<T | null>;
}