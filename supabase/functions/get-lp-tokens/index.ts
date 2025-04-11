import {createClient} from 'jsr:@supabase/supabase-js@2';
import {CosmWasmClient} from "npm:@cosmjs/cosmwasm-stargate@^0.33.1";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const RPC_ENDPOINT = Deno.env.get("RPC_ENDPOINT");
Deno.serve(async (req) => {
  try {
    // Parse the request body with type
    const {pools} = await req.json();
    if (!pools || !Array.isArray(pools)) {
      throw new Error('Invalid request body - expected array of pool addresses');
    }
    // Create a Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      "db": {
        "schema": "v1_cosmos"
      }
    });
    const results = [];
    for (const poolAddress of pools) {
      try {
        // Query the blockchain node to get LP token
        // You'll need to implement this function based on your specific blockchain SDK
        const lpToken = await queryLPToken(poolAddress);
        // Insert the relationship into the database
        console.log(lpToken);
        const {data, error} = await supabase.from('pool_lp_token').insert({
          pool: poolAddress,
          lp_token: lpToken
        }).select().single();
        if (error) throw error;
        results.push({
          pool_address: poolAddress,
          lp_token: lpToken,
          success: true
        });
      } catch (error) {
        console.error(`Error processing pool ${poolAddress}:`, error);
        results.push({
          pool_address: poolAddress,
          error: error.message,
          success: false
        });
      }
    }
    return new Response(JSON.stringify({
      success: true,
      results
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
});

// This function needs to be implemented based on your blockchain SDK
async function queryLPToken(poolAddress) {
  // Example implementation - replace with actual blockchain query
  const client = await CosmWasmClient.connect(RPC_ENDPOINT);
  const result = await client.queryContractSmart(poolAddress, {
    pair: {}
  });
  console.log(result.liquidity_token);
  return result.liquidity_token;
}
