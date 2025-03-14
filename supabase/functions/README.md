# Supabase functions

## insert-price
Insert-price fetches all assets registered in the token table, gets the current price for them from coingecko and inserts those prices back into the token prices table

## update-pools
Update-pools fetches all contracts currently being indexed by the indexer and crosschecks that vs the pools view. The pools view contains all pools because the factory contract is being indexed and the pools view is based on create_pair events. If any new pools are found, the pool contract is insert into contract addresses and a block_fix is inserted into the blockfix table to re-index since the creation of the the pool to ensure all pool transactions are correctly indexed