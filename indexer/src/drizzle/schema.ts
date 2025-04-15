import { pgTable, pgSchema, foreignKey, integer, text, bigint, timestamp, index, serial, boolean, numeric, jsonb, smallint, doublePrecision, json } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import {bytea} from "../types.js";

export const v1Cosmos = pgSchema("v1_cosmos");
export const hubble = pgSchema("hubble");

export const poolLpTokensIdSeqInV1Cosmos = v1Cosmos.sequence("pool_lp_tokens_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "9223372036854775807", cache: "1", cycle: false })

export const contractStatusInHubble = hubble.table("contract_status", {
	internalChainId: integer("internal_chain_id").notNull(),
	address: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }).notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.internalChainId],
			foreignColumns: [chainsInHubble.id],
			name: "fk_internal_chain_id"
		}).onDelete("cascade"),
]);

export const clientsInHubble = hubble.table("clients", {
	chainId: integer("chain_id").notNull(),
	clientId: text("client_id").notNull(),
	counterpartyChainId: text("counterparty_chain_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chainId],
			foreignColumns: [chainsInHubble.id],
			name: "clients_chain_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const blockStatusInHubble = hubble.table("block_status", {
	indexerId: text("indexer_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }).notNull(),
	hash: text().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("block_status_height_idx").using("btree", table.height.asc().nullsLast().op("int8_ops")),
]);

export const consensusHeightsInHubble = hubble.table("consensus_heights", {
	chainId: integer("chain_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	executionHeight: bigint("execution_height", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	consensusHeight: bigint("consensus_height", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.chainId],
			foreignColumns: [chainsInHubble.id],
			name: "consensus_heights_chain_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const blockFixInHubble = hubble.table("block_fix", {
	indexerId: text("indexer_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startHeight: bigint("start_height", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	endHeight: bigint("end_height", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const chainsInHubble = hubble.table("chains", {
	id: serial().notNull(),
	chainId: text("chain_id").notNull(),
	displayName: text("display_name"),
	testnet: boolean(),
	maxTipAgeSeconds: numeric("max_tip_age_seconds"),
	rpcType: text("rpc_type"),
	addrPrefix: text("addr_prefix"),
	enabled: boolean().default(false).notNull(),
	logoUri: text("logo_uri"),
	enabledStaging: boolean("enabled_staging").default(false).notNull(),
	execution: boolean().default(false).notNull(),
	indexerId: text("indexer_id"),
	maxMappedExecutionHeightGap: integer("max_mapped_execution_height_gap"),
}, (table) => [
	index("chains_chain_id_idx").using("btree", table.chainId.asc().nullsLast().op("text_ops"), table.id.asc().nullsLast().op("text_ops")),
]);

export const indexerStatusInHubble = hubble.table("indexer_status", {
	indexerId: text("indexer_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }).notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const assetsInHubble = hubble.table("assets", {
	chainId: integer("chain_id").notNull(),
	denom: text().notNull(),
	displaySymbol: text("display_symbol"),
	decimals: integer(),
	logoUri: text("logo_uri"),
	displayName: text("display_name"),
	gasToken: boolean("gas_token").default(false).notNull(),
	source: text(),
}, (table) => [
	foreignKey({
			columns: [table.chainId],
			foreignColumns: [chainsInHubble.id],
			name: "assets_chain_id_fkey"
		}).onUpdate("set null").onDelete("set null"),
]);

// export const tokenSourceRepresentationsInHubble = hubble.table("token_source_representations", {
// 	tokenSourceId: integer("token_source_id").notNull(),
// 	internalChainId: integer("internal_chain_id").notNull(),
// 	address: bytea,
// 	symbol: text().notNull(),
// 	name: text().notNull(),
// 	decimals: integer().notNull(),
// 	logoUri: text("logo_uri"),
// 	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
// 	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
// }, (table) => [
// 	foreignKey({
// 			columns: [table.internalChainId],
// 			foreignColumns: [chainsInHubble.id],
// 			name: "token_source_representations_chains_id_fk"
// 		}),
// 	foreignKey({
// 			columns: [table.tokenSourceId],
// 			foreignColumns: [tokenSourcesInHubble.id],
// 			name: "token_source_representations_token_sources_id_fk"
// 		}),
// ]);

export const tokenSourcesInHubble = hubble.table("token_sources", {
	id: serial().notNull(),
	sourceUri: text("source_uri").notNull(),
	name: text().notNull(),
	logoUri: text("logo_uri"),
	enabled: boolean().default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const eventsInV1Cosmos = v1Cosmos.table("events", {
	chainId: integer("chain_id").notNull(),
	blockHash: text("block_hash").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }).notNull(),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	index: integer().notNull(),
	data: jsonb().notNull(),
	time: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("events_height_idx").using("btree", table.height.asc().nullsLast().op("int8_ops")),
	index("events_recv_packet_by_chain_destination_channel_sequence_idx").using("btree", sql`chain_id`, sql`((attributes(events.*) ->> 'packet_sequence'::text))::numeric`, sql`null`).where(sql`((data ->> 'type'::text) = 'recv_packet'::text)`),
	index("events_send_packet_by_chain_id_tx_hash_msg_index_idx").using("btree", sql`chain_id`, sql`transaction_hash`, sql`null`).where(sql`((data ->> 'type'::text) = 'send_packet'::text)`),
	index("events_send_packet_by_time_idx").using("btree", table.time.desc().nullsFirst().op("timestamptz_ops")).where(sql`((data ->> 'type'::text) = 'send_packet'::text)`),
	index("events_send_packet_by_tx_hash_msg_index_idx").using("btree", sql`transaction_hash`, sql`null`).where(sql`((data ->> 'type'::text) = 'send_packet'::text)`),
	index("events_transaction_hash_int4_idx").using("btree", sql`transaction_hash`, sql`null`),
	index("events_update_client_by_chain_id_revision_height_idx").using("btree", sql`chain_id`, sql`'-'::text`).where(sql`((data ->> 'type'::text) = 'update_client'::text)`),
	index("events_wasm_ibc_transfer_by_time_idx").using("btree", table.time.desc().nullsFirst().op("timestamptz_ops")).where(sql`(((data ->> 'type'::text) = 'wasm-ibc_transfer'::text) AND ((attributes(events.*) ->> 'assets'::text) IS NOT NULL))`),
	index("idx_events_height").using("btree", table.chainId.asc().nullsLast().op("int8_ops"), table.height.asc().nullsLast().op("int4_ops")),
	index("idx_events_height_desc").using("btree", table.chainId.asc().nullsLast().op("int4_ops"), table.height.desc().nullsFirst().op("int8_ops")),
	index("idx_events_type").using("btree", sql`(data ->> 'type'::text)`),
	foreignKey({
			columns: [table.chainId, table.blockHash],
			foreignColumns: [blocksInV1Cosmos.chainId, blocksInV1Cosmos.hash],
			name: "events_chain_id_block_hash_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.chainId],
			foreignColumns: [chainsInHubble.id],
			name: "events_chain_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.chainId, table.transactionHash],
			foreignColumns: [transactionsInV1Cosmos.chainId, transactionsInV1Cosmos.hash],
			name: "events_chain_id_transaction_hash_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const contractsInV1Cosmos = v1Cosmos.table("contracts", {
	internalChainId: integer("internal_chain_id").notNull(),
	address: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startHeight: bigint("start_height", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	endHeight: bigint("end_height", { mode: "number" }).default(sql`'9223372036854775807'`).notNull(),
	description: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.internalChainId],
			foreignColumns: [chainsInHubble.id],
			name: "contracts_chain_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const tokenInV1Cosmos = v1Cosmos.table("token", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "v1_cosmos.token_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	coingeckoId: text("coingecko_id").notNull(),
	denomination: text(),
	tokenName: text("token_name"),
	chainId: integer("chain_id"),
	decimals: smallint(),
}, (table) => [
	foreignKey({
			columns: [table.chainId],
			foreignColumns: [chainsInHubble.id],
			name: "token_chain_id_fkey"
		}),
]);

export const transactionsInV1Cosmos = v1Cosmos.table("transactions", {
	chainId: integer("chain_id").notNull(),
	blockHash: text("block_hash").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }).notNull(),
	data: jsonb().notNull(),
	hash: text().notNull(),
	index: integer().notNull(),
}, (table) => [
	index("transactions_chain_id_height").using("btree", table.chainId.asc().nullsLast().op("int4_ops"), table.height.desc().nullsFirst().op("int8_ops")),
	foreignKey({
			columns: [table.chainId, table.blockHash],
			foreignColumns: [blocksInV1Cosmos.chainId, blocksInV1Cosmos.hash],
			name: "transactions_block_hash_chain_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.chainId],
			foreignColumns: [chainsInHubble.id],
			name: "transactions_chain_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const blocksInV1Cosmos = v1Cosmos.table("blocks", {
	chainId: integer("chain_id").notNull(),
	hash: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }).notNull(),
	time: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	data: jsonb().notNull(),
}, (table) => [
	index("blocks_height_idx").using("btree", table.height.asc().nullsLast().op("int8_ops")),
	index("idx_blocks_height").using("btree", table.chainId.asc().nullsLast().op("int4_ops"), table.height.asc().nullsLast().op("int4_ops")),
	index("idx_blocks_time").using("btree", table.time.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.chainId],
			foreignColumns: [chainsInHubble.id],
			name: "blocks_chain_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const poolLpTokenInV1Cosmos = v1Cosmos.table("pool_lp_token", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "v1_cosmos.pool_lp_token_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	pool: text().notNull(),
	lpToken: text("lp_token").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_pool_lp_token_lp_token").using("btree", table.lpToken.asc().nullsLast().op("text_ops")),
]);

export const tokenPricesInV1Cosmos = v1Cosmos.table("token_prices", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "v1_cosmos.token_prices_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	price: numeric(),
	lastUpdatedAt: numeric("last_updated_at"),
	token: text(),
});
export const materializedHistoricPoolYieldInV1Cosmos = v1Cosmos.materializedView("materialized_historic_pool_yield", {	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	poolAddress: text("pool_address"),
	token0Denom: text("token0_denom"),
	token1Denom: text("token1_denom"),
	token0Balance: numeric("token0_balance"),
	token1Balance: numeric("token1_balance"),
	token0ValueUsd: doublePrecision("token0_value_usd"),
	token1ValueUsd: doublePrecision("token1_value_usd"),
	totalLiquidityUsd: doublePrecision("total_liquidity_usd"),
	feeTokens: json("fee_tokens"),
	feesUsd: doublePrecision("fees_usd"),
	incentiveTokens: json("incentive_tokens"),
	incentivesUsd: doublePrecision("incentives_usd"),
	totalEarningsUsd: doublePrecision("total_earnings_usd"),
}).as(sql`WITH block_data AS ( SELECT b.height, b."time" AS "timestamp", lead(b."time") OVER (ORDER BY b.height) AS next_timestamp, lead(b.height) OVER (ORDER BY b.height) AS next_height FROM v1_cosmos.blocks b ), token_prices_by_block AS ( SELECT bd_1.height, bd_1."timestamp", bd_1.next_timestamp, bd_1.next_height, EXTRACT(epoch FROM bd_1.next_timestamp - bd_1."timestamp") AS seconds_between_blocks, t.denomination, tp.price, t.decimals, t.token_name FROM block_data bd_1 CROSS JOIN LATERAL ( SELECT DISTINCT token_prices.token FROM v1_cosmos.token_prices) d LEFT JOIN LATERAL ( SELECT token_prices.token, token_prices.price FROM v1_cosmos.token_prices WHERE token_prices.token = d.token ORDER BY (abs(EXTRACT(epoch FROM bd_1."timestamp" - token_prices.created_at))) LIMIT 1) tp ON true LEFT JOIN v1_cosmos.token t ON tp.token = t.token_name WHERE bd_1.next_height IS NOT NULL ), block_fees AS ( SELECT s.height, s.pool_address, s.ask_asset AS fee_token_denom, sum(s.commission_amount) AS fee_amount, sum(s.commission_amount::double precision / power(10::double precision, COALESCE(tp.decimals::integer, 6)::double precision)) * COALESCE(tp.price, 0::numeric)::double precision AS fees_usd FROM v1_cosmos.materialized_swap s LEFT JOIN token_prices_by_block tp ON s.height = tp.height AND s.ask_asset = tp.denomination GROUP BY s.height, s.pool_address, s.ask_asset, tp.price, tp.decimals ), block_incentives AS ( SELECT bp.height, i.lp_token, i.reward AS incentive_token_denom, sum(i.rewards_per_second * tp.seconds_between_blocks) AS incentive_amount, sum((i.rewards_per_second * tp.seconds_between_blocks)::double precision / power(10::double precision, COALESCE(tp.decimals::integer, 6)::double precision)) * COALESCE(tp.price, 0::numeric)::double precision AS incentives_usd FROM block_data bp JOIN v1_cosmos.materialized_incentivize i ON i.start_ts::numeric <= EXTRACT(epoch FROM bp."timestamp") AND i.end_ts::numeric >= EXTRACT(epoch FROM bp."timestamp") LEFT JOIN token_prices_by_block tp ON bp.height = tp.height AND i.reward = tp.denomination GROUP BY bp.height, i.lp_token, i.reward, tp.seconds_between_blocks, tp.price, tp.decimals ), pool_info AS ( SELECT DISTINCT materialized_pool_balance.pool_address, (materialized_pool_balance.token0_denom || ':'::text) || materialized_pool_balance.token1_denom AS lp_token FROM v1_cosmos.materialized_pool_balance ), pool_liquidity AS ( SELECT h.height, a.pool_address, a.token0_denom, a.token1_denom, a.token0_balance, a.token1_balance, a.token0_balance::double precision / power(10::double precision, COALESCE(tp0.decimals::integer, 6)::double precision) * COALESCE(tp0.price, 0::numeric)::double precision AS token0_value_usd, a.token1_balance::double precision / power(10::double precision, COALESCE(tp1.decimals::integer, 6)::double precision) * COALESCE(tp1.price, 0::numeric)::double precision AS token1_value_usd, a.token0_balance::double precision / power(10::double precision, COALESCE(tp0.decimals::integer, 6)::double precision) * COALESCE(tp0.price, 0::numeric)::double precision + a.token1_balance::double precision / power(10::double precision, COALESCE(tp1.decimals::integer, 6)::double precision) * COALESCE(tp1.price, 0::numeric)::double precision AS total_liquidity_usd FROM v1_cosmos.blocks h JOIN v1_cosmos.materialized_pool_balance a ON h.height = a.height LEFT JOIN token_prices_by_block tp0 ON h.height = tp0.height AND a.token0_denom = tp0.denomination LEFT JOIN token_prices_by_block tp1 ON h.height = tp1.height AND a.token1_denom = tp1.denomination ), total_fees_by_pool AS ( SELECT block_fees.height, block_fees.pool_address, json_agg(json_build_object('denom', block_fees.fee_token_denom, 'amount', block_fees.fee_amount, 'usd_value', block_fees.fees_usd)) AS fee_tokens, sum(block_fees.fees_usd) AS total_fees_usd FROM block_fees GROUP BY block_fees.height, block_fees.pool_address ), total_incentives_by_pool AS ( SELECT bi.height, pi.pool_address, json_agg(json_build_object('denom', bi.incentive_token_denom, 'amount', bi.incentive_amount, 'usd_value', bi.incentives_usd)) AS incentive_tokens, sum(bi.incentives_usd) AS total_incentives_usd FROM block_incentives bi LEFT JOIN pool_info pi ON bi.lp_token = pi.lp_token GROUP BY bi.height, pi.pool_address ) SELECT bd.height, bd."timestamp", pl.pool_address, pl.token0_denom, pl.token1_denom, pl.token0_balance, pl.token1_balance, pl.token0_value_usd, pl.token1_value_usd, pl.total_liquidity_usd, tf.fee_tokens, COALESCE(tf.total_fees_usd, 0::double precision) AS fees_usd, ti.incentive_tokens, COALESCE(ti.total_incentives_usd, 0::double precision) AS incentives_usd, COALESCE(tf.total_fees_usd, 0::double precision) + COALESCE(ti.total_incentives_usd, 0::double precision) AS total_earnings_usd FROM block_data bd JOIN pool_liquidity pl ON bd.height = pl.height LEFT JOIN total_fees_by_pool tf ON bd.height = tf.height AND pl.pool_address = tf.pool_address LEFT JOIN total_incentives_by_pool ti ON bd.height = ti.height AND pl.pool_address = ti.pool_address WHERE bd.next_height IS NOT NULL ORDER BY bd.height, pl.pool_address`);

export const materializedUnstakeLiquidityInV1Cosmos = v1Cosmos.materializedView("materialized_unstake_liquidity", {	sender: text(),
	owner: text(),
	amount: numeric(),
	lpToken: text("lp_token"),
	pool: text(),
	incentiveAddress: text("incentive_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'sender'::text AS owner, (attributes(events.*) ->> 'amount'::text)::numeric AS amount, attributes(events.*) ->> 'lp_token'::text AS lp_token, plt.pool, attributes(events.*) ->> '_contract_address'::text AS incentive_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events LEFT JOIN v1_cosmos.pool_lp_token plt ON (attributes(events.*) ->> 'lp_token'::text) = plt.lp_token WHERE (events.data ->> 'type'::text) = 'wasm-withdraw'::text`);

export const poolBalanceInV1Cosmos = v1Cosmos.view("pool_balance", {	poolAddress: text("pool_address"),
	token0Denom: text("token0_denom"),
	token0Balance: numeric("token0_balance"),
	token1Denom: text("token1_denom"),
	token1Balance: numeric("token1_balance"),
	share: numeric(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
}).as(sql`WITH all_heights AS ( SELECT DISTINCT all_events.pool_address, all_events.height FROM ( SELECT add_liquidity.pool_address, add_liquidity.height FROM v1_cosmos.add_liquidity UNION ALL SELECT withdraw_liquidity.pool_address, withdraw_liquidity.height FROM v1_cosmos.withdraw_liquidity UNION ALL SELECT swap.pool_address, swap.height FROM v1_cosmos.swap) all_events ), add_liquidity AS ( SELECT add_liquidity.pool_address, add_liquidity.token0_denom, sum(add_liquidity.token0_amount) OVER (PARTITION BY add_liquidity.pool_address, add_liquidity.token0_denom ORDER BY add_liquidity.height) AS total_token0_added, add_liquidity.token1_denom, sum(add_liquidity.token1_amount) OVER (PARTITION BY add_liquidity.pool_address, add_liquidity.token1_denom ORDER BY add_liquidity.height) AS total_token1_added, sum(add_liquidity.share) OVER (PARTITION BY add_liquidity.pool_address ORDER BY add_liquidity.height) AS total_share_added, add_liquidity.height FROM v1_cosmos.add_liquidity ), withdraw_liquidity AS ( SELECT withdraw_liquidity.pool_address, withdraw_liquidity.token0_denom, sum(withdraw_liquidity.token0_amount) OVER (PARTITION BY withdraw_liquidity.pool_address, withdraw_liquidity.token0_denom ORDER BY withdraw_liquidity.height) AS total_token0_withdrawn, withdraw_liquidity.token1_denom, sum(withdraw_liquidity.token1_amount) OVER (PARTITION BY withdraw_liquidity.pool_address, withdraw_liquidity.token1_denom ORDER BY withdraw_liquidity.height) AS total_token1_withdrawn, sum(withdraw_liquidity.share) OVER (PARTITION BY withdraw_liquidity.pool_address ORDER BY withdraw_liquidity.height) AS total_share_withdrawn, withdraw_liquidity.height FROM v1_cosmos.withdraw_liquidity ), swap_impact AS ( SELECT s_1.pool_address, s_1.height, CASE WHEN s_1.offer_asset = p.token0_denom THEN s_1.offer_amount WHEN s_1.ask_asset = p.token0_denom THEN s_1.return_amount * '-1'::integer::numeric - COALESCE(s_1.fee_share_amount, 0::numeric) ELSE 0::numeric END AS token0_swap_impact, CASE WHEN s_1.offer_asset = p.token1_denom THEN s_1.offer_amount WHEN s_1.ask_asset = p.token1_denom THEN s_1.return_amount * '-1'::integer::numeric - COALESCE(s_1.fee_share_amount, 0::numeric) ELSE 0::numeric END AS token1_swap_impact FROM v1_cosmos.swap s_1 JOIN ( SELECT DISTINCT add_liquidity.pool_address, add_liquidity.token0_denom, add_liquidity.token1_denom FROM v1_cosmos.add_liquidity) p ON s_1.pool_address = p.pool_address ), swap_totals AS ( SELECT swap_impact.pool_address, sum(swap_impact.token0_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token0_swap_impact, sum(swap_impact.token1_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token1_swap_impact, swap_impact.height FROM swap_impact ) SELECT h.pool_address, a.token0_denom, COALESCE(a.total_token0_added, 0::numeric) - COALESCE(w.total_token0_withdrawn, 0::numeric) + COALESCE(s.total_token0_swap_impact, 0::numeric) AS token0_balance, a.token1_denom, COALESCE(a.total_token1_added, 0::numeric) - COALESCE(w.total_token1_withdrawn, 0::numeric) + COALESCE(s.total_token1_swap_impact, 0::numeric) AS token1_balance, COALESCE(a.total_share_added, 0::numeric) - COALESCE(w.total_share_withdrawn, 0::numeric) AS share, h.height FROM all_heights h LEFT JOIN add_liquidity a ON h.pool_address = a.pool_address AND h.height >= a.height AND a.height = (( SELECT max(add_liquidity.height) AS max FROM add_liquidity WHERE add_liquidity.pool_address = h.pool_address AND add_liquidity.height <= h.height)) LEFT JOIN withdraw_liquidity w ON h.pool_address = w.pool_address AND h.height >= w.height AND w.height = (( SELECT max(withdraw_liquidity.height) AS max FROM withdraw_liquidity WHERE withdraw_liquidity.pool_address = h.pool_address AND withdraw_liquidity.height <= h.height)) LEFT JOIN swap_totals s ON h.pool_address = s.pool_address AND h.height >= s.height AND s.height = (( SELECT max(swap_totals.height) AS max FROM swap_totals WHERE swap_totals.pool_address = h.pool_address AND swap_totals.height <= h.height))`);

export const swapInV1Cosmos = v1Cosmos.view("swap", {	sender: text(),
	receiver: text(),
	askAsset: text("ask_asset"),
	commissionAmount: numeric("commission_amount"),
	feeShareAmount: numeric("fee_share_amount"),
	makerFeeAmount: numeric("maker_fee_amount"),
	offerAmount: numeric("offer_amount"),
	offerAsset: text("offer_asset"),
	returnAmount: numeric("return_amount"),
	spreadAmount: numeric("spread_amount"),
	poolAddress: text("pool_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	transactionEventIndex: integer("transaction_event_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, attributes(events.*) ->> 'ask_asset'::text AS ask_asset, (attributes(events.*) ->> 'commission_amount'::text)::numeric AS commission_amount, (attributes(events.*) ->> 'fee_share_amount'::text)::numeric AS fee_share_amount, (attributes(events.*) ->> 'maker_fee_amount'::text)::numeric AS maker_fee_amount, (attributes(events.*) ->> 'offer_amount'::text)::numeric AS offer_amount, attributes(events.*) ->> 'offer_asset'::text AS offer_asset, (attributes(events.*) ->> 'return_amount'::text)::numeric AS return_amount, (attributes(events.*) ->> 'spread_amount'::text)::numeric AS spread_amount, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-swap'::text`);

export const stakeLiquidityInV1Cosmos = v1Cosmos.view("stake_liquidity", {	sender: text(),
	owner: text(),
	amount: numeric(),
	lpToken: text("lp_token"),
	pool: text(),
	incentiveAddress: text("incentive_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'user'::text AS owner, (attributes(events.*) ->> 'amount'::text)::numeric AS amount, attributes(events.*) ->> 'lp_token'::text AS lp_token, plt.pool, attributes(events.*) ->> '_contract_address'::text AS incentive_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events LEFT JOIN v1_cosmos.pool_lp_token plt ON (attributes(events.*) ->> 'lp_token'::text) = plt.lp_token WHERE (events.data ->> 'type'::text) = 'wasm-deposit'::text`);

export const incentivizeInV1Cosmos = v1Cosmos.view("incentivize", {	lpToken: text("lp_token"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startTs: bigint("start_ts", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	endTs: bigint("end_ts", { mode: "number" }),
	reward: text(),
	rewardsPerSecond: numeric("rewards_per_second"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	transactionEventIndex: integer("transaction_event_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'lp_token'::text AS lp_token, (attributes(events.*) ->> 'start_ts'::text)::bigint AS start_ts, (attributes(events.*) ->> 'end_ts'::text)::bigint AS end_ts, attributes(events.*) ->> 'reward'::text AS reward, (attributes(events.*) ->> 'rps'::text)::numeric AS rewards_per_second, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-incentivize'::text`);

export const unstakeLiquidityInV1Cosmos = v1Cosmos.view("unstake_liquidity", {	sender: text(),
	owner: text(),
	amount: numeric(),
	lpToken: text("lp_token"),
	pool: text(),
	incentiveAddress: text("incentive_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'sender'::text AS owner, (attributes(events.*) ->> 'amount'::text)::numeric AS amount, attributes(events.*) ->> 'lp_token'::text AS lp_token, plt.pool, attributes(events.*) ->> '_contract_address'::text AS incentive_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events LEFT JOIN v1_cosmos.pool_lp_token plt ON (attributes(events.*) ->> 'lp_token'::text) = plt.lp_token WHERE (events.data ->> 'type'::text) = 'wasm-withdraw'::text`);

export const poolsInV1Cosmos = v1Cosmos.view("pools", {	token0: text(),
	token1: text(),
	poolAddress: text("pool_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	createIndex: integer("create_index"),
	registerIndex: integer("register_index"),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	createTransactionIndex: integer("create_transaction_index"),
	registerTransactionIndex: integer("register_transaction_index"),
}).as(sql`WITH create_pair AS ( SELECT attributes(events.*) ->> 'action'::text AS action, attributes(events.*) ->> 'pair'::text AS pair, attributes(events.*) ->> '_contract_address'::text AS factory_address, attributes(events.*) ->> 'msg_index'::text AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-create_pair'::text ), register AS ( SELECT attributes(events.*) ->> 'action'::text AS action, attributes(events.*) ->> 'pair_contract_addr'::text AS pair_contract_addr, attributes(events.*) ->> '_contract_address'::text AS factory_address, attributes(events.*) ->> 'msg_index'::text AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-register'::text ) SELECT split_part(cp.pair, '-'::text, 1) AS token0, split_part(cp.pair, '-'::text, 2) AS token1, r.pair_contract_addr AS pool_address, cp.msg_index::integer AS msg_index, cp.internal_chain_id, cp.block_hash, cp.height, cp.index AS create_index, r.index AS register_index, cp."timestamp", cp.transaction_hash, cp.transaction_index AS create_transaction_index, r.transaction_index AS register_transaction_index FROM create_pair cp JOIN register r ON cp.transaction_hash = r.transaction_hash`);

export const addLiquidityInV1Cosmos = v1Cosmos.view("add_liquidity", {	sender: text(),
	receiver: text(),
	token0Denom: text("token0_denom"),
	token0Amount: numeric("token0_amount"),
	token1Denom: text("token1_denom"),
	token1Amount: numeric("token1_amount"),
	share: numeric(),
	poolAddress: text("pool_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, regexp_replace(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom, (regexp_matches(attributes(events.*) ->> 'assets'::text, '^\d+'::text))[1]::numeric AS token0_amount, regexp_replace(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom, (regexp_matches(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 2), '^\d+'::text))[1]::numeric AS token1_amount, (attributes(events.*) ->> 'share'::text)::numeric AS share, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-provide_liquidity'::text`);

export const poolUserSharesInV1Cosmos = v1Cosmos.view("pool_user_shares", {	poolAddress: text("pool_address"),
	owner: text(),
	incentiveAddress: text("incentive_address"),
	totalShareAmount: numeric("total_share_amount"),
	stakedShareAmount: numeric("staked_share_amount"),
	unstakedShareAmount: numeric("unstaked_share_amount"),
	lastUpdateTime: timestamp("last_update_time", { withTimezone: true, mode: 'string' }),
}).as(sql`WITH combined_liquidity_operations AS ( SELECT COALESCE(add_liquidity.receiver, add_liquidity.sender) AS owner, add_liquidity.pool_address, add_liquidity.share AS share_amount, add_liquidity."timestamp" FROM v1_cosmos.add_liquidity UNION ALL SELECT withdraw_liquidity.receiver AS owner, withdraw_liquidity.pool_address, - withdraw_liquidity.share AS share_amount, withdraw_liquidity."timestamp" FROM v1_cosmos.withdraw_liquidity ), user_total_shares AS ( SELECT combined_liquidity_operations.pool_address, combined_liquidity_operations.owner, sum(combined_liquidity_operations.share_amount) AS total_share_amount, max(combined_liquidity_operations."timestamp") AS last_update_time FROM combined_liquidity_operations GROUP BY combined_liquidity_operations.pool_address, combined_liquidity_operations.owner HAVING sum(combined_liquidity_operations.share_amount) > 0::numeric ), user_staked_shares AS ( SELECT stake_liquidity.pool, stake_liquidity.owner, sum(stake_liquidity.amount) AS staked_share_amount, stake_liquidity.incentive_address FROM v1_cosmos.stake_liquidity GROUP BY stake_liquidity.pool, stake_liquidity.owner, stake_liquidity.incentive_address ), user_unstaked_shares AS ( SELECT unstake_liquidity.pool, unstake_liquidity.owner, sum(unstake_liquidity.amount) AS unstaked_share_amount FROM v1_cosmos.unstake_liquidity GROUP BY unstake_liquidity.pool, unstake_liquidity.owner ), final_user_shares AS ( SELECT t.pool_address, t.owner, s.incentive_address, t.total_share_amount, COALESCE(s.staked_share_amount, 0::numeric) - COALESCE(u.unstaked_share_amount, 0::numeric) AS staked_share_amount, t.total_share_amount - (COALESCE(s.staked_share_amount, 0::numeric) - COALESCE(u.unstaked_share_amount, 0::numeric)) AS unstaked_share_amount, t.last_update_time FROM user_total_shares t LEFT JOIN user_staked_shares s ON t.pool_address = s.pool AND t.owner = s.owner LEFT JOIN user_unstaked_shares u ON t.pool_address = u.pool AND t.owner = u.owner ) SELECT final_user_shares.pool_address, final_user_shares.owner, final_user_shares.incentive_address, final_user_shares.total_share_amount, final_user_shares.staked_share_amount, final_user_shares.unstaked_share_amount, final_user_shares.last_update_time FROM final_user_shares ORDER BY final_user_shares.pool_address, final_user_shares.owner`);

export const withdrawLiquidityInV1Cosmos = v1Cosmos.view("withdraw_liquidity", {	sender: text(),
	receiver: text(),
	token0Denom: text("token0_denom"),
	token0Amount: numeric("token0_amount"),
	token1Denom: text("token1_denom"),
	token1Amount: numeric("token1_amount"),
	share: numeric(),
	poolAddress: text("pool_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, COALESCE(attributes(events.*) ->> 'receiver'::text, attributes(events.*) ->> 'sender'::text) AS receiver, regexp_replace(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom, (regexp_matches(attributes(events.*) ->> 'refund_assets'::text, '^\d+'::text))[1]::numeric AS token0_amount, regexp_replace(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom, (regexp_matches(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 2), '^\d+'::text))[1]::numeric AS token1_amount, (attributes(events.*) ->> 'withdrawn_share'::text)::numeric AS share, ( SELECT plt.pool FROM v1_cosmos.pool_lp_token plt WHERE plt.pool = (attributes(events.*) ->> '_contract_address'::text) OR plt.lp_token = (attributes(events.*) ->> '_contract_address'::text) LIMIT 1) AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-withdraw_liquidity'::text`);

export const historicPoolYieldInV1Cosmos = v1Cosmos.view("historic_pool_yield", {	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	poolAddress: text("pool_address"),
	token0Denom: text("token0_denom"),
	token1Denom: text("token1_denom"),
	token0Balance: numeric("token0_balance"),
	token1Balance: numeric("token1_balance"),
	token0ValueUsd: doublePrecision("token0_value_usd"),
	token1ValueUsd: doublePrecision("token1_value_usd"),
	totalLiquidityUsd: doublePrecision("total_liquidity_usd"),
	feeTokens: json("fee_tokens"),
	feesUsd: doublePrecision("fees_usd"),
	incentiveTokens: json("incentive_tokens"),
	incentivesUsd: doublePrecision("incentives_usd"),
	totalEarningsUsd: doublePrecision("total_earnings_usd"),
}).as(sql`WITH block_data AS ( SELECT b.height, b."time" AS "timestamp", lead(b."time") OVER (ORDER BY b.height) AS next_timestamp, lead(b.height) OVER (ORDER BY b.height) AS next_height FROM v1_cosmos.blocks b ), token_prices_by_block AS ( SELECT bd_1.height, bd_1."timestamp", bd_1.next_timestamp, bd_1.next_height, EXTRACT(epoch FROM bd_1.next_timestamp - bd_1."timestamp") AS seconds_between_blocks, t.denomination, tp.price, t.decimals, t.token_name FROM block_data bd_1 CROSS JOIN LATERAL ( SELECT DISTINCT token_prices.token FROM v1_cosmos.token_prices) d LEFT JOIN LATERAL ( SELECT token_prices.token, token_prices.price FROM v1_cosmos.token_prices WHERE token_prices.token = d.token ORDER BY (abs(EXTRACT(epoch FROM bd_1."timestamp" - token_prices.created_at))) LIMIT 1) tp ON true LEFT JOIN v1_cosmos.token t ON tp.token = t.token_name WHERE bd_1.next_height IS NOT NULL ), block_fees AS ( SELECT s.height, s.pool_address, s.ask_asset AS fee_token_denom, sum(s.commission_amount) AS fee_amount, sum(s.commission_amount::double precision / power(10::double precision, COALESCE(tp.decimals::integer, 6)::double precision)) * COALESCE(tp.price, 0::numeric)::double precision AS fees_usd FROM v1_cosmos.swap s LEFT JOIN token_prices_by_block tp ON s.height = tp.height AND s.ask_asset = tp.denomination GROUP BY s.height, s.pool_address, s.ask_asset, tp.price, tp.decimals ), block_incentives AS ( SELECT bp.height, i.lp_token, i.reward AS incentive_token_denom, sum(i.rewards_per_second * tp.seconds_between_blocks) AS incentive_amount, sum((i.rewards_per_second * tp.seconds_between_blocks)::double precision / power(10::double precision, COALESCE(tp.decimals::integer, 6)::double precision)) * COALESCE(tp.price, 0::numeric)::double precision AS incentives_usd FROM block_data bp JOIN v1_cosmos.incentivize i ON i.start_ts::numeric <= EXTRACT(epoch FROM bp."timestamp") AND i.end_ts::numeric >= EXTRACT(epoch FROM bp."timestamp") LEFT JOIN token_prices_by_block tp ON bp.height = tp.height AND i.reward = tp.denomination GROUP BY bp.height, i.lp_token, i.reward, tp.seconds_between_blocks, tp.price, tp.decimals ), pool_info AS ( SELECT DISTINCT pool_balance.pool_address, (pool_balance.token0_denom || ':'::text) || pool_balance.token1_denom AS lp_token FROM v1_cosmos.pool_balance ), pool_liquidity AS ( SELECT h.height, a.pool_address, a.token0_denom, a.token1_denom, a.token0_balance, a.token1_balance, a.token0_balance::double precision / power(10::double precision, COALESCE(tp0.decimals::integer, 6)::double precision) * COALESCE(tp0.price, 0::numeric)::double precision AS token0_value_usd, a.token1_balance::double precision / power(10::double precision, COALESCE(tp1.decimals::integer, 6)::double precision) * COALESCE(tp1.price, 0::numeric)::double precision AS token1_value_usd, a.token0_balance::double precision / power(10::double precision, COALESCE(tp0.decimals::integer, 6)::double precision) * COALESCE(tp0.price, 0::numeric)::double precision + a.token1_balance::double precision / power(10::double precision, COALESCE(tp1.decimals::integer, 6)::double precision) * COALESCE(tp1.price, 0::numeric)::double precision AS total_liquidity_usd FROM v1_cosmos.blocks h JOIN v1_cosmos.pool_balance a ON h.height = a.height LEFT JOIN token_prices_by_block tp0 ON h.height = tp0.height AND a.token0_denom = tp0.denomination LEFT JOIN token_prices_by_block tp1 ON h.height = tp1.height AND a.token1_denom = tp1.denomination ), total_fees_by_pool AS ( SELECT block_fees.height, block_fees.pool_address, json_agg(json_build_object('denom', block_fees.fee_token_denom, 'amount', block_fees.fee_amount, 'usd_value', block_fees.fees_usd)) AS fee_tokens, sum(block_fees.fees_usd) AS total_fees_usd FROM block_fees GROUP BY block_fees.height, block_fees.pool_address ), total_incentives_by_pool AS ( SELECT bi.height, pi.pool_address, json_agg(json_build_object('denom', bi.incentive_token_denom, 'amount', bi.incentive_amount, 'usd_value', bi.incentives_usd)) AS incentive_tokens, sum(bi.incentives_usd) AS total_incentives_usd FROM block_incentives bi LEFT JOIN pool_info pi ON bi.lp_token = pi.lp_token GROUP BY bi.height, pi.pool_address ) SELECT bd.height, bd."timestamp", pl.pool_address, pl.token0_denom, pl.token1_denom, pl.token0_balance, pl.token1_balance, pl.token0_value_usd, pl.token1_value_usd, pl.total_liquidity_usd, tf.fee_tokens, COALESCE(tf.total_fees_usd, 0::double precision) AS fees_usd, ti.incentive_tokens, COALESCE(ti.total_incentives_usd, 0::double precision) AS incentives_usd, COALESCE(tf.total_fees_usd, 0::double precision) + COALESCE(ti.total_incentives_usd, 0::double precision) AS total_earnings_usd FROM block_data bd JOIN pool_liquidity pl ON bd.height = pl.height LEFT JOIN total_fees_by_pool tf ON bd.height = tf.height AND pl.pool_address = tf.pool_address LEFT JOIN total_incentives_by_pool ti ON bd.height = ti.height AND pl.pool_address = ti.pool_address WHERE bd.next_height IS NOT NULL ORDER BY bd.height, pl.pool_address`);

export const materializedSwapInV1Cosmos = v1Cosmos.materializedView("materialized_swap", {	sender: text(),
	receiver: text(),
	askAsset: text("ask_asset"),
	commissionAmount: numeric("commission_amount"),
	feeShareAmount: numeric("fee_share_amount"),
	makerFeeAmount: numeric("maker_fee_amount"),
	offerAmount: numeric("offer_amount"),
	offerAsset: text("offer_asset"),
	returnAmount: numeric("return_amount"),
	spreadAmount: numeric("spread_amount"),
	poolAddress: text("pool_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	transactionEventIndex: integer("transaction_event_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, attributes(events.*) ->> 'ask_asset'::text AS ask_asset, (attributes(events.*) ->> 'commission_amount'::text)::numeric AS commission_amount, (attributes(events.*) ->> 'fee_share_amount'::text)::numeric AS fee_share_amount, (attributes(events.*) ->> 'maker_fee_amount'::text)::numeric AS maker_fee_amount, (attributes(events.*) ->> 'offer_amount'::text)::numeric AS offer_amount, attributes(events.*) ->> 'offer_asset'::text AS offer_asset, (attributes(events.*) ->> 'return_amount'::text)::numeric AS return_amount, (attributes(events.*) ->> 'spread_amount'::text)::numeric AS spread_amount, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-swap'::text`);

export const materializedPoolsInV1Cosmos = v1Cosmos.materializedView("materialized_pools", {	token0: text(),
	token1: text(),
	poolAddress: text("pool_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	createIndex: integer("create_index"),
	registerIndex: integer("register_index"),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	createTransactionIndex: integer("create_transaction_index"),
	registerTransactionIndex: integer("register_transaction_index"),
}).as(sql`WITH create_pair AS ( SELECT attributes(events.*) ->> 'action'::text AS action, attributes(events.*) ->> 'pair'::text AS pair, attributes(events.*) ->> '_contract_address'::text AS factory_address, attributes(events.*) ->> 'msg_index'::text AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-create_pair'::text ), register AS ( SELECT attributes(events.*) ->> 'action'::text AS action, attributes(events.*) ->> 'pair_contract_addr'::text AS pair_contract_addr, attributes(events.*) ->> '_contract_address'::text AS factory_address, attributes(events.*) ->> 'msg_index'::text AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-register'::text ) SELECT split_part(cp.pair, '-'::text, 1) AS token0, split_part(cp.pair, '-'::text, 2) AS token1, r.pair_contract_addr AS pool_address, cp.msg_index::integer AS msg_index, cp.internal_chain_id, cp.block_hash, cp.height, cp.index AS create_index, r.index AS register_index, cp."timestamp", cp.transaction_hash, cp.transaction_index AS create_transaction_index, r.transaction_index AS register_transaction_index FROM create_pair cp JOIN register r ON cp.transaction_hash = r.transaction_hash`);

export const materializedIncentivizeInV1Cosmos = v1Cosmos.materializedView("materialized_incentivize", {	lpToken: text("lp_token"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startTs: bigint("start_ts", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	endTs: bigint("end_ts", { mode: "number" }),
	reward: text(),
	rewardsPerSecond: numeric("rewards_per_second"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	transactionEventIndex: integer("transaction_event_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'lp_token'::text AS lp_token, (attributes(events.*) ->> 'start_ts'::text)::bigint AS start_ts, (attributes(events.*) ->> 'end_ts'::text)::bigint AS end_ts, attributes(events.*) ->> 'reward'::text AS reward, (attributes(events.*) ->> 'rps'::text)::numeric AS rewards_per_second, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-incentivize'::text`);

export const materializedWithdrawLiquidityTotalsInV1Cosmos = v1Cosmos.materializedView("materialized_withdraw_liquidity_totals", {	poolAddress: text("pool_address"),
	token0Denom: text("token0_denom"),
	totalToken0Withdrawn: numeric("total_token0_withdrawn"),
	token1Denom: text("token1_denom"),
	totalToken1Withdrawn: numeric("total_token1_withdrawn"),
	totalShareWithdrawn: numeric("total_share_withdrawn"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
}).as(sql`SELECT materialized_withdraw_liquidity.pool_address, materialized_withdraw_liquidity.token0_denom, sum(materialized_withdraw_liquidity.token0_amount) OVER (PARTITION BY materialized_withdraw_liquidity.pool_address, materialized_withdraw_liquidity.token0_denom ORDER BY materialized_withdraw_liquidity.height) AS total_token0_withdrawn, materialized_withdraw_liquidity.token1_denom, sum(materialized_withdraw_liquidity.token1_amount) OVER (PARTITION BY materialized_withdraw_liquidity.pool_address, materialized_withdraw_liquidity.token1_denom ORDER BY materialized_withdraw_liquidity.height) AS total_token1_withdrawn, sum(materialized_withdraw_liquidity.share) OVER (PARTITION BY materialized_withdraw_liquidity.pool_address ORDER BY materialized_withdraw_liquidity.height) AS total_share_withdrawn, materialized_withdraw_liquidity.height FROM v1_cosmos.materialized_withdraw_liquidity`);

export const materializedAddLiquidityInV1Cosmos = v1Cosmos.materializedView("materialized_add_liquidity", {	sender: text(),
	receiver: text(),
	token0Denom: text("token0_denom"),
	token0Amount: numeric("token0_amount"),
	token1Denom: text("token1_denom"),
	token1Amount: numeric("token1_amount"),
	share: numeric(),
	poolAddress: text("pool_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, regexp_replace(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom, (regexp_matches(attributes(events.*) ->> 'assets'::text, '^\d+'::text))[1]::numeric AS token0_amount, regexp_replace(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom, (regexp_matches(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 2), '^\d+'::text))[1]::numeric AS token1_amount, (attributes(events.*) ->> 'share'::text)::numeric AS share, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-provide_liquidity'::text`);

export const materializedWithdrawLiquidityInV1Cosmos = v1Cosmos.materializedView("materialized_withdraw_liquidity", {	sender: text(),
	receiver: text(),
	token0Denom: text("token0_denom"),
	token0Amount: numeric("token0_amount"),
	token1Denom: text("token1_denom"),
	token1Amount: numeric("token1_amount"),
	share: numeric(),
	poolAddress: text("pool_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, COALESCE(attributes(events.*) ->> 'receiver'::text, attributes(events.*) ->> 'sender'::text) AS receiver, regexp_replace(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom, (regexp_matches(attributes(events.*) ->> 'refund_assets'::text, '^\d+'::text))[1]::numeric AS token0_amount, regexp_replace(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom, (regexp_matches(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 2), '^\d+'::text))[1]::numeric AS token1_amount, (attributes(events.*) ->> 'withdrawn_share'::text)::numeric AS share, ( SELECT plt.pool FROM v1_cosmos.pool_lp_token plt WHERE plt.pool = (attributes(events.*) ->> '_contract_address'::text) OR plt.lp_token = (attributes(events.*) ->> '_contract_address'::text) LIMIT 1) AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-withdraw_liquidity'::text`);

export const materializedAddLiquidityTotalsInV1Cosmos = v1Cosmos.materializedView("materialized_add_liquidity_totals", {	poolAddress: text("pool_address"),
	token0Denom: text("token0_denom"),
	totalToken0Added: numeric("total_token0_added"),
	token1Denom: text("token1_denom"),
	totalToken1Added: numeric("total_token1_added"),
	totalShareAdded: numeric("total_share_added"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
}).as(sql`SELECT materialized_add_liquidity.pool_address, materialized_add_liquidity.token0_denom, sum(materialized_add_liquidity.token0_amount) OVER (PARTITION BY materialized_add_liquidity.pool_address, materialized_add_liquidity.token0_denom ORDER BY materialized_add_liquidity.height) AS total_token0_added, materialized_add_liquidity.token1_denom, sum(materialized_add_liquidity.token1_amount) OVER (PARTITION BY materialized_add_liquidity.pool_address, materialized_add_liquidity.token1_denom ORDER BY materialized_add_liquidity.height) AS total_token1_added, sum(materialized_add_liquidity.share) OVER (PARTITION BY materialized_add_liquidity.pool_address ORDER BY materialized_add_liquidity.height) AS total_share_added, materialized_add_liquidity.height FROM v1_cosmos.materialized_add_liquidity`);

export const materializedPoolBalanceInV1Cosmos = v1Cosmos.materializedView("materialized_pool_balance", {	poolAddress: text("pool_address"),
	token0Denom: text("token0_denom"),
	token0Balance: numeric("token0_balance"),
	token1Denom: text("token1_denom"),
	token1Balance: numeric("token1_balance"),
	share: numeric(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
}).as(sql`SELECT h.pool_address, a.token0_denom, COALESCE(a.total_token0_added, 0::numeric) - COALESCE(w.total_token0_withdrawn, 0::numeric) + COALESCE(s.total_token0_swap_impact, 0::numeric) AS token0_balance, a.token1_denom, COALESCE(a.total_token1_added, 0::numeric) - COALESCE(w.total_token1_withdrawn, 0::numeric) + COALESCE(s.total_token1_swap_impact, 0::numeric) AS token1_balance, COALESCE(a.total_share_added, 0::numeric) - COALESCE(w.total_share_withdrawn, 0::numeric) AS share, h.height FROM v1_cosmos.materialized_all_heights h LEFT JOIN LATERAL ( SELECT a_1.pool_address, a_1.token0_denom, a_1.total_token0_added, a_1.token1_denom, a_1.total_token1_added, a_1.total_share_added, a_1.height FROM v1_cosmos.materialized_add_liquidity_totals a_1 WHERE a_1.pool_address = h.pool_address AND a_1.height <= h.height ORDER BY a_1.height DESC LIMIT 1) a ON true LEFT JOIN LATERAL ( SELECT w_1.pool_address, w_1.token0_denom, w_1.total_token0_withdrawn, w_1.token1_denom, w_1.total_token1_withdrawn, w_1.total_share_withdrawn, w_1.height FROM v1_cosmos.materialized_withdraw_liquidity_totals w_1 WHERE w_1.pool_address = h.pool_address AND w_1.height <= h.height ORDER BY w_1.height DESC LIMIT 1) w ON true LEFT JOIN LATERAL ( SELECT s_1.pool_address, s_1.total_token0_swap_impact, s_1.total_token1_swap_impact, s_1.height FROM v1_cosmos.materialized_swap_totals s_1 WHERE s_1.pool_address = h.pool_address AND s_1.height <= h.height ORDER BY s_1.height DESC LIMIT 1) s ON true`);

export const materializedAllHeightsInV1Cosmos = v1Cosmos.materializedView("materialized_all_heights", {	poolAddress: text("pool_address"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
}).as(sql`SELECT DISTINCT all_events.pool_address, all_events.height FROM ( SELECT materialized_add_liquidity.pool_address, materialized_add_liquidity.height FROM v1_cosmos.materialized_add_liquidity UNION ALL SELECT materialized_withdraw_liquidity.pool_address, materialized_withdraw_liquidity.height FROM v1_cosmos.materialized_withdraw_liquidity UNION ALL SELECT materialized_swap.pool_address, materialized_swap.height FROM v1_cosmos.materialized_swap) all_events`);

export const materializedPoolUserSharesInV1Cosmos = v1Cosmos.materializedView("materialized_pool_user_shares", {	poolAddress: text("pool_address"),
	owner: text(),
	incentiveAddress: text("incentive_address"),
	totalShareAmount: numeric("total_share_amount"),
	stakedShareAmount: numeric("staked_share_amount"),
	unstakedShareAmount: numeric("unstaked_share_amount"),
	lastUpdateTime: timestamp("last_update_time", { withTimezone: true, mode: 'string' }),
}).as(sql`WITH combined_liquidity_operations AS ( SELECT COALESCE(materialized_add_liquidity.receiver, materialized_add_liquidity.sender) AS owner, materialized_add_liquidity.pool_address, materialized_add_liquidity.share AS share_amount, materialized_add_liquidity."timestamp" FROM v1_cosmos.materialized_add_liquidity UNION ALL SELECT materialized_withdraw_liquidity.receiver AS owner, materialized_withdraw_liquidity.pool_address, - materialized_withdraw_liquidity.share AS share_amount, materialized_withdraw_liquidity."timestamp" FROM v1_cosmos.materialized_withdraw_liquidity ), user_total_shares AS ( SELECT combined_liquidity_operations.pool_address, combined_liquidity_operations.owner, sum(combined_liquidity_operations.share_amount) AS total_share_amount, max(combined_liquidity_operations."timestamp") AS last_update_time FROM combined_liquidity_operations GROUP BY combined_liquidity_operations.pool_address, combined_liquidity_operations.owner HAVING sum(combined_liquidity_operations.share_amount) > 0::numeric ), user_staked_shares AS ( SELECT materialized_stake_liquidity.pool, materialized_stake_liquidity.owner, sum(materialized_stake_liquidity.amount) AS staked_share_amount, materialized_stake_liquidity.incentive_address FROM v1_cosmos.materialized_stake_liquidity GROUP BY materialized_stake_liquidity.pool, materialized_stake_liquidity.owner, materialized_stake_liquidity.incentive_address ), user_unstaked_shares AS ( SELECT materialized_unstake_liquidity.pool, materialized_unstake_liquidity.owner, sum(materialized_unstake_liquidity.amount) AS unstaked_share_amount FROM v1_cosmos.materialized_unstake_liquidity GROUP BY materialized_unstake_liquidity.pool, materialized_unstake_liquidity.owner ), final_user_shares AS ( SELECT t.pool_address, t.owner, s.incentive_address, t.total_share_amount, COALESCE(s.staked_share_amount, 0::numeric) - COALESCE(u.unstaked_share_amount, 0::numeric) AS staked_share_amount, t.total_share_amount - (COALESCE(s.staked_share_amount, 0::numeric) - COALESCE(u.unstaked_share_amount, 0::numeric)) AS unstaked_share_amount, t.last_update_time FROM user_total_shares t LEFT JOIN user_staked_shares s ON t.pool_address = s.pool AND t.owner = s.owner LEFT JOIN user_unstaked_shares u ON t.pool_address = u.pool AND t.owner = u.owner ) SELECT final_user_shares.pool_address, final_user_shares.owner, final_user_shares.incentive_address, final_user_shares.total_share_amount, final_user_shares.staked_share_amount, final_user_shares.unstaked_share_amount, final_user_shares.last_update_time FROM final_user_shares ORDER BY final_user_shares.pool_address, final_user_shares.owner`);

export const materializedStakeLiquidityInV1Cosmos = v1Cosmos.materializedView("materialized_stake_liquidity", {	sender: text(),
	owner: text(),
	amount: numeric(),
	lpToken: text("lp_token"),
	pool: text(),
	incentiveAddress: text("incentive_address"),
	msgIndex: integer("msg_index"),
	internalChainId: integer("internal_chain_id"),
	blockHash: text("block_hash"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
	index: integer(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }),
	transactionHash: text("transaction_hash"),
	transactionIndex: integer("transaction_index"),
	data: jsonb(),
}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'user'::text AS owner, (attributes(events.*) ->> 'amount'::text)::numeric AS amount, attributes(events.*) ->> 'lp_token'::text AS lp_token, plt.pool, attributes(events.*) ->> '_contract_address'::text AS incentive_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, events.data FROM v1_cosmos.events LEFT JOIN v1_cosmos.pool_lp_token plt ON (attributes(events.*) ->> 'lp_token'::text) = plt.lp_token WHERE (events.data ->> 'type'::text) = 'wasm-deposit'::text`);

export const materializedSwapTotalsInV1Cosmos = v1Cosmos.materializedView("materialized_swap_totals", {	poolAddress: text("pool_address"),
	totalToken0SwapImpact: numeric("total_token0_swap_impact"),
	totalToken1SwapImpact: numeric("total_token1_swap_impact"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
}).as(sql`WITH swap_impact AS ( SELECT s_1.pool_address, s_1.height, CASE WHEN s_1.offer_asset = p.token0_denom THEN s_1.offer_amount WHEN s_1.ask_asset = p.token0_denom THEN s_1.return_amount * '-1'::integer::numeric - COALESCE(s_1.fee_share_amount, 0::numeric) ELSE 0::numeric END AS token0_swap_impact, CASE WHEN s_1.offer_asset = p.token1_denom THEN s_1.offer_amount WHEN s_1.ask_asset = p.token1_denom THEN s_1.return_amount * '-1'::integer::numeric - COALESCE(s_1.fee_share_amount, 0::numeric) ELSE 0::numeric END AS token1_swap_impact FROM v1_cosmos.materialized_swap s_1 JOIN ( SELECT DISTINCT materialized_add_liquidity.pool_address, materialized_add_liquidity.token0_denom, materialized_add_liquidity.token1_denom FROM v1_cosmos.materialized_add_liquidity) p ON s_1.pool_address = p.pool_address ) SELECT swap_impact.pool_address, sum(swap_impact.token0_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token0_swap_impact, sum(swap_impact.token1_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token1_swap_impact, swap_impact.height FROM swap_impact`);