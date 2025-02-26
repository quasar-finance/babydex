BEGIN;

create schema hubble;
create schema v1_aptos;
create schema v1_cosmos;
create schema v1_evm;

create table if not exists hubble.chains
(
    id                              serial
        primary key,
    chain_id                        text                  not null,
    display_name                    text
        unique,
    testnet                         boolean,
    max_tip_age_seconds             numeric,
    rpc_type                        text,
    addr_prefix                     text,
    enabled                         boolean default false not null,
    logo_uri                        text,
    enabled_staging                 boolean default false not null,
    execution                       boolean default false not null,
    indexer_id                      text,
    max_mapped_execution_height_gap integer
);

comment on column hubble.chains.execution is 'Execution chain indicator, which implies that there is also a beacon chain.';

-- Do I need this
alter table hubble.chains
    owner to "postgres";

create index if not exists chains_chain_id_idx
    on hubble.chains (chain_id) include (id);

create table if not exists v1_cosmos.blocks
(
    chain_id integer                  not null
        references hubble.chains
            on update cascade on delete cascade,
    hash     text                     not null,
    height   bigint                   not null,
    time     timestamp with time zone not null,
    data     jsonb                    not null,
    primary key (chain_id, hash)
);

comment on table v1_cosmos.blocks is 'DEPRECATED: use V1';

-- Do I need this
alter table v1_cosmos.blocks
    owner to "postgres";

create index if not exists idx_blocks_height
    on v1_cosmos.blocks (chain_id, height);

create table if not exists v1_cosmos.transactions
(
    chain_id   integer not null
        references hubble.chains
            on update cascade on delete cascade,
    block_hash text    not null,
    height     bigint  not null,
    data       jsonb   not null,
    hash       text    not null,
    index      integer not null,
    primary key (chain_id, hash),
    foreign key (block_hash, chain_id) references v1_cosmos.blocks (hash, chain_id)
        on update cascade on delete cascade
);

comment on table v1_cosmos.transactions is 'DEPRECATED: use V1';

-- Do I need this
alter table v1_cosmos.transactions
    owner to "postgres";

create index if not exists transactions_chain_id_height
    on v1_cosmos.transactions (chain_id asc, height desc);

create table if not exists v1_cosmos.events
(
    chain_id          integer                  not null
        references hubble.chains
            on update cascade on delete cascade,
    block_hash        text                     not null,
    height            bigint                   not null,
    transaction_hash  text,
    transaction_index integer,
    index             integer                  not null,
    data              jsonb                    not null,
    time              timestamp with time zone not null,
    created_at        timestamp with time zone default now(),
    primary key (chain_id, block_hash, index),
    foreign key (chain_id, block_hash) references v1_cosmos.blocks
        on update cascade on delete cascade,
    foreign key (chain_id, transaction_hash) references v1_cosmos.transactions
        on update cascade on delete cascade
);

create function attributes(v1_cosmos.events) returns jsonb
    immutable
    parallel safe
    language sql
as
$$
  select (
    select
      jsonb_object_agg(j->>'key', j->>'value')
    from jsonb_array_elements($1.data->'attributes') j
);
$$;

comment on table v1_cosmos.events is 'DEPRECATED: use V1';

-- Do I need this
alter table v1_cosmos.events
    owner to "postgres";

create index if not exists idx_events_type
    on v1_cosmos.events ((data ->> 'type'::text));

create index if not exists events_send_packet_by_time_idx
    on v1_cosmos.events (time desc)
    where ((data ->> 'type'::text) = 'send_packet'::text);

create index if not exists events_wasm_ibc_transfer_by_time_idx
    on v1_cosmos.events (time desc)
    where (((data ->> 'type'::text) = 'wasm-ibc_transfer'::text) AND
           ((attributes(events.*) ->> 'assets'::text) IS NOT NULL));

create index if not exists events_send_packet_by_chain_id_tx_hash_msg_index_idx
    on v1_cosmos.events (chain_id, transaction_hash, ((attributes(events.*) ->> 'msg_index'::text)::integer))
    where ((data ->> 'type'::text) = 'send_packet'::text);

create index if not exists events_recv_packet_by_chain_destination_channel_sequence_idx
    on v1_cosmos.events (chain_id, (attributes(events.*) ->> 'packet_dst_channel'::text),
                         ((attributes(events.*) ->> 'packet_sequence'::text)::numeric))
    where ((data ->> 'type'::text) = 'recv_packet'::text);

create index if not exists events_transaction_hash_int4_idx
    on v1_cosmos.events (transaction_hash, ((attributes(events.*) ->> 'msg_index'::text)::integer));

create index if not exists events_send_packet_by_tx_hash_msg_index_idx
    on v1_cosmos.events (transaction_hash, ((attributes(events.*) ->> 'msg_index'::text)::integer))
    where ((data ->> 'type'::text) = 'send_packet'::text);

create index if not exists events_update_client_by_chain_id_revision_height_idx
    on v1_cosmos.events (chain_id,
                         (split_part(attributes(events.*) ->> 'consensus_heights'::text, '-'::text, 2)::numeric))
    where ((data ->> 'type'::text) = 'update_client'::text);

create index if not exists idx_events_height
    on v1_cosmos.events (chain_id, height);

create index if not exists idx_events_height_desc
    on v1_cosmos.events (chain_id asc, height desc);

create table if not exists hubble.clients
(
    chain_id              integer not null
        references hubble.chains
            on update cascade on delete cascade,
    client_id             text    not null,
    counterparty_chain_id text    not null,
    primary key (chain_id, client_id, counterparty_chain_id)
);

-- Do I need this
alter table hubble.clients
    owner to "postgres";

create table if not exists v1_evm.logs
(
    chain_id   integer                  not null
        constraint logs_copy_chain_id_fkey
            references hubble.chains,
    block_hash text                     not null,
    height     bigint                   not null,
    time       timestamp with time zone not null,
    data       jsonb                    not null,
    constraint logs_copy_pkey
        primary key (chain_id, block_hash)
);

-- Do I need this
alter table v1_evm.logs
    owner to "postgres";

create unique index if not exists logs_chain_height_ids
    on v1_evm.logs (chain_id, height);

create table if not exists hubble.consensus_heights
(
    chain_id         integer not null
        references hubble.chains
            on update cascade on delete cascade,
    execution_height bigint  not null,
    consensus_height bigint  not null,
    primary key (chain_id, consensus_height)
);

alter table hubble.consensus_heights
    owner to "postgres";

create table if not exists hubble.contract_status
(
    internal_chain_id integer                                not null
        constraint fk_internal_chain_id
            references hubble.chains
            on delete cascade,
    address           text                                   not null,
    height            bigint                                 not null,
    timestamp         timestamp with time zone               not null,
    created_at        timestamp with time zone default now() not null,
    updated_at        timestamp with time zone default now() not null,
    primary key (internal_chain_id, address)
);

alter table hubble.contract_status
    owner to "postgres";

create table if not exists hubble.block_status
(
    indexer_id text                                   not null,
    height     bigint                                 not null,
    hash       text                                   not null,
    timestamp  timestamp with time zone               not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    primary key (indexer_id, height)
);

alter table hubble.block_status
    owner to "postgres";

