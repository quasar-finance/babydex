import { pgTable, pgSchema, index, foreignKey, integer, text, bigint, jsonb, timestamp, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const v1Cosmos = pgSchema("v1_cosmos");


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
			foreignColumns: [chains.id],
			name: "transactions_chain_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const tokenInV1Cosmos = v1Cosmos.table("token", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "v1_cosmos.token_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	coingeckoId: text("coingecko_id").notNull(),
	denomination: text(),
	tokenName: text("token_name"),
});

export const tokenPricesInV1Cosmos = v1Cosmos.table("token_prices", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).generatedByDefaultAsIdentity({ name: "v1_cosmos.token_prices_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	denomination: text().notNull(),
	price: numeric(),
	lastUpdatedAt: numeric("last_updated_at"),
}, (table) => [
	foreignKey({
			columns: [table.denomination],
			foreignColumns: [tokenInV1Cosmos.denomination],
			name: "token_prices_denomination_fkey"
		}),
]);

export const blocksInV1Cosmos = v1Cosmos.table("blocks", {
	chainId: integer("chain_id").notNull(),
	hash: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }).notNull(),
	time: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	data: jsonb().notNull(),
}, (table) => [
	index("idx_blocks_height").using("btree", table.chainId.asc().nullsLast().op("int4_ops"), table.height.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.chainId],
			foreignColumns: [chains.id],
			name: "blocks_chain_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

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
	index("events_recv_packet_by_chain_destination_channel_sequence_idx").using("btree", sql`chain_id`, sql`((attributes(events.*) ->> 'packet_sequence'::text))::numeric`, sql`null`).where(sql`((data ->> 'type'::text) = 'recv_packet'::text)`),
	index("events_send_packet_by_chain_id_tx_hash_msg_index_idx").using("btree", sql`chain_id`, sql`transaction_hash`, sql`null`).where(sql`((data ->> 'type'::text) = 'send_packet'::text)`),
	index("events_send_packet_by_time_idx").using("btree", table.time.desc().nullsFirst().op("timestamptz_ops")).where(sql`((data ->> 'type'::text) = 'send_packet'::text)`),
	index("events_send_packet_by_tx_hash_msg_index_idx").using("btree", sql`transaction_hash`, sql`null`).where(sql`((data ->> 'type'::text) = 'send_packet'::text)`),
	index("events_transaction_hash_int4_idx").using("btree", sql`transaction_hash`, sql`null`),
	index("events_update_client_by_chain_id_revision_height_idx").using("btree", sql`chain_id`, sql`'-'::text`).where(sql`((data ->> 'type'::text) = 'update_client'::text)`),
	index("events_wasm_ibc_transfer_by_time_idx").using("btree", table.time.desc().nullsFirst().op("timestamptz_ops")).where(sql`(((data ->> 'type'::text) = 'wasm-ibc_transfer'::text) AND ((attributes(events.*) ->> 'assets'::text) IS NOT NULL))`),
	index("idx_events_height").using("btree", table.chainId.asc().nullsLast().op("int4_ops"), table.height.asc().nullsLast().op("int4_ops")),
	index("idx_events_height_desc").using("btree", table.chainId.asc().nullsLast().op("int4_ops"), table.height.desc().nullsFirst().op("int8_ops")),
	index("idx_events_type").using("btree", sql`(data ->> 'type'::text)`),
	foreignKey({
			columns: [table.chainId, table.blockHash],
			foreignColumns: [blocksInV1Cosmos.chainId, blocksInV1Cosmos.hash],
			name: "events_chain_id_block_hash_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.chainId],
			foreignColumns: [chains.id],
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
			foreignColumns: [chains.id],
			name: "contracts_chain_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);
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
}).with({"securityInvoker":"on"}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, attributes(events.*) ->> 'ask_asset'::text AS ask_asset, (attributes(events.*) ->> 'commission_amount'::text)::numeric AS commission_amount, (attributes(events.*) ->> 'fee_share_amount'::text)::numeric AS fee_share_amount, (attributes(events.*) ->> 'maker_fee_amount'::text)::numeric AS maker_fee_amount, (attributes(events.*) ->> 'offer_amount'::text)::numeric AS offer_amount, attributes(events.*) ->> 'offer_asset'::text AS offer_asset, (attributes(events.*) ->> 'return_amount'::text)::numeric AS return_amount, (attributes(events.*) ->> 'spread_amount'::text)::numeric AS spread_amount, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-swap'::text`);

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
}).with({"securityInvoker":"on"}).as(sql`SELECT attributes(events.*) ->> 'lp_token'::text AS lp_token, (attributes(events.*) ->> 'start_ts'::text)::bigint AS start_ts, (attributes(events.*) ->> 'end_ts'::text)::bigint AS end_ts, attributes(events.*) ->> 'reward'::text AS reward, (attributes(events.*) ->> 'rps'::text)::numeric AS rewards_per_second, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-incentivize'::text`);

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
	transactionEventIndex: integer("transaction_event_index"),
	data: jsonb(),
}).with({"securityInvoker":"on"}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, regexp_replace(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom, (regexp_matches(attributes(events.*) ->> 'assets'::text, '^\d+'::text))[1]::numeric AS token0_amount, regexp_replace(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom, (regexp_matches(split_part(attributes(events.*) ->> 'assets'::text, ', '::text, 2), '^\d+'::text))[1]::numeric AS token1_amount, (attributes(events.*) ->> 'share'::text)::numeric AS share, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-provide_liquidity'::text`);

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
	transactionEventIndex: integer("transaction_event_index"),
	data: jsonb(),
}).with({"securityInvoker":"on"}).as(sql`SELECT attributes(events.*) ->> 'sender'::text AS sender, attributes(events.*) ->> 'receiver'::text AS receiver, regexp_replace(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 1), '^\d+'::text, ''::text) AS token0_denom, (regexp_matches(attributes(events.*) ->> 'refund_assets'::text, '^\d+'::text))[1]::numeric AS token0_amount, regexp_replace(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 2), '^\d+'::text, ''::text) AS token1_denom, (regexp_matches(split_part(attributes(events.*) ->> 'refund_assets'::text, ', '::text, 2), '^\d+'::text))[1]::numeric AS token1_amount, (attributes(events.*) ->> 'withdrawn_share'::text)::numeric AS share, attributes(events.*) ->> '_contract_address'::text AS pool_address, (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index, events.chain_id AS internal_chain_id, events.block_hash, events.height, events.index, events."time" AS "timestamp", events.transaction_hash, events.transaction_index, NULL::integer AS transaction_event_index, events.data FROM v1_cosmos.events WHERE (events.data ->> 'type'::text) = 'wasm-withdraw_liquidity'::text`);

export const poolBalanceInV1Cosmos = v1Cosmos.view("pool_balance", {	poolAddress: text("pool_address"),
	token0Denom: text("token0_denom"),
	token0Balance: numeric("token0_balance"),
	token1Denom: text("token1_denom"),
	token1Balance: numeric("token1_balance"),
	share: numeric(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	height: bigint({ mode: "number" }),
}).with({"securityInvoker":"on"}).as(sql`WITH all_heights AS ( SELECT DISTINCT all_events.pool_address, all_events.height FROM ( SELECT add_liquidity.pool_address, add_liquidity.height FROM v1_cosmos.add_liquidity UNION ALL SELECT withdraw_liquidity.pool_address, withdraw_liquidity.height FROM v1_cosmos.withdraw_liquidity UNION ALL SELECT swap.pool_address, swap.height FROM v1_cosmos.swap) all_events ), add_liquidity AS ( SELECT add_liquidity.pool_address, add_liquidity.token0_denom, sum(add_liquidity.token0_amount) OVER (PARTITION BY add_liquidity.pool_address, add_liquidity.token0_denom ORDER BY add_liquidity.height) AS total_token0_added, add_liquidity.token1_denom, sum(add_liquidity.token1_amount) OVER (PARTITION BY add_liquidity.pool_address, add_liquidity.token1_denom ORDER BY add_liquidity.height) AS total_token1_added, sum(add_liquidity.share) OVER (PARTITION BY add_liquidity.pool_address ORDER BY add_liquidity.height) AS total_share_added, add_liquidity.height FROM v1_cosmos.add_liquidity ), withdraw_liquidity AS ( SELECT withdraw_liquidity.pool_address, withdraw_liquidity.token0_denom, sum(withdraw_liquidity.token0_amount) OVER (PARTITION BY withdraw_liquidity.pool_address, withdraw_liquidity.token0_denom ORDER BY withdraw_liquidity.height) AS total_token0_withdrawn, withdraw_liquidity.token1_denom, sum(withdraw_liquidity.token1_amount) OVER (PARTITION BY withdraw_liquidity.pool_address, withdraw_liquidity.token1_denom ORDER BY withdraw_liquidity.height) AS total_token1_withdrawn, sum(withdraw_liquidity.share) OVER (PARTITION BY withdraw_liquidity.pool_address ORDER BY withdraw_liquidity.height) AS total_share_withdrawn, withdraw_liquidity.height FROM v1_cosmos.withdraw_liquidity ), swap_impact AS ( SELECT s_1.pool_address, s_1.height, CASE WHEN s_1.offer_asset = p.token0_denom THEN s_1.offer_amount WHEN s_1.ask_asset = p.token0_denom THEN s_1.return_amount * '-1'::integer::numeric - COALESCE(s_1.fee_share_amount, 0::numeric) ELSE 0::numeric END AS token0_swap_impact, CASE WHEN s_1.offer_asset = p.token1_denom THEN s_1.offer_amount WHEN s_1.ask_asset = p.token1_denom THEN s_1.return_amount * '-1'::integer::numeric - COALESCE(s_1.fee_share_amount, 0::numeric) ELSE 0::numeric END AS token1_swap_impact FROM v1_cosmos.swap s_1 JOIN ( SELECT DISTINCT add_liquidity.pool_address, add_liquidity.token0_denom, add_liquidity.token1_denom FROM v1_cosmos.add_liquidity) p ON s_1.pool_address = p.pool_address ), swap_totals AS ( SELECT swap_impact.pool_address, sum(swap_impact.token0_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token0_swap_impact, sum(swap_impact.token1_swap_impact) OVER (PARTITION BY swap_impact.pool_address ORDER BY swap_impact.height) AS total_token1_swap_impact, swap_impact.height FROM swap_impact ) SELECT h.pool_address, a.token0_denom, COALESCE(a.total_token0_added, 0::numeric) - COALESCE(w.total_token0_withdrawn, 0::numeric) + COALESCE(s.total_token0_swap_impact, 0::numeric) AS token0_balance, a.token1_denom, COALESCE(a.total_token1_added, 0::numeric) - COALESCE(w.total_token1_withdrawn, 0::numeric) + COALESCE(s.total_token1_swap_impact, 0::numeric) AS token1_balance, COALESCE(a.total_share_added, 0::numeric) - COALESCE(w.total_share_withdrawn, 0::numeric) AS share, h.height FROM all_heights h LEFT JOIN add_liquidity a ON h.pool_address = a.pool_address AND h.height >= a.height AND a.height = (( SELECT max(add_liquidity.height) AS max FROM add_liquidity WHERE add_liquidity.pool_address = h.pool_address AND add_liquidity.height <= h.height)) LEFT JOIN withdraw_liquidity w ON h.pool_address = w.pool_address AND h.height >= w.height AND w.height = (( SELECT max(withdraw_liquidity.height) AS max FROM withdraw_liquidity WHERE withdraw_liquidity.pool_address = h.pool_address AND withdraw_liquidity.height <= h.height)) LEFT JOIN swap_totals s ON h.pool_address = s.pool_address AND h.height >= s.height AND s.height = (( SELECT max(swap_totals.height) AS max FROM swap_totals WHERE swap_totals.pool_address = h.pool_address AND swap_totals.height <= h.height))`);

export const poolFeePeriodsInV1Cosmos = v1Cosmos.view("pool_fee_periods", {	poolAddress: text("pool_address"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	startHeight: bigint("start_height", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	endHeight: bigint("end_height", { mode: "number" }),
	periodShares: numeric("period_shares"),
	token0Balance: numeric("token0_balance"),
	token1Balance: numeric("token1_balance"),
	periodFees: numeric("period_fees"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	blocksInPeriod: bigint("blocks_in_period", { mode: "number" }),
	feesPerShare: numeric("fees_per_share"),
}).with({"securityInvoker":"on"}).as(sql`WITH share_changes AS ( SELECT pool_balance.pool_address, pool_balance.height, pool_balance.token0_balance, pool_balance.token1_balance, pool_balance.share, lag(pool_balance.share) OVER (PARTITION BY pool_balance.pool_address ORDER BY pool_balance.height) AS prev_shares, lag(pool_balance.height) OVER (PARTITION BY pool_balance.pool_address ORDER BY pool_balance.height) AS prev_height FROM v1_cosmos.pool_balance ), max_heights AS ( SELECT pool_balance.pool_address, max(pool_balance.height) AS max_height FROM v1_cosmos.pool_balance GROUP BY pool_balance.pool_address ), period_boundaries AS ( SELECT s.pool_address, CASE WHEN s.prev_shares IS NULL THEN s.height ELSE s.prev_height END AS start_height, s.height - 1 AS end_height, CASE WHEN s.prev_shares IS NULL THEN s.share ELSE s.prev_shares END AS period_shares, s.token0_balance, s.token1_balance FROM share_changes s WHERE s.prev_shares IS NULL OR s.prev_shares <> s.share UNION ALL SELECT s.pool_address, s.height AS start_height, m.max_height AS end_height, s.share AS period_shares, s.token0_balance, s.token1_balance FROM share_changes s JOIN max_heights m ON s.pool_address = m.pool_address WHERE s.height = (( SELECT max(sc.height) AS max FROM share_changes sc WHERE sc.pool_address = s.pool_address AND (sc.prev_shares IS NULL OR sc.prev_shares <> sc.share))) ), fees_by_block AS ( SELECT swap.pool_address, swap.height, sum(swap.commission_amount) AS block_fees FROM v1_cosmos.swap GROUP BY swap.pool_address, swap.height ) SELECT p.pool_address, p.start_height, p.end_height, p.period_shares, p.token0_balance, p.token1_balance, COALESCE(sum(f.block_fees), 0::numeric) AS period_fees, p.end_height - p.start_height + 1 AS blocks_in_period, COALESCE(sum(f.block_fees), 0::numeric) / NULLIF(p.period_shares, 0::numeric) AS fees_per_share FROM period_boundaries p LEFT JOIN fees_by_block f ON f.pool_address = p.pool_address AND f.height >= p.start_height AND f.height <= p.end_height GROUP BY p.pool_address, p.start_height, p.end_height, p.period_shares, p.token0_balance, p.token1_balance ORDER BY p.pool_address, p.start_height`);