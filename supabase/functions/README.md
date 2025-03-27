# Supabase functions

set the env from .env.example in the hosted environment with `supabase secrets set --env-file ./functions/.env` 

## insert-price
Insert-price fetches all assets registered in the token table, gets the current price for them from coingecko and inserts those prices back into the token prices table

## update-pools
Update-pools fetches all contracts currently being indexed by the indexer and crosschecks that vs the pools view. The pools view contains all pools because the factory contract is being indexed and the pools view is based on create_pair events. If any new pools are found, the pool contract is insert into contract addresses and a block_fix is inserted into the blockfix table to re-index since the creation of the the pool to ensure all pool transactions are correctly indexed. Update-pools calls get-lp-token to properly insert the pool address and lp token into the database

## get-lp-tokens
get-lp-tokens accepts a list of pools, fetches the lp token address from the rpc endpoint passed in via the env vars and inserts the pool and lp token into v1_cosmos.pool_lp_token