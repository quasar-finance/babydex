import {createClient} from 'jsr:@supabase/supabase-js@2';
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  "db": {
    "schema": "v1_cosmos"
  }
});
Deno.serve(async (req) => {
  try {
    const {
      data: tokens,
      error: selectError
    } = await supabase.from("token").select("denomination, token_name, coingecko_id");
    if (selectError) {
      throw new Error(`Error selecting tokens: ${selectError.message}`);
    }
    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        message: "No tokens found"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    const coinIds = tokens.map((t) => t.coingecko_id).join(",");
    // see https://www.coingecko.com/en/api for api documentation
    const coingeckoUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_last_updated_at=true`;
    const response = await fetch(coingeckoUrl);
    if (!response.ok) {
      throw new Error(`CoinGecko request failed: ${response.statusText}`);
    }
    const priceData = await response.json();
    // Group tokens by coingecko_id to avoid duplicate API calls
    const tokensByCoingeckoId = tokens.reduce((acc, token) => {
      if (!acc[token.coingecko_id]) {
        acc[token.coingecko_id] = [];
      }
      acc[token.coingecko_id].push(token);
      return acc;
    }, {});
    // build a list to insert, creating one entry per token
    const inserts = Object.entries(tokensByCoingeckoId).flatMap(([cgId, tokens]) => {
      const coinInfo = priceData[cgId];
      const usdPrice = coinInfo?.usd ?? null;
      const lastUpdatedAt = coinInfo?.last_updated_at ?? null;
      return tokens.map((token) => ({
        price: usdPrice,
        token: token.token_name,
        last_updated_at: lastUpdatedAt
      }));
    });
    const {error: insertError} = await supabase.from("token_prices").insert(inserts);
    if (insertError) {
      throw new Error(`Error inserting prices: ${insertError.message}`);
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Prices fetched and inserted",
      count: inserts.length
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    console.error("Error in Edge Function:", err);
    return new Response(JSON.stringify({
      success: false,
      error: err.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