create table if not exists hubble.indexer_status
(
    indexer_id text                                   not null
        constraint chain_status_pkey
            primary key,
    height     bigint                                 not null,
    timestamp  timestamp with time zone               not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

alter table hubble.indexer_status
    owner to "postgres";

create table if not exists hubble.block_fix
(
    indexer_id   text                                   not null,
    start_height bigint                                 not null,
    end_height   bigint                                 not null,
    created_at   timestamp with time zone default now() not null,
    updated_at   timestamp with time zone default now() not null
);

alter table hubble.block_fix
    owner to "postgres";

create table if not exists v1_evm.logs_sync
(
    internal_chain_id     integer,
    block_hash            text,
    height                bigint,
    log_index             integer,
    timestamp             timestamp with time zone,
    transaction_hash      text,
    transaction_index     integer,
    transaction_log_index integer,
    raw_log               jsonb,
    log_to_jsonb          jsonb
);

alter table v1_evm.logs_sync
    owner to "postgres";

create index if not exists logs_sync_chain_id_height_index
    on v1_evm.logs_sync (internal_chain_id asc, height desc);

create table if not exists v1_aptos.blocks
(
    internal_chain_id integer                                not null
        references hubble.chains
            on update cascade on delete cascade,
    block_hash        text                                   not null,
    height            bigint                                 not null,
    timestamp         timestamp with time zone               not null,
    first_version     bigint                                 not null,
    last_version      bigint                                 not null,
    created_at        timestamp with time zone default now() not null,
    updated_at        timestamp with time zone default now() not null,
    primary key (internal_chain_id, block_hash),
    constraint blocks_pk
        unique (internal_chain_id, height)
);

alter table v1_aptos.blocks
    owner to "postgres";

create index if not exists idx_blocks_height
    on v1_aptos.blocks (internal_chain_id, height);

create index if not exists idx_blocks_first_version
    on v1_aptos.blocks (internal_chain_id, first_version);

create index if not exists idx_blocks_last_version
    on v1_aptos.blocks (internal_chain_id, last_version);

create index if not exists blocks_internal_chain_id_versions_index
    on v1_aptos.blocks (internal_chain_id, first_version, last_version);

create table if not exists v1_aptos.transactions
(
    internal_chain_id integer                                not null
        references hubble.chains
            on update cascade on delete cascade,
    height            bigint                                 not null,
    version           bigint                                 not null,
    transaction_hash  text                                   not null,
    transaction_index bigint                                 not null,
    created_at        timestamp with time zone default now() not null,
    updated_at        timestamp with time zone default now() not null,
    primary key (internal_chain_id, version),
    constraint transactions_blocks_internal_chain_id_height_fk
        foreign key (internal_chain_id, height) references v1_aptos.blocks (internal_chain_id, height)
);

alter table v1_aptos.transactions
    owner to "postgres";

create index if not exists idx_transactions_height
    on v1_aptos.transactions (internal_chain_id, height);

create index if not exists idx_transactions_first_version
    on v1_aptos.transactions (internal_chain_id, version);

create index if not exists idx_transactions_last_version
    on v1_aptos.transactions (internal_chain_id, transaction_hash);

create table if not exists v1_aptos.events
(
    internal_chain_id       integer                                not null
        references hubble.chains
            on update cascade on delete cascade,
    height                  bigint                                 not null,
    version                 bigint                                 not null,
    sequence_number         bigint                                 not null,
    creation_number         bigint                                 not null,
    index                   bigint                                 not null,
    transaction_event_index bigint                                 not null,
    account_address         text                                   not null,
    type                    text                                   not null,
    data                    jsonb                                  not null,
    created_at              timestamp with time zone default now() not null,
    updated_at              timestamp with time zone default now() not null,
    primary key (internal_chain_id, version, index),
    constraint events_transactions_internal_chain_id_height_sequence_fk
        foreign key (internal_chain_id, version) references v1_aptos.transactions
);

alter table v1_aptos.events
    owner to "postgres";

create index if not exists idx_events_height
    on v1_aptos.events (internal_chain_id, height);

create index if not exists idx_events_first_version
    on v1_aptos.events (internal_chain_id, version, transaction_event_index);

create index if not exists event_type_height
    on v1_aptos.events (SUBSTRING(type FROM POSITION(('::'::text) IN (type)) + 2), height);

create table if not exists v1_aptos.contracts
(
    internal_chain_id integer                                                        not null
        constraint contracts_chain_id_fkey
            references hubble.chains
            on update cascade on delete cascade,
    address           text                                                           not null,
    start_height      bigint                                                         not null,
    end_height        bigint                   default '9223372036854775807'::bigint not null,
    description       text,
    created_at        timestamp with time zone default now()                         not null,
    updated_at        timestamp with time zone default now()                         not null,
    primary key (address, internal_chain_id, start_height)
);

alter table v1_aptos.contracts
    owner to "postgres";

create table if not exists hubble.assets
(
    chain_id       integer               not null
        references hubble.chains
            on update set null on delete set null,
    denom          text                  not null,
    display_symbol text,
    decimals       integer,
    logo_uri       text,
    display_name   text,
    gas_token      boolean default false not null,
    source         text,
    primary key (chain_id, denom)
);

alter table hubble.assets
    owner to "postgres";

create table if not exists v1_evm.contracts
(
    internal_chain_id        integer                                                        not null
        references hubble.chains
            on update cascade on delete cascade,
    address                  text                                                           not null,
    abi                      text,
    start_height             bigint                                                         not null,
    end_height               bigint                   default '9223372036854775807'::bigint not null,
    version                  text,
    description              text,
    created_at               timestamp with time zone default now()                         not null,
    updated_at               timestamp with time zone default now()                         not null,
    upgrade_transaction_hash text,
    primary key (internal_chain_id, address, start_height)
);

alter table v1_evm.contracts
    owner to "postgres";

create table if not exists hubble.token_sources
(
    id         serial
        primary key,
    source_uri text                                   not null,
    name       text                                   not null,
    logo_uri   text,
    enabled    boolean                  default true,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null
);

alter table hubble.token_sources
    owner to "postgres";

create table if not exists hubble.token_source_representations
(
    token_source_id   integer                                not null
        constraint token_source_representations_token_sources_id_fk
            references hubble.token_sources,
    internal_chain_id integer                                not null
        constraint token_source_representations_chains_id_fk
            references hubble.chains,
    address           bytea                                  not null,
    symbol            text                                   not null,
    name              text                                   not null,
    decimals          integer                                not null,
    logo_uri          text,
    created_at        timestamp with time zone default now() not null,
    updated_at        timestamp with time zone default now() not null,
    constraint token_source_representations_pk
        primary key (token_source_id, internal_chain_id, address)
);

alter table hubble.token_source_representations
    owner to "postgres";

create table if not exists v1_cosmos.contracts
(
    internal_chain_id integer                                                        not null
        constraint contracts_chain_id_fkey
            references hubble.chains
            on update cascade on delete cascade,
    address           text                                                           not null,
    start_height      bigint                                                         not null,
    end_height        bigint                   default '9223372036854775807'::bigint not null,
    description       text,
    created_at        timestamp with time zone default now()                         not null,
    updated_at        timestamp with time zone default now()                         not null,
    primary key (address, internal_chain_id, start_height)
);

alter table v1_cosmos.contracts
    owner to "postgres";

create or replace view v1_evm.client_created
            (name, client_id, internal_chain_id, block_hash, height, log_index, timestamp, transaction_hash,
             transaction_index, transaction_log_index, raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                       AS name,
       (log_to_jsonb -> 'data'::text) ->> 'clientId'::text AS client_id,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ClientCreated'::text;

alter table v1_evm.client_created
    owner to "postgres";

create or replace view v1_cosmos.create_client
            (client_id, client_type, consensus_height, msg_index, internal_chain_id, block_hash, height, index,
             timestamp, transaction_hash, transaction_index, transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'client_id'::text            AS client_id,
       attributes(events.*) ->> 'client_type'::text          AS client_type,
       attributes(events.*) ->> 'consensus_height'::text     AS consensus_height,
       (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index,
       chain_id                                              AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                         AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'create_client'::text;

alter table v1_cosmos.create_client
    owner to "postgres";

create or replace view v1_cosmos.send_packet
            (packet_data, packet_data_hex, packet_timeout_height, packet_timeout_timestamp, packet_sequence,
             packet_src_port, packet_src_channel, packet_dst_port, packet_dst_channel, packet_channel_ordering,
             packet_connection, connection_id, msg_index, internal_chain_id, block_hash, height, index, timestamp,
             transaction_hash, transaction_index, transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'packet_data'::text                         AS packet_data,
       attributes(events.*) ->> 'packet_data_hex'::text                     AS packet_data_hex,
       attributes(events.*) ->> 'packet_timeout_height'::text               AS packet_timeout_height,
       (attributes(events.*) ->> 'packet_timeout_timestamp'::text)::numeric AS packet_timeout_timestamp,
       (attributes(events.*) ->> 'packet_sequence'::text)::bigint           AS packet_sequence,
       attributes(events.*) ->> 'packet_src_port'::text                     AS packet_src_port,
       attributes(events.*) ->> 'packet_src_channel'::text                  AS packet_src_channel,
       attributes(events.*) ->> 'packet_dst_port'::text                     AS packet_dst_port,
       attributes(events.*) ->> 'packet_dst_channel'::text                  AS packet_dst_channel,
       attributes(events.*) ->> 'packet_channel_ordering'::text             AS packet_channel_ordering,
       attributes(events.*) ->> 'packet_connection'::text                   AS packet_connection,
       attributes(events.*) ->> 'connection_id'::text                       AS connection_id,
       (attributes(events.*) ->> 'msg_index'::text)::integer                AS msg_index,
       chain_id                                                             AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                               AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                                        AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'send_packet'::text;

alter table v1_cosmos.send_packet
    owner to "postgres";

create or replace view v1_cosmos.recv_packet
            (packet_data, packet_data_hex, packet_timeout_height, packet_timeout_timestamp, packet_sequence,
             packet_src_port, packet_src_channel, packet_dst_port, packet_dst_channel, packet_channel_ordering,
             packet_connection, connection_id, msg_index, internal_chain_id, block_hash, height, index, timestamp,
             transaction_hash, transaction_index, transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'packet_data'::text                         AS packet_data,
       attributes(events.*) ->> 'packet_data_hex'::text                     AS packet_data_hex,
       attributes(events.*) ->> 'packet_timeout_height'::text               AS packet_timeout_height,
       (attributes(events.*) ->> 'packet_timeout_timestamp'::text)::numeric AS packet_timeout_timestamp,
       (attributes(events.*) ->> 'packet_sequence'::text)::bigint           AS packet_sequence,
       attributes(events.*) ->> 'packet_src_port'::text                     AS packet_src_port,
       attributes(events.*) ->> 'packet_src_channel'::text                  AS packet_src_channel,
       attributes(events.*) ->> 'packet_dst_port'::text                     AS packet_dst_port,
       attributes(events.*) ->> 'packet_dst_channel'::text                  AS packet_dst_channel,
       attributes(events.*) ->> 'packet_channel_ordering'::text             AS packet_channel_ordering,
       attributes(events.*) ->> 'packet_connection'::text                   AS packet_connection,
       attributes(events.*) ->> 'connection_id'::text                       AS connection_id,
       (attributes(events.*) ->> 'msg_index'::text)::integer                AS msg_index,
       chain_id                                                             AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                               AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                                        AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'recv_packet'::text;

alter table v1_cosmos.recv_packet
    owner to "postgres";

create or replace view v1_cosmos.channel_open_ack
            (port_id, channel_id, counterparty_port_id, counterparty_channel_id, connection_id, msg_index,
             internal_chain_id, block_hash, height, index, timestamp, transaction_hash, transaction_index,
             transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'port_id'::text                 AS port_id,
       attributes(events.*) ->> 'channel_id'::text              AS channel_id,
       attributes(events.*) ->> 'counterparty_port_id'::text    AS counterparty_port_id,
       attributes(events.*) ->> 'counterparty_channel_id'::text AS counterparty_channel_id,
       attributes(events.*) ->> 'connection_id'::text           AS connection_id,
       (attributes(events.*) ->> 'msg_index'::text)::integer    AS msg_index,
       chain_id                                                 AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                   AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                            AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'channel_open_ack'::text;

alter table v1_cosmos.channel_open_ack
    owner to "postgres";

create or replace view v1_cosmos.channel_open_confirm
            (port_id, channel_id, counterparty_port_id, counterparty_channel_id, connection_id, msg_index,
             internal_chain_id, block_hash, height, index, timestamp, transaction_hash, transaction_index,
             transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'port_id'::text                 AS port_id,
       attributes(events.*) ->> 'channel_id'::text              AS channel_id,
       attributes(events.*) ->> 'counterparty_port_id'::text    AS counterparty_port_id,
       attributes(events.*) ->> 'counterparty_channel_id'::text AS counterparty_channel_id,
       attributes(events.*) ->> 'connection_id'::text           AS connection_id,
       (attributes(events.*) ->> 'msg_index'::text)::integer    AS msg_index,
       chain_id                                                 AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                   AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                            AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'channel_open_confirm'::text;

alter table v1_cosmos.channel_open_confirm
    owner to "postgres";

create or replace view v1_cosmos.channel_open_init
            (port_id, channel_id, counterparty_port_id, connection_id, version, msg_index, internal_chain_id,
             block_hash, height, index, timestamp, transaction_hash, transaction_index, transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'port_id'::text              AS port_id,
       attributes(events.*) ->> 'channel_id'::text           AS channel_id,
       attributes(events.*) ->> 'counterparty_port_id'::text AS counterparty_port_id,
       attributes(events.*) ->> 'connection_id'::text        AS connection_id,
       attributes(events.*) ->> 'version'::text              AS version,
       (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index,
       chain_id                                              AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                         AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'channel_open_init'::text;

alter table v1_cosmos.channel_open_init
    owner to "postgres";

create or replace view v1_cosmos.channel_open_try
            (port_id, channel_id, counterparty_port_id, counterparty_channel_id, connection_id, version, msg_index,
             internal_chain_id, block_hash, height, index, timestamp, transaction_hash, transaction_index,
             transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'port_id'::text                 AS port_id,
       attributes(events.*) ->> 'channel_id'::text              AS channel_id,
       attributes(events.*) ->> 'counterparty_port_id'::text    AS counterparty_port_id,
       attributes(events.*) ->> 'counterparty_channel_id'::text AS counterparty_channel_id,
       attributes(events.*) ->> 'connection_id'::text           AS connection_id,
       attributes(events.*) ->> 'version'::text                 AS version,
       (attributes(events.*) ->> 'msg_index'::text)::integer    AS msg_index,
       chain_id                                                 AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                   AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                            AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'channel_open_try'::text;

alter table v1_cosmos.channel_open_try
    owner to "postgres";

create or replace view v1_cosmos.connection_open_ack
            (connection_id, client_id, counterparty_client_id, counterparty_connection_id, msg_index, internal_chain_id,
             block_hash, height, index, timestamp, transaction_hash, transaction_index, transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'connection_id'::text              AS connection_id,
       attributes(events.*) ->> 'client_id'::text                  AS client_id,
       attributes(events.*) ->> 'counterparty_client_id'::text     AS counterparty_client_id,
       attributes(events.*) ->> 'counterparty_connection_id'::text AS counterparty_connection_id,
       (attributes(events.*) ->> 'msg_index'::text)::integer       AS msg_index,
       chain_id                                                    AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                      AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                               AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'connection_open_ack'::text;

alter table v1_cosmos.connection_open_ack
    owner to "postgres";

create or replace view v1_cosmos.connection_open_confirm
            (connection_id, client_id, counterparty_client_id, counterparty_connection_id, msg_index, internal_chain_id,
             block_hash, height, index, timestamp, transaction_hash, transaction_index, transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'connection_id'::text              AS connection_id,
       attributes(events.*) ->> 'client_id'::text                  AS client_id,
       attributes(events.*) ->> 'counterparty_client_id'::text     AS counterparty_client_id,
       attributes(events.*) ->> 'counterparty_connection_id'::text AS counterparty_connection_id,
       (attributes(events.*) ->> 'msg_index'::text)::integer       AS msg_index,
       chain_id                                                    AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                      AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                               AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'connection_open_confirm'::text;

alter table v1_cosmos.connection_open_confirm
    owner to "postgres";

create or replace view v1_cosmos.connection_open_init
            (connection_id, client_id, counterparty_client_id, msg_index, internal_chain_id, block_hash, height, index,
             timestamp, transaction_hash, transaction_index, transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'connection_id'::text          AS connection_id,
       attributes(events.*) ->> 'client_id'::text              AS client_id,
       attributes(events.*) ->> 'counterparty_client_id'::text AS counterparty_client_id,
       (attributes(events.*) ->> 'msg_index'::text)::integer   AS msg_index,
       chain_id                                                AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                  AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                           AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'connection_open_init'::text;

alter table v1_cosmos.connection_open_init
    owner to "postgres";

create or replace view v1_cosmos.connection_open_try
            (connection_id, client_id, counterparty_client_id, counterparty_connection_id, msg_index, internal_chain_id,
             block_hash, height, index, timestamp, transaction_hash, transaction_index, transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'connection_id'::text              AS connection_id,
       attributes(events.*) ->> 'client_id'::text                  AS client_id,
       attributes(events.*) ->> 'counterparty_client_id'::text     AS counterparty_client_id,
       attributes(events.*) ->> 'counterparty_connection_id'::text AS counterparty_connection_id,
       (attributes(events.*) ->> 'msg_index'::text)::integer       AS msg_index,
       chain_id                                                    AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                      AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                               AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'connection_open_try'::text;

alter table v1_cosmos.connection_open_try
    owner to "postgres";

create or replace view v1_cosmos.acknowledge_packet
            (packet_timeout_height, packet_timeout_timestamp, packet_sequence, packet_src_port, packet_src_channel,
             packet_dst_port, packet_dst_channel, packet_channel_ordering, packet_connection, connection_id, msg_index,
             internal_chain_id, block_hash, height, index, timestamp, transaction_hash, transaction_index,
             transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'packet_timeout_height'::text               AS packet_timeout_height,
       (attributes(events.*) ->> 'packet_timeout_timestamp'::text)::numeric AS packet_timeout_timestamp,
       (attributes(events.*) ->> 'packet_sequence'::text)::bigint           AS packet_sequence,
       attributes(events.*) ->> 'packet_src_port'::text                     AS packet_src_port,
       attributes(events.*) ->> 'packet_src_channel'::text                  AS packet_src_channel,
       attributes(events.*) ->> 'packet_dst_port'::text                     AS packet_dst_port,
       attributes(events.*) ->> 'packet_dst_channel'::text                  AS packet_dst_channel,
       attributes(events.*) ->> 'packet_channel_ordering'::text             AS packet_channel_ordering,
       attributes(events.*) ->> 'packet_connection'::text                   AS packet_connection,
       attributes(events.*) ->> 'connection_id'::text                       AS connection_id,
       (attributes(events.*) ->> 'msg_index'::text)::integer                AS msg_index,
       chain_id                                                             AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                               AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                                        AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'acknowledge_packet'::text;

alter table v1_cosmos.acknowledge_packet
    owner to "postgres";

create or replace view v1_cosmos.wasm_ibc_transfer
            (memo, sender, receiver, msg_index, _contract_address, json, assets, internal_chain_id, block_hash, height,
             index, timestamp, transaction_hash, transaction_index, transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'memo'::text                                                  AS memo,
       attributes(events.*) ->> 'sender'::text                                                AS sender,
       attributes(events.*) ->> 'receiver'::text                                              AS receiver,
       (attributes(events.*) ->> 'msg_index'::text)::integer                                  AS msg_index,
       attributes(events.*) ->> '_contract_address'::text                                     AS _contract_address,
       attributes(events.*)                                                                   AS json,
       (SELECT jsonb_object_agg(x.value ->> 'denom'::text, (x.value ->> 'amount'::text)::numeric) AS jsonb_object_agg
        FROM jsonb_array_elements((attributes(events.*) ->> 'assets'::text)::jsonb) x(value)) AS assets,
       chain_id                                                                               AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                                                 AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                                                          AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'wasm-ibc_transfer'::text
  AND (attributes(events.*) ->> 'assets'::text) IS NOT NULL;

alter table v1_cosmos.wasm_ibc_transfer
    owner to "postgres";

create or replace view v1_cosmos.ibc_transfer
            (memo, denom, amount, sender, receiver, msg_index, json, internal_chain_id, block_hash, height, index,
             timestamp, transaction_hash, transaction_index, transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'memo'::text                 AS memo,
       attributes(events.*) ->> 'denom'::text                AS denom,
       (attributes(events.*) ->> 'amount'::text)::numeric    AS amount,
       attributes(events.*) ->> 'sender'::text               AS sender,
       attributes(events.*) ->> 'receiver'::text             AS receiver,
       (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index,
       attributes(events.*)                                  AS json,
       chain_id                                              AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                         AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'ibc_transfer'::text;

alter table v1_cosmos.ibc_transfer
    owner to "postgres";

create or replace view v1_cosmos.fungible_token_packet
            (memo, denom, amount, module, sender, receiver, msg_index, acknowledgement, success, error, json,
             internal_chain_id, block_hash, height, index, timestamp, transaction_hash, transaction_index,
             transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'memo'::text                 AS memo,
       attributes(events.*) ->> 'denom'::text                AS denom,
       (attributes(events.*) ->> 'amount'::text)::numeric    AS amount,
       attributes(events.*) ->> 'module'::text               AS module,
       attributes(events.*) ->> 'sender'::text               AS sender,
       attributes(events.*) ->> 'receiver'::text             AS receiver,
       (attributes(events.*) ->> 'msg_index'::text)::integer AS msg_index,
       attributes(events.*) ->> 'acknowledgement'::text      AS acknowledgement,
       (attributes(events.*) ->> 'error'::text) IS NULL      AS success,
       attributes(events.*) ->> 'error'::text                AS error,
       attributes(events.*)                                  AS json,
       chain_id                                              AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                         AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'fungible_token_packet'::text;

alter table v1_cosmos.fungible_token_packet
    owner to "postgres";

create or replace view v1_cosmos.wasm_fungible_token_packet
            (_contract_address, module, sender, receiver, acknowledgement, msg_index, success, error, assets,
             internal_chain_id, block_hash, height, index, timestamp, transaction_hash, transaction_index,
             transaction_event_index, data)
as
SELECT attributes(events.*) ->> '_contract_address'::text                                     AS _contract_address,
       attributes(events.*) ->> 'module'::text                                                AS module,
       attributes(events.*) ->> 'sender'::text                                                AS sender,
       attributes(events.*) ->> 'receiver'::text                                              AS receiver,
       attributes(events.*) ->> 'acknowledgement'::text                                       AS acknowledgement,
       (attributes(events.*) ->> 'msg_index'::text)::integer                                  AS msg_index,
       (attributes(events.*) ->> 'error'::text) IS NULL                                       AS success,
       attributes(events.*) ->> 'error'::text                                                 AS error,
       (SELECT jsonb_object_agg(x.value ->> 'denom'::text, (x.value ->> 'amount'::text)::numeric) AS jsonb_object_agg
        FROM jsonb_array_elements((attributes(events.*) ->> 'assets'::text)::jsonb) x(value)) AS assets,
       chain_id                                                                               AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                                                 AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                                                          AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'wasm-fungible_token_packet'::text;

alter table v1_cosmos.wasm_fungible_token_packet
    owner to "postgres";

create or replace view v1_cosmos.internal_incoming_ibc_transfers
            (internal_chain_id, block_hash, transaction_hash, _contract_address, module, sender, receiver,
             acknowledgement, assets, msg_index, success, error, height, transaction_index, transaction_event_index,
             index, data, timestamp, packet_data, packet_data_hex, packet_timeout_height, packet_timeout_timestamp,
             packet_sequence, packet_src_port, packet_src_channel, packet_dst_port, packet_dst_channel,
             packet_channel_ordering, packet_connection, connection_id)
as
SELECT wf.internal_chain_id,
       wf.block_hash,
       wf.transaction_hash,
       wf._contract_address,
       wf.module,
       wf.sender,
       wf.receiver,
       wf.acknowledgement,
       wf.assets,
       wf.msg_index,
       wf.success,
       wf.error,
       wf.height,
       wf.transaction_index,
       wf.transaction_event_index,
       wf.index,
       wf.data,
       wf."timestamp",
       rp.packet_data,
       rp.packet_data_hex,
       rp.packet_timeout_height,
       rp.packet_timeout_timestamp,
       rp.packet_sequence,
       rp.packet_src_port,
       rp.packet_src_channel,
       rp.packet_dst_port,
       rp.packet_dst_channel,
       rp.packet_channel_ordering,
       rp.packet_connection,
       rp.connection_id
FROM (SELECT wf_1.internal_chain_id,
             wf_1.block_hash,
             wf_1.transaction_hash,
             wf_1._contract_address,
             wf_1.module,
             wf_1.sender,
             wf_1.receiver,
             wf_1.acknowledgement,
             wf_1.assets,
             wf_1.msg_index,
             wf_1.success,
             wf_1.error,
             wf_1.height,
             wf_1.transaction_index,
             wf_1.transaction_event_index,
             wf_1.index,
             wf_1.data,
             wf_1."timestamp"
      FROM v1_cosmos.wasm_fungible_token_packet wf_1
      
      UNION ALL
      SELECT f.internal_chain_id,
             f.block_hash,
             f.transaction_hash,
             ''::text AS _contract_address,
             f.module,
             f.sender,
             f.receiver,
             f.acknowledgement,
             CASE
                 WHEN f.denom IS NULL THEN NULL::jsonb
                 ELSE jsonb_build_array(jsonb_build_object(f.denom, f.amount::text))
                 END  AS assets,
             f.msg_index,
             f.success,
             f.error,
             f.height,
             f.transaction_index,
             f.transaction_event_index,
             f.index,
             f.data,
             f."timestamp"
      FROM v1_cosmos.fungible_token_packet f
      WHERE f.module IS NOT NULL) wf
         LEFT JOIN v1_cosmos.recv_packet rp
                   ON rp.transaction_hash = wf.transaction_hash AND rp.msg_index = wf.msg_index;

alter table v1_cosmos.internal_incoming_ibc_transfers
    owner to "postgres";

create or replace view v1_cosmos.internal_outgoing_ibc_transfers
            (memo, sender, receiver, msg_index, _contract_address, json, internal_chain_id, block_hash, height,
             transaction_hash, transaction_index, transaction_event_index, index, data, timestamp, packet_data,
             packet_data_hex, packet_timeout_height, packet_timeout_timestamp, packet_sequence, packet_src_port,
             packet_src_channel, packet_dst_port, packet_dst_channel, packet_channel_ordering, packet_connection,
             connection_id, assets, packet_index)
as
SELECT memo,
       sender,
       receiver,
       msg_index,
       _contract_address,
       json,
       internal_chain_id,
       block_hash,
       height,
       transaction_hash,
       transaction_index,
       transaction_event_index,
       index,
       data,
       "timestamp",
       packet_data,
       packet_data_hex,
       packet_timeout_height,
       packet_timeout_timestamp,
       packet_sequence,
       packet_src_port,
       packet_src_channel,
       packet_dst_port,
       packet_dst_channel,
       packet_channel_ordering,
       packet_connection,
       connection_id,
       assets,
       index AS packet_index
FROM (SELECT wasm_ibc_transfer.memo,
             wasm_ibc_transfer.sender,
             wasm_ibc_transfer.receiver,
             wasm_ibc_transfer.msg_index,
             ''::text AS _contract_address,
             wasm_ibc_transfer.assets,
             wasm_ibc_transfer.json,
             wasm_ibc_transfer.internal_chain_id,
             wasm_ibc_transfer.block_hash,
             wasm_ibc_transfer.height,
             wasm_ibc_transfer.transaction_hash,
             wasm_ibc_transfer.transaction_index,
             wasm_ibc_transfer.transaction_event_index,
             wasm_ibc_transfer.index,
             wasm_ibc_transfer.data,
             wasm_ibc_transfer."timestamp",
             sp.packet_data,
             sp.packet_data_hex,
             sp.packet_timeout_height,
             sp.packet_timeout_timestamp,
             sp.packet_sequence,
             sp.packet_src_port,
             sp.packet_src_channel,
             sp.packet_dst_port,
             sp.packet_dst_channel,
             sp.packet_channel_ordering,
             sp.packet_connection,
             sp.connection_id,
             sp.index AS packet_index
      FROM v1_cosmos.wasm_ibc_transfer
               JOIN (SELECT sp_1.internal_chain_id,
                            sp_1.transaction_hash,
                            sp_1.packet_data,
                            sp_1.packet_data_hex,
                            sp_1.packet_timeout_height,
                            sp_1.packet_timeout_timestamp,
                            sp_1.packet_sequence,
                            sp_1.packet_src_port,
                            sp_1.packet_src_channel,
                            sp_1.packet_dst_port,
                            sp_1.packet_dst_channel,
                            sp_1.packet_channel_ordering,
                            sp_1.packet_connection,
                            sp_1.connection_id,
                            sp_1.msg_index,
                            sp_1.block_hash,
                            sp_1.height,
                            sp_1.transaction_index,
                            sp_1.transaction_event_index,
                            sp_1.index,
                            sp_1.data,
                            sp_1."timestamp"
                     FROM v1_cosmos.send_packet sp_1) sp ON sp.transaction_hash = wasm_ibc_transfer.transaction_hash AND
                                                            sp.msg_index = wasm_ibc_transfer.msg_index
      UNION ALL
      SELECT ibc_transfer.memo,
             ibc_transfer.sender,
             ibc_transfer.receiver,
             ibc_transfer.msg_index,
             ''::text                                                          AS _contract_address,
             jsonb_build_object(ibc_transfer.denom, ibc_transfer.amount::text) AS assets,
             ibc_transfer.json,
             ibc_transfer.internal_chain_id,
             ibc_transfer.block_hash,
             ibc_transfer.height,
             ibc_transfer.transaction_hash,
             ibc_transfer.transaction_index,
             ibc_transfer.transaction_event_index,
             ibc_transfer.index,
             ibc_transfer.data,
             ibc_transfer."timestamp",
             sp.packet_data,
             sp.packet_data_hex,
             sp.packet_timeout_height,
             sp.packet_timeout_timestamp,
             sp.packet_sequence,
             sp.packet_src_port,
             sp.packet_src_channel,
             sp.packet_dst_port,
             sp.packet_dst_channel,
             sp.packet_channel_ordering,
             sp.packet_connection,
             sp.connection_id,
             sp.index                                                          AS packet_index
      FROM v1_cosmos.ibc_transfer
               JOIN (SELECT sp_1.internal_chain_id,
                            sp_1.transaction_hash,
                            sp_1.packet_data,
                            sp_1.packet_data_hex,
                            sp_1.packet_timeout_height,
                            sp_1.packet_timeout_timestamp,
                            sp_1.packet_sequence,
                            sp_1.packet_src_port,
                            sp_1.packet_src_channel,
                            sp_1.packet_dst_port,
                            sp_1.packet_dst_channel,
                            sp_1.packet_channel_ordering,
                            sp_1.packet_connection,
                            sp_1.connection_id,
                            sp_1.msg_index,
                            sp_1.block_hash,
                            sp_1.height,
                            sp_1.transaction_index,
                            sp_1.transaction_event_index,
                            sp_1.index,
                            sp_1.data,
                            sp_1."timestamp"
                     FROM v1_cosmos.send_packet sp_1) sp ON sp.transaction_hash = ibc_transfer.transaction_hash AND
                                                            (sp.msg_index = ibc_transfer.msg_index OR
                                                             sp.msg_index IS NULL AND
                                                             ibc_transfer.msg_index IS NULL) AND
                                                            (sp.index + 2) = ibc_transfer.index
      WHERE ibc_transfer.denom IS NOT NULL) it;

alter table v1_cosmos.internal_outgoing_ibc_transfers
    owner to "postgres";

create or replace view v1_cosmos.update_client
            (client_id, client_type, consensus_height, consensus_heights, header, msg_index, revision_height,
             internal_chain_id, block_hash, height, index, timestamp, transaction_hash, transaction_index,
             transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'client_id'::text                                           AS client_id,
       attributes(events.*) ->> 'client_type'::text                                         AS client_type,
       attributes(events.*) ->> 'consensus_height'::text                                    AS consensus_height,
       attributes(events.*) ->> 'consensus_heights'::text                                   AS consensus_heights,
       attributes(events.*) ->> 'header'::text                                              AS header,
       (attributes(events.*) ->> 'msg_index'::text)::integer                                AS msg_index,
       split_part(attributes(events.*) ->> 'consensus_heights'::text, '-'::text, 2)::bigint AS revision_height,
       chain_id                                                                             AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                                               AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                                                        AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'update_client'::text;

alter table v1_cosmos.update_client
    owner to "postgres";

create or replace view v1_cosmos.wasm_packet_forward_hop
            (src_port, dest_port, src_channel, dest_channel, recv_sequence, sent_sequence, _contract_address, msg_index,
             internal_chain_id, block_hash, height, index, timestamp, transaction_hash, transaction_index,
             transaction_event_index, data)
as
SELECT attributes(events.*) ->> 'src_port'::text                AS src_port,
       attributes(events.*) ->> 'dest_port'::text               AS dest_port,
       attributes(events.*) ->> 'src_channel'::text             AS src_channel,
       attributes(events.*) ->> 'dest_channel'::text            AS dest_channel,
       (attributes(events.*) ->> 'recv_sequence'::text)::bigint AS recv_sequence,
       (attributes(events.*) ->> 'sent_sequence'::text)::bigint AS sent_sequence,
       attributes(events.*) ->> '_contract_address'::text       AS _contract_address,
       (attributes(events.*) ->> 'msg_index'::text)::integer    AS msg_index,
       chain_id                                                 AS internal_chain_id,
       block_hash,
       height,
       index,
       "time"                                                   AS "timestamp",
       transaction_hash,
       transaction_index,
       NULL::integer                                            AS transaction_event_index,
       data
FROM v1_cosmos.events
WHERE (data ->> 'type'::text) = 'wasm-packet_forward_hop'::text;

alter table v1_cosmos.wasm_packet_forward_hop
    owner to "postgres";

create or replace view v1_evm.recv_packet
            (name, packet, data, sequence, source_port, source_channel, timeout_revision_height,
             timeout_revision_number, destination_port, timeout_timestamp, destination_channel, internal_chain_id,
             block_hash, height, log_index, timestamp, transaction_hash, transaction_index, transaction_log_index,
             raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                                               AS name,
       (log_to_jsonb -> 'data'::text) -> 'packet'::text                                            AS packet,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'data'::text                         AS data,
       (((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'sequence'::text)::bigint           AS sequence,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'source_port'::text                  AS source_port,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'source_channel'::text               AS source_channel,
       ((((log_to_jsonb -> 'data'::text) -> 'packet'::text) -> 'timeout_height'::text) ->>
        'revision_height'::text)::bigint                                                           AS timeout_revision_height,
       ((((log_to_jsonb -> 'data'::text) -> 'packet'::text) -> 'timeout_height'::text) ->>
        'revision_number'::text)::integer                                                          AS timeout_revision_number,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'destination_port'::text             AS destination_port,
       (((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'timeout_timestamp'::text)::numeric AS timeout_timestamp,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->>
       'destination_channel'::text                                                                 AS destination_channel,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'RecvPacket'::text;

alter table v1_evm.recv_packet
    owner to "postgres";

create or replace view v1_evm.send_packet
            (name, data, sequence, source_port, source_channel, timeout_revision_height, timeout_revision_number,
             timeout_timestamp, internal_chain_id, block_hash, height, log_index, timestamp, transaction_hash,
             transaction_index, transaction_log_index, raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                                                    AS name,
       (log_to_jsonb -> 'data'::text) ->> 'data'::text                                                  AS data,
       ((log_to_jsonb -> 'data'::text) ->> 'sequence'::text)::bigint                                    AS sequence,
       (log_to_jsonb -> 'data'::text) ->> 'sourcePort'::text                                            AS source_port,
       (log_to_jsonb -> 'data'::text) ->> 'sourceChannel'::text                                         AS source_channel,
       (((log_to_jsonb -> 'data'::text) -> 'timeoutHeight'::text) ->>
        'revision_height'::text)::bigint                                                                AS timeout_revision_height,
       (((log_to_jsonb -> 'data'::text) -> 'timeoutHeight'::text) ->>
        'revision_number'::text)::integer                                                               AS timeout_revision_number,
       ((log_to_jsonb -> 'data'::text) ->> 'timeoutTimestamp'::text)::numeric                           AS timeout_timestamp,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'SendPacket'::text;

alter table v1_evm.send_packet
    owner to "postgres";

create or replace view v1_evm.write_acknowledgement
            (name, sequence, destination_port, destination_channel, acknowledgement, source_port, source_channel,
             timeout_timestamp, timeout_revision_height, timeout_revision_number, internal_chain_id, block_hash, height,
             log_index, timestamp, transaction_hash, transaction_index, transaction_log_index, raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                                               AS name,
       (((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'sequence'::text)::bigint           AS sequence,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'destination_port'::text             AS destination_port,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->>
       'destination_channel'::text                                                                 AS destination_channel,
       (log_to_jsonb -> 'data'::text) ->> 'acknowledgement'::text                                  AS acknowledgement,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'source_port'::text                  AS source_port,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'source_channel'::text               AS source_channel,
       (((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'timeout_timestamp'::text)::numeric AS timeout_timestamp,
       ((((log_to_jsonb -> 'data'::text) -> 'packet'::text) -> 'timeout_height'::text) ->>
        'revision_height'::text)::bigint                                                           AS timeout_revision_height,
       ((((log_to_jsonb -> 'data'::text) -> 'packet'::text) -> 'timeout_height'::text) ->>
        'revision_number'::text)::integer                                                          AS timeout_revision_number,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'WriteAcknowledgement'::text;

alter table v1_evm.write_acknowledgement
    owner to "postgres";

create or replace view v1_evm.channel_open_ack
            (name, port_id, channel_id, connection_id, counterparty_port_id, counterparty_channel_id, internal_chain_id,
             block_hash, height, log_index, timestamp, transaction_hash, transaction_index, transaction_log_index,
             raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                    AS name,
       (log_to_jsonb -> 'data'::text) ->> 'portId'::text                AS port_id,
       (log_to_jsonb -> 'data'::text) ->> 'channelId'::text             AS channel_id,
       (log_to_jsonb -> 'data'::text) ->> 'connectionId'::text          AS connection_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyPortId'::text    AS counterparty_port_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyChannelId'::text AS counterparty_channel_id,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ChannelOpenAck'::text;

alter table v1_evm.channel_open_ack
    owner to "postgres";

create or replace view v1_evm.channel_open_confirm
            (name, port_id, channel_id, connection_id, counterparty_port_id, counterparty_channel_id, internal_chain_id,
             block_hash, height, log_index, timestamp, transaction_hash, transaction_index, transaction_log_index,
             raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                    AS name,
       (log_to_jsonb -> 'data'::text) ->> 'portId'::text                AS port_id,
       (log_to_jsonb -> 'data'::text) ->> 'channelId'::text             AS channel_id,
       (log_to_jsonb -> 'data'::text) ->> 'connectionId'::text          AS connection_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyPortId'::text    AS counterparty_port_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyChannelId'::text AS counterparty_channel_id,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ChannelOpenConfirm'::text;

alter table v1_evm.channel_open_confirm
    owner to "postgres";

create or replace view v1_evm.channel_open_init
            (name, port_id, channel_id, connection_id, counterparty_port_id, version, internal_chain_id, block_hash,
             height, log_index, timestamp, transaction_hash, transaction_index, transaction_log_index, raw_log,
             log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                 AS name,
       (log_to_jsonb -> 'data'::text) ->> 'portId'::text             AS port_id,
       (log_to_jsonb -> 'data'::text) ->> 'channelId'::text          AS channel_id,
       (log_to_jsonb -> 'data'::text) ->> 'connectionId'::text       AS connection_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyPortId'::text AS counterparty_port_id,
       (log_to_jsonb -> 'data'::text) ->> 'version'::text            AS version,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ChannelOpenInit'::text;

alter table v1_evm.channel_open_init
    owner to "postgres";

create or replace view v1_evm.client_registered
            (name, client_address, client_type, internal_chain_id, block_hash, height, log_index, timestamp,
             transaction_hash, transaction_index, transaction_log_index, raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                           AS name,
       (log_to_jsonb -> 'data'::text) -> 'clientAddress'::text AS client_address,
       (log_to_jsonb -> 'data'::text) -> 'clientType'::text    AS client_type,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ClientRegistered'::text;

alter table v1_evm.client_registered
    owner to "postgres";

create or replace view v1_evm.channel_open_try
            (name, port_id, version, channel_id, connection_id, counterparty_port_id, counterparty_channel_id,
             internal_chain_id, block_hash, height, log_index, timestamp, transaction_hash, transaction_index,
             transaction_log_index, raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                    AS name,
       (log_to_jsonb -> 'data'::text) ->> 'portId'::text                AS port_id,
       (log_to_jsonb -> 'data'::text) ->> 'version'::text               AS version,
       (log_to_jsonb -> 'data'::text) ->> 'channelId'::text             AS channel_id,
       (log_to_jsonb -> 'data'::text) ->> 'connectionId'::text          AS connection_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyPortId'::text    AS counterparty_port_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyChannelId'::text AS counterparty_channel_id,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ChannelOpenTry'::text;

alter table v1_evm.channel_open_try
    owner to "postgres";

create or replace view v1_evm.client_updated
            (name, revision_height, revision_number, client_id, internal_chain_id, block_hash, height, log_index,
             timestamp, transaction_hash, transaction_index, transaction_log_index, raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                                             AS name,
       (((log_to_jsonb -> 'data'::text) -> 'height'::text) ->> 'revision_height'::text)::bigint  AS revision_height,
       (((log_to_jsonb -> 'data'::text) -> 'height'::text) ->> 'revision_number'::text)::integer AS revision_number,
       (log_to_jsonb -> 'data'::text) ->> 'clientId'::text                                       AS client_id,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ClientUpdated'::text;

alter table v1_evm.client_updated
    owner to "postgres";

create or replace view v1_evm.connection_open_ack
            (name, connection_id, client_id, counterparty_connection_id, counterparty_client_id, internal_chain_id,
             block_hash, height, log_index, timestamp, transaction_hash, transaction_index, transaction_log_index,
             raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                       AS name,
       (log_to_jsonb -> 'data'::text) ->> 'connectionId'::text             AS connection_id,
       (log_to_jsonb -> 'data'::text) ->> 'clientId'::text                 AS client_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyConnectionId'::text AS counterparty_connection_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyClientId'::text     AS counterparty_client_id,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ConnectionOpenAck'::text;

alter table v1_evm.connection_open_ack
    owner to "postgres";

create or replace view v1_evm.connection_open_confirm
            (name, connection_id, client_id, counterparty_connection_id, counterparty_client_id, internal_chain_id,
             block_hash, height, log_index, timestamp, transaction_hash, transaction_index, transaction_log_index,
             raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                       AS name,
       (log_to_jsonb -> 'data'::text) ->> 'connectionId'::text             AS connection_id,
       (log_to_jsonb -> 'data'::text) ->> 'clientId'::text                 AS client_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyConnectionId'::text AS counterparty_connection_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyClientId'::text     AS counterparty_client_id,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ConnectionOpenConfirm'::text;

alter table v1_evm.connection_open_confirm
    owner to "postgres";

create or replace view v1_evm.connection_open_init
            (name, connection_id, client_id, counterparty_client_id, internal_chain_id, block_hash, height, log_index,
             timestamp, transaction_hash, transaction_index, transaction_log_index, raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                   AS name,
       (log_to_jsonb -> 'data'::text) ->> 'connectionId'::text         AS connection_id,
       (log_to_jsonb -> 'data'::text) ->> 'clientId'::text             AS client_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyClientId'::text AS counterparty_client_id,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ConnectionOpenInit'::text;

alter table v1_evm.connection_open_init
    owner to "postgres";

create or replace view v1_evm.connection_open_try
            (name, connection_id, client_id, counterparty_client_id, counterparty_connection_id, internal_chain_id,
             block_hash, height, log_index, timestamp, transaction_hash, transaction_index, transaction_log_index,
             raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                       AS name,
       (log_to_jsonb -> 'data'::text) ->> 'connectionId'::text             AS connection_id,
       (log_to_jsonb -> 'data'::text) ->> 'clientId'::text                 AS client_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyClientId'::text     AS counterparty_client_id,
       (log_to_jsonb -> 'data'::text) ->> 'counterpartyConnectionId'::text AS counterparty_connection_id,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'ConnectionOpenTry'::text;

alter table v1_evm.connection_open_try
    owner to "postgres";

create or replace view v1_evm.ucs1_denom_created
            (name, denom, token, channel_id, packet_sequence, internal_chain_id, block_hash, height, log_index,
             timestamp, transaction_hash, transaction_index, transaction_log_index, raw_log, log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                       AS name,
       (log_to_jsonb -> 'data'::text) ->> 'denom'::text                    AS denom,
       (log_to_jsonb -> 'data'::text) ->> 'token'::text                    AS token,
       (log_to_jsonb -> 'data'::text) ->> 'channelId'::text                AS channel_id,
       ((log_to_jsonb -> 'data'::text) ->> 'packetSequence'::text)::bigint AS packet_sequence,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'DenomCreated'::text;

alter table v1_evm.ucs1_denom_created
    owner to "postgres";

create or replace view v1_evm.ucs1_received
            (name, denom, token, amount, sender, receiver, channel_id, packet_sequence, internal_chain_id, block_hash,
             height, log_index, timestamp, transaction_hash, transaction_index, transaction_log_index, raw_log,
             log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                       AS name,
       (log_to_jsonb -> 'data'::text) ->> 'denom'::text                    AS denom,
       (log_to_jsonb -> 'data'::text) ->> 'token'::text                    AS token,
       ((log_to_jsonb -> 'data'::text) ->> 'amount'::text)::numeric        AS amount,
       (log_to_jsonb -> 'data'::text) ->> 'sender'::text                   AS sender,
       (log_to_jsonb -> 'data'::text) ->> 'receiver'::text                 AS receiver,
       (log_to_jsonb -> 'data'::text) ->> 'channelId'::text                AS channel_id,
       ((log_to_jsonb -> 'data'::text) ->> 'packetSequence'::text)::bigint AS packet_sequence,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'Received'::text;

alter table v1_evm.ucs1_received
    owner to "postgres";

create or replace view v1_evm.ucs1_sent
            (name, denom, token, amount, sender, receiver, channel_id, packet_sequence, internal_chain_id, block_hash,
             height, log_index, timestamp, transaction_hash, transaction_index, transaction_log_index, raw_log,
             log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                       AS name,
       (log_to_jsonb -> 'data'::text) ->> 'denom'::text                    AS denom,
       (log_to_jsonb -> 'data'::text) ->> 'token'::text                    AS token,
       ((log_to_jsonb -> 'data'::text) ->> 'amount'::text)::numeric        AS amount,
       (log_to_jsonb -> 'data'::text) ->> 'sender'::text                   AS sender,
       (log_to_jsonb -> 'data'::text) ->> 'receiver'::text                 AS receiver,
       (log_to_jsonb -> 'data'::text) ->> 'channelId'::text                AS channel_id,
       ((log_to_jsonb -> 'data'::text) ->> 'packetSequence'::text)::bigint AS packet_sequence,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'Sent'::text;

alter table v1_evm.ucs1_sent
    owner to "postgres";

create or replace view v1_evm.acknowledge_packet
            (name, packet, sequence, source_port, source_channel, timeout_revision_height, timeout_revision_number,
             destination_port, timeout_timestamp, destination_channel, acknowledgement, internal_chain_id, block_hash,
             height, log_index, timestamp, transaction_hash, transaction_index, transaction_log_index, raw_log,
             log_to_jsonb)
as
SELECT log_to_jsonb ->> 'name'::text                                                               AS name,
       (log_to_jsonb -> 'data'::text) -> 'packet'::text                                            AS packet,
       (((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'sequence'::text)::bigint           AS sequence,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'source_port'::text                  AS source_port,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'source_channel'::text               AS source_channel,
       ((((log_to_jsonb -> 'data'::text) -> 'packet'::text) -> 'timeout_height'::text) ->>
        'revision_height'::text)::bigint                                                           AS timeout_revision_height,
       ((((log_to_jsonb -> 'data'::text) -> 'packet'::text) -> 'timeout_height'::text) ->>
        'revision_number'::text)::integer                                                          AS timeout_revision_number,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'destination_port'::text             AS destination_port,
       (((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->> 'timeout_timestamp'::text)::numeric AS timeout_timestamp,
       ((log_to_jsonb -> 'data'::text) -> 'packet'::text) ->>
       'destination_channel'::text                                                                 AS destination_channel,
       (log_to_jsonb -> 'data'::text) ->> 'acknowledgement'::text                                  AS acknowledgement,
       internal_chain_id,
       block_hash,
       height,
       log_index,
       "timestamp",
       transaction_hash,
       transaction_index,
       transaction_log_index,
       raw_log,
       log_to_jsonb
FROM v1_evm.logs_sync evm
WHERE (log_to_jsonb ->> 'name'::text) = 'AcknowledgePacket'::text;

alter table v1_evm.acknowledge_packet
    owner to "postgres";

create or replace view v1_aptos.channel_open_init
            (port_id, version, channel_id, connection_id, counterparty_port_id, internal_chain_id, block_hash, height,
             transaction_version, transaction_hash, transaction_index, transaction_event_index, sequence_number,
             creation_number, index, account_address, type, data)
as
SELECT event.data ->> 'port_id'::text              AS port_id,
       event.data ->> 'version'::text              AS version,
       event.data ->> 'channel_id'::text           AS channel_id,
       event.data ->> 'connection_id'::text        AS connection_id,
       event.data ->> 'counterparty_port_id'::text AS counterparty_port_id,
       event.internal_chain_id,
       block.block_hash,
       event.height,
       event.version                               AS transaction_version,
       transaction.transaction_hash,
       transaction.transaction_index,
       event.transaction_event_index,
       event.sequence_number,
       event.creation_number,
       event.index,
       event.account_address,
       event.type,
       event.data
FROM v1_aptos.events event
         JOIN v1_aptos.transactions transaction
              ON event.internal_chain_id = transaction.internal_chain_id AND event.version = transaction.version
         JOIN v1_aptos.blocks block ON transaction.internal_chain_id = block.internal_chain_id AND
                                       transaction.version >= block.first_version AND
                                       transaction.version <= block.last_version
WHERE SUBSTRING(event.type FROM POSITION(('::'::text) IN (event.type)) + 2) = 'ibc::ChannelOpenInit'::text;

alter table v1_aptos.channel_open_init
    owner to "postgres";

create or replace view v1_aptos.channel_open_ack
            (port_id, channel_id, connection_id, counterparty_port_id, counterparty_channel_id, internal_chain_id,
             block_hash, height, transaction_version, transaction_hash, transaction_index, transaction_event_index,
             sequence_number, creation_number, index, account_address, type, data)
as
SELECT event.data ->> 'port_id'::text                 AS port_id,
       event.data ->> 'channel_id'::text              AS channel_id,
       event.data ->> 'connection_id'::text           AS connection_id,
       event.data ->> 'counterparty_port_id'::text    AS counterparty_port_id,
       event.data ->> 'counterparty_channel_id'::text AS counterparty_channel_id,
       event.internal_chain_id,
       block.block_hash,
       event.height,
       event.version                                  AS transaction_version,
       transaction.transaction_hash,
       transaction.transaction_index,
       event.transaction_event_index,
       event.sequence_number,
       event.creation_number,
       event.index,
       event.account_address,
       event.type,
       event.data
FROM v1_aptos.events event
         JOIN v1_aptos.transactions transaction
              ON event.internal_chain_id = transaction.internal_chain_id AND event.version = transaction.version
         JOIN v1_aptos.blocks block ON transaction.internal_chain_id = block.internal_chain_id AND
                                       transaction.version >= block.first_version AND
                                       transaction.version <= block.last_version
WHERE SUBSTRING(event.type FROM POSITION(('::'::text) IN (event.type)) + 2) = 'ibc::ChannelOpenAck'::text;

alter table v1_aptos.channel_open_ack
    owner to "postgres";

create or replace view v1_aptos.client_updated
            (client_id, client_type, consensus_revision_height, consensus_revision_number, internal_chain_id,
             block_hash, height, transaction_version, transaction_hash, transaction_index, transaction_event_index,
             sequence_number, creation_number, index, account_address, type, data)
as
SELECT event.data ->> 'client_id'::text                                               AS client_id,
       event.data ->> 'client_type'::text                                             AS client_type,
       ((event.data -> 'consensus_height'::text) ->> 'revision_height'::text)::bigint AS consensus_revision_height,
       ((event.data -> 'consensus_height'::text) ->> 'revision_number'::text)::bigint AS consensus_revision_number,
       event.internal_chain_id,
       block.block_hash,
       event.height,
       event.version                                                                  AS transaction_version,
       transaction.transaction_hash,
       transaction.transaction_index,
       event.transaction_event_index,
       event.sequence_number,
       event.creation_number,
       event.index,
       event.account_address,
       event.type,
       event.data
FROM v1_aptos.events event
         JOIN v1_aptos.transactions transaction
              ON event.internal_chain_id = transaction.internal_chain_id AND event.version = transaction.version
         JOIN v1_aptos.blocks block ON transaction.internal_chain_id = block.internal_chain_id AND
                                       transaction.version >= block.first_version AND
                                       transaction.version <= block.last_version
WHERE SUBSTRING(event.type FROM POSITION(('::'::text) IN (event.type)) + 2) = 'ibc::ClientUpdated'::text;

alter table v1_aptos.client_updated
    owner to "postgres";

create or replace view v1_aptos.connection_open_ack
            (client_id, connection_id, counterparty_client_id, counterparty_connection_id, internal_chain_id,
             block_hash, height, transaction_version, transaction_hash, transaction_index, transaction_event_index,
             sequence_number, creation_number, index, account_address, type, data)
as
SELECT event.data ->> 'client_id'::text                  AS client_id,
       event.data ->> 'connection_id'::text              AS connection_id,
       event.data ->> 'counterparty_client_id'::text     AS counterparty_client_id,
       event.data ->> 'counterparty_connection_id'::text AS counterparty_connection_id,
       event.internal_chain_id,
       block.block_hash,
       event.height,
       event.version                                     AS transaction_version,
       transaction.transaction_hash,
       transaction.transaction_index,
       event.transaction_event_index,
       event.sequence_number,
       event.creation_number,
       event.index,
       event.account_address,
       event.type,
       event.data
FROM v1_aptos.events event
         JOIN v1_aptos.transactions transaction
              ON event.internal_chain_id = transaction.internal_chain_id AND event.version = transaction.version
         JOIN v1_aptos.blocks block ON transaction.internal_chain_id = block.internal_chain_id AND
                                       transaction.version >= block.first_version AND
                                       transaction.version <= block.last_version
WHERE SUBSTRING(event.type FROM POSITION(('::'::text) IN (event.type)) + 2) = 'ibc::ConnectionOpenAck'::text;

alter table v1_aptos.connection_open_ack
    owner to "postgres";

create or replace view v1_aptos.connection_open_init
            (client_id, connection_id, counterparty_client_id, internal_chain_id, block_hash, height,
             transaction_version, transaction_hash, transaction_index, transaction_event_index, sequence_number,
             creation_number, index, account_address, type, data)
as
SELECT event.data ->> 'client_id'::text              AS client_id,
       event.data ->> 'connection_id'::text          AS connection_id,
       event.data ->> 'counterparty_client_id'::text AS counterparty_client_id,
       event.internal_chain_id,
       block.block_hash,
       event.height,
       event.version                                 AS transaction_version,
       transaction.transaction_hash,
       transaction.transaction_index,
       event.transaction_event_index,
       event.sequence_number,
       event.creation_number,
       event.index,
       event.account_address,
       event.type,
       event.data
FROM v1_aptos.events event
         JOIN v1_aptos.transactions transaction
              ON event.internal_chain_id = transaction.internal_chain_id AND event.version = transaction.version
         JOIN v1_aptos.blocks block ON transaction.internal_chain_id = block.internal_chain_id AND
                                       transaction.version >= block.first_version AND
                                       transaction.version <= block.last_version
WHERE SUBSTRING(event.type FROM POSITION(('::'::text) IN (event.type)) + 2) = 'ibc::ConnectionOpenInit'::text;

alter table v1_aptos.connection_open_init
    owner to "postgres";

create or replace view v1_aptos.client_created_event
            (client_id, client_type, consensus_revision_height, consensus_revision_number, internal_chain_id,
             block_hash, height, transaction_version, transaction_hash, transaction_index, transaction_event_index,
             sequence_number, creation_number, index, account_address, type, data)
as
SELECT event.data ->> 'client_id'::text                                               AS client_id,
       event.data ->> 'client_type'::text                                             AS client_type,
       ((event.data -> 'consensus_height'::text) ->> 'revision_height'::text)::bigint AS consensus_revision_height,
       ((event.data -> 'consensus_height'::text) ->> 'revision_number'::text)::bigint AS consensus_revision_number,
       event.internal_chain_id,
       block.block_hash,
       event.height,
       event.version                                                                  AS transaction_version,
       transaction.transaction_hash,
       transaction.transaction_index,
       event.transaction_event_index,
       event.sequence_number,
       event.creation_number,
       event.index,
       event.account_address,
       event.type,
       event.data
FROM v1_aptos.events event
         JOIN v1_aptos.transactions transaction
              ON event.internal_chain_id = transaction.internal_chain_id AND event.version = transaction.version
         JOIN v1_aptos.blocks block ON transaction.internal_chain_id = block.internal_chain_id AND
                                       transaction.version >= block.first_version AND
                                       transaction.version <= block.last_version
WHERE SUBSTRING(event.type FROM POSITION(('::'::text) IN (event.type)) + 2) = 'ibc::ClientCreatedEvent'::text;

alter table v1_aptos.client_created_event
    owner to "postgres";

create or replace function hubble.update_updated_at_column() returns trigger
    language plpgsql
as
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

alter function hubble.update_updated_at_column() owner to "postgres";

create trigger update_timestamp
    before update
    on hubble.contract_status
    for each row
execute procedure hubble.update_updated_at_column();

create trigger update_timestamp
    before update
    on hubble.block_status
    for each row
execute procedure hubble.update_updated_at_column();

create trigger update_timestamp
    before update
    on hubble.indexer_status
    for each row
execute procedure hubble.update_updated_at_column();

create trigger update_timestamp
    before update
    on hubble.block_fix
    for each row
execute procedure hubble.update_updated_at_column();

create trigger update_timestamp
    before update
    on v1_aptos.blocks
    for each row
execute procedure hubble.update_updated_at_column();

create trigger update_timestamp
    before update
    on v1_aptos.transactions
    for each row
execute procedure hubble.update_updated_at_column();

create trigger update_timestamp
    before update
    on v1_aptos.events
    for each row
execute procedure hubble.update_updated_at_column();

create trigger update_timestamp
    before update
    on v1_aptos.contracts
    for each row
execute procedure hubble.update_updated_at_column();

create trigger update_timestamp
    before update
    on hubble.token_sources
    for each row
execute procedure hubble.update_updated_at_column();

create trigger update_timestamp
    before update
    on hubble.token_source_representations
    for each row
execute procedure hubble.update_updated_at_column();

COMMIT;