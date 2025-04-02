# Hubble Indexer

A database indexer for processing blockchain events and transactions.

## Installation
### running Hubble
Hubble source code can be found [here](https://github.com/unionlabs/union/tree/main/hubble). Hubble itself builds through nix and can be ran through nix. On MacOS you need a NixOS vm setup. The easiest way to do that is via orbstack. See the Union repo for more details.
Once setup, hubble can be run, for example like:
``` 
$(nix path-info --extra-experimental-features nix-command --extra-experimental-features flakes .#hubble)/bin/hubble   --database-url "postgresql://USER:PASSWORD@DATABASE_URL:5432/DATABASE"   --indexers '[{"indexer_id": INDEXERID, "rpc_urls": ["https://babylon-testnet-rpc-archive-1.nodes.guru"], "type": "tendermint", "start_height": 401000, "chunk_size": 20}]'
```

### Database Setup

The indexer uses two main SQL files:
- `schema.sql`: Contains the complete database structure including Union's views and tables
- `export.sql`: Contains an export of the Tower database (reference implementation)
1. Run the database setup:
   ```bash
   psql -f sql/schema.sql
   ```
   or
    ```bash
   psql -f sql/export.sql
   ```
Both schemas use the same tables but differ in the views they add. The tables need to be added to the database for the indexer to register itself and the chain it indexes
## Usage

### Indexing New Contracts

The indexer monitors the contracts table to determine which contracts to index. To add a new contract:

1. Insert the contract details into `v1_cosmos.contracts`:
   ```sql
   INSERT INTO v1_cosmos.contracts (address, start_height, ...) 
   VALUES ('contract_address', block_height, ...);
   ```

2. If reprocessing is needed, add a blockfix:
   ```sql
   INSERT INTO blockfix (contract_address, start_height, end_height)
   VALUES ('contract_address', start_block, end_block);
   ```

3. The indexer will process events and attributes for the specified blocks

### Data Processing

The indexer stores WASM events in a table with attributes parsed into JSON. The schema includes a helper function for processing these attributes:

```sql
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
```

Example usage in views:
```sql
SELECT 
    (public.attributes(events.*) ->> 'ask_asset'::text) AS ask_asset,
    -- other fields...
FROM events;
```
