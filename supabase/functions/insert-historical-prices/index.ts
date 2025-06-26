import {createClient} from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  "db": {
    "schema": "v1_cosmos"
  }
});
const COINGECKO_API_URL = 'https://pro-api.coingecko.com/api/v3';
const COINGECKO_API_KEY = Deno.env.get("COINGECKO_API_KEY");
const OPTIONS = {
  method: 'GET',
  headers: {
    'x-cg-pro-api-key': `${COINGECKO_API_KEY}`,
    accept: 'application/json'
  }
};

Deno.serve(async (req) => {
  const {
    reqStartDate,
    tokenName
  } = await req.json();

  try {
    const startDate = new Date(reqStartDate);
    const token = await fetchToken(tokenName);
    const earliestPriceDate = await fetchEarliestPriceDate(tokenName);
    const endDate = new Date(earliestPriceDate.created_at);

    endDate.setMinutes(0, 0, 0);

    if (endDate < startDate) {
      throw new Error(`Earliest price date before start time: ${tokenName}`);
    }

    console.log(`Fetching prices for ${tokenName} from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    const prices = await fetchHistoricalPrices(token.coingecko_id, startDate, endDate);

    if (!prices) {
      throw new Error(`No prices found for ${tokenName} from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    }

    for (const {datetime, timestamp, price} of prices) {
      const {data: priceExistsData, error: priceExistsError} = await supabase
        .from('token_prices')
        .select('price')
        .eq('token', tokenName)
        .eq('created_at', datetime);

      if (priceExistsError) {
        console.warning(`Price already exists for ${tokenName} at ${datetime}:`, priceExistsError);
        continue;
      }

      if (priceExistsData.length === 0) {
        console.log(`Inserting price for ${tokenName} at ${datetime}: ${price}`);

        const {error: insertError} = await supabase
          .from('token_prices')
          .insert({
            token: tokenName,
            price: price,
            created_at: datetime,
            last_updated_at: timestamp
          });

        if (insertError) {
          console.error(`Error inserting price for ${tokenName} at ${datetime}:`, insertError);
        } else {
          console.log(`Inserted price for ${tokenName} at ${datetime}: ${price}`);
        }
      } else {
        console.log(`Price found for ${tokenName} at ${datetime}`);
      }
    }

    console.log('Back filling prices complete.');

    return new Response(JSON.stringify({
      success: true,
      message: "Historical prices fetched and inserted",
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

async function fetchToken(tokenName: string): Promise<unknown> {
  const {
    data: token,
    error: selectError
  } = await supabase
    .from("token")
    .select("denomination, token_name, coingecko_id")
    .eq("token_name", tokenName)
    .limit(1)
    .single();

  console.log("Token: ", JSON.stringify(token));

  if (selectError) {
    throw new Error(`Error selecting token: ${selectError.message}`);
  }

  return token;
}

async function fetchEarliestPriceDate(tokenName: string): Promise<unknown> {
  const {
    data: earliestPriceDate,
    error: selectError
  } = await supabase
    .from("token_prices")
    .select("created_at")
    .eq("token", tokenName)
    .order("created_at", {ascending: true})
    .limit(1)
    .single();

  if (selectError) {
    throw new Error(`Error selecting earliest price date: ${selectError.message}`);
  }

  return earliestPriceDate;
}

async function fetchHistoricalPrices(
  tokenId: string,
  fromDate: Date,
  toDate: Date,
): Promise<{ datetime: string; timestamp: number, price: number }[] | null> {
  const allPrices: { datetime: string; timestamp: number, price: number }[] = [];
  let currentDate = new Date(fromDate);

  while (currentDate < toDate) {
    const nextDay = new Date(currentDate);
    nextDay.setDate(currentDate.getDate() + 1);

    if (nextDay >= toDate) {
      nextDay.setDate(toDate.getDate());
    }

    const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
    const toTimestamp = Math.floor(nextDay.getTime() / 1000);

    const url = `${COINGECKO_API_URL}/coins/${tokenId}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`;

    try {
      const response = await fetch(url, OPTIONS);

      if (!response.ok) {
        throw new Error(`CoinGecko API error for ${tokenId} from ${fromDate} to ${toDate}: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data?.prices) {
        const dailyPrices = data.prices.map((price: [number, number]) => ({
          datetime: new Date(price[0]).toISOString(),
          timestamp: Math.floor(new Date(price[0]).getTime() / 1000),
          price: price[1],
        }));
        allPrices.push(...dailyPrices);
      } else {
        throw new Error(`Price data not found for ${tokenId} from ${fromDate} to ${toDate}`);
      }
    } catch (error) {
      throw new Error(`CoinGecko API error for ${tokenId} from ${fromDate} to ${toDate}: ${error}`);
    }

    currentDate = nextDay;
  }

  return allPrices.length > 0 ? allPrices : null;
}
