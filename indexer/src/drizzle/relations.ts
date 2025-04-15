import { relations } from "drizzle-orm/relations";
import { chainsInHubble, contractStatusInHubble, clientsInHubble, consensusHeightsInHubble, assetsInHubble, tokenSourcesInHubble, blocksInV1Cosmos, eventsInV1Cosmos, transactionsInV1Cosmos, contractsInV1Cosmos, tokenInV1Cosmos } from "./schema.js";

export const contractStatusInHubbleRelations = relations(contractStatusInHubble, ({one}) => ({
	chainsInHubble: one(chainsInHubble, {
		fields: [contractStatusInHubble.internalChainId],
		references: [chainsInHubble.id]
	}),
}));

export const chainsInHubbleRelations = relations(chainsInHubble, ({many}) => ({
	contractStatusInHubbles: many(contractStatusInHubble),
	clientsInHubbles: many(clientsInHubble),
	consensusHeightsInHubbles: many(consensusHeightsInHubble),
	assetsInHubbles: many(assetsInHubble),
	// tokenSourceRepresentationsInHubbles: many(tokenSourceRepresentationsInHubble),
	eventsInV1Cosmos: many(eventsInV1Cosmos),
	contractsInV1Cosmos: many(contractsInV1Cosmos),
	tokenInV1Cosmos: many(tokenInV1Cosmos),
	transactionsInV1Cosmos: many(transactionsInV1Cosmos),
	blocksInV1Cosmos: many(blocksInV1Cosmos),
}));

export const clientsInHubbleRelations = relations(clientsInHubble, ({one}) => ({
	chainsInHubble: one(chainsInHubble, {
		fields: [clientsInHubble.chainId],
		references: [chainsInHubble.id]
	}),
}));

export const consensusHeightsInHubbleRelations = relations(consensusHeightsInHubble, ({one}) => ({
	chainsInHubble: one(chainsInHubble, {
		fields: [consensusHeightsInHubble.chainId],
		references: [chainsInHubble.id]
	}),
}));

export const assetsInHubbleRelations = relations(assetsInHubble, ({one}) => ({
	chainsInHubble: one(chainsInHubble, {
		fields: [assetsInHubble.chainId],
		references: [chainsInHubble.id]
	}),
}));

// export const tokenSourceRepresentationsInHubbleRelations = relations(tokenSourceRepresentationsInHubble, ({one}) => ({
// 	chainsInHubble: one(chainsInHubble, {
// 		fields: [tokenSourceRepresentationsInHubble.internalChainId],
// 		references: [chainsInHubble.id]
// 	}),
// 	tokenSourcesInHubble: one(tokenSourcesInHubble, {
// 		fields: [tokenSourceRepresentationsInHubble.tokenSourceId],
// 		references: [tokenSourcesInHubble.id]
// 	}),
// }));
//
// export const tokenSourcesInHubbleRelations = relations(tokenSourcesInHubble, ({many}) => ({
// 	tokenSourceRepresentationsInHubbles: many(tokenSourceRepresentationsInHubble),
// }));

export const eventsInV1CosmosRelations = relations(eventsInV1Cosmos, ({one}) => ({
	blocksInV1Cosmo: one(blocksInV1Cosmos, {
		fields: [eventsInV1Cosmos.chainId],
		references: [blocksInV1Cosmos.chainId]
	}),
	chainsInHubble: one(chainsInHubble, {
		fields: [eventsInV1Cosmos.chainId],
		references: [chainsInHubble.id]
	}),
	transactionsInV1Cosmo: one(transactionsInV1Cosmos, {
		fields: [eventsInV1Cosmos.chainId],
		references: [transactionsInV1Cosmos.chainId]
	}),
}));

export const blocksInV1CosmosRelations = relations(blocksInV1Cosmos, ({one, many}) => ({
	eventsInV1Cosmos: many(eventsInV1Cosmos),
	transactionsInV1Cosmos: many(transactionsInV1Cosmos),
	chainsInHubble: one(chainsInHubble, {
		fields: [blocksInV1Cosmos.chainId],
		references: [chainsInHubble.id]
	}),
}));

export const transactionsInV1CosmosRelations = relations(transactionsInV1Cosmos, ({one, many}) => ({
	eventsInV1Cosmos: many(eventsInV1Cosmos),
	blocksInV1Cosmo: one(blocksInV1Cosmos, {
		fields: [transactionsInV1Cosmos.chainId],
		references: [blocksInV1Cosmos.chainId]
	}),
	chainsInHubble: one(chainsInHubble, {
		fields: [transactionsInV1Cosmos.chainId],
		references: [chainsInHubble.id]
	}),
}));

export const contractsInV1CosmosRelations = relations(contractsInV1Cosmos, ({one}) => ({
	chainsInHubble: one(chainsInHubble, {
		fields: [contractsInV1Cosmos.internalChainId],
		references: [chainsInHubble.id]
	}),
}));

export const tokenInV1CosmosRelations = relations(tokenInV1Cosmos, ({one}) => ({
	chainsInHubble: one(chainsInHubble, {
		fields: [tokenInV1Cosmos.chainId],
		references: [chainsInHubble.id]
	}),
}));