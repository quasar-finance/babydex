# Running the indexer
## Setup
Run the hubble indexer against your database with the 
Schema.sql gives a full database setup including Union's views and tables.
export.sql is an export of the Tower databse

## Indexing a new contract
The indexer itself depends on the contracts table in the database to decide
on which contracts to index. Once the new contract is added to the contracts table,
it starts to get indexed by hubble.
In order to redo any blocks, a blockfix needs to be inserted into the blockfix table
- Insert the contracts to index into the v1_cosmos.contracts table
- Insert a blockfix if needed
- Further process the events and attributes

## Processing the data
Hubble stores all wasm events in a table with the attributes parsed in a seperate json. From here the json needs to be further processed. This is most easily done in views.
The database schema we use, uses the attributes function to parse the json
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
From this the json can then easily be used like this
```sql
    (public.attributes(events.*) ->> 'ask_asset'::text) AS ask_asset,
```