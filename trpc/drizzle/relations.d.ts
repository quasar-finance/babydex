export declare const transactionsInV1CosmosRelations: import("drizzle-orm/relations").Relations<string, {
    blocksInV1Cosmo: import("drizzle-orm/relations").One<any, true>;
    chainsInHubble: import("drizzle-orm/relations").One<any, true>;
    eventsInV1Cosmos: import("drizzle-orm/relations").Many<any>;
}>;
export declare const blocksInV1CosmosRelations: import("drizzle-orm/relations").Relations<string, {
    transactionsInV1Cosmos: import("drizzle-orm/relations").Many<any>;
    chainsInHubble: import("drizzle-orm/relations").One<any, true>;
    eventsInV1Cosmos: import("drizzle-orm/relations").Many<any>;
}>;
export declare const chainsInHubbleRelations: import("drizzle-orm/relations").Relations<string, {
    transactionsInV1Cosmos: import("drizzle-orm/relations").Many<any>;
    tokenInV1Cosmos: import("drizzle-orm/relations").Many<any>;
    blocksInV1Cosmos: import("drizzle-orm/relations").Many<any>;
    eventsInV1Cosmos: import("drizzle-orm/relations").Many<any>;
    contractsInV1Cosmos: import("drizzle-orm/relations").Many<any>;
}>;
export declare const tokenInV1CosmosRelations: import("drizzle-orm/relations").Relations<string, {
    chainsInHubble: import("drizzle-orm/relations").One<any, true>;
    tokenPricesInV1Cosmos: import("drizzle-orm/relations").Many<any>;
}>;
export declare const tokenPricesInV1CosmosRelations: import("drizzle-orm/relations").Relations<string, {
    tokenInV1Cosmo: import("drizzle-orm/relations").One<any, true>;
}>;
export declare const eventsInV1CosmosRelations: import("drizzle-orm/relations").Relations<string, {
    blocksInV1Cosmo: import("drizzle-orm/relations").One<any, true>;
    chainsInHubble: import("drizzle-orm/relations").One<any, true>;
    transactionsInV1Cosmo: import("drizzle-orm/relations").One<any, true>;
}>;
export declare const contractsInV1CosmosRelations: import("drizzle-orm/relations").Relations<string, {
    chainsInHubble: import("drizzle-orm/relations").One<any, true>;
}>;
//# sourceMappingURL=relations.d.ts.map