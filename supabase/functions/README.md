# Supabase functions

## insert-price
Insert-price fetches all assets registered in the token table, gets the current price for them from coingecko and inserts those prices back into the token prices table

## update-pools
Update-pools checks if any new pools have been created by looking at the register event from the factory contract. If the any of the registered contracts do not exist in the contracts table, they get inserted. To make 