import { serve } from "std/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

serve(async (req) => {
  try {
    // Create a Supabase client with the service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { "db": {"schema": "v1_cosmos"}});
    
    // Check what's in pools
    const { data: allPools } = await supabase
      .from('pools')
      .select('pool_address, internal_chain_id, height');
    console.log('All pools:', allPools);

    // Check what's in contracts
    const { data: existingContracts } = await supabase
      .from('contracts')
      .select('address, internal_chain_id');
    console.log('Existing contracts:', existingContracts);

    // Find pools that don't exist in contracts
    const newPools = allPools?.filter(pool => 
      !existingContracts?.some(contract => 
        contract.address === pool.pool_address
      )
    );
    
    console.log('Filtered pools:', newPools);

    if (newPools && newPools.length > 0) {
      console.log(`Found ${newPools.length} new pools`);
      
      for (const pool of newPools) {
        console.log(pool);
        const { data, error } = await supabase.rpc('insert_pool_and_blockfix', {
          p_address: pool.pool_address,
          p_internal_chain_id: pool.internal_chain_id,
          p_height: pool.height
        });

        if (error) {
          console.error(`RPC error for pool ${pool.pool_address}:`, error);
          throw error;
        }
        
        if (!data.success) {
          console.error(`Function error for pool ${pool.pool_address}:`, JSON.stringify(data.error));
          throw new Error(`Function error for pool ${pool.pool_address}: ${JSON.stringify(data.error)}`);
        }
      }
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Processed ${newPools.length} new pools` 
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ success: true, message: 'No new pools found' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});
