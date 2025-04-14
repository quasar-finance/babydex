// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {drizzle} from "npm:drizzle-orm/postgres-js";
import postgres from "npm:postgres";
import {sql} from "npm:drizzle-orm";

console.info('server started');

const connectionString = Deno.env.get("DATABASE_URL");
const client = postgres(connectionString, {
  prepare: false
});
const db = drizzle(client);

Deno.serve(async (req) => {
  const {addresses} = await req.json();
  const query = sql`
      SELECT p.*
      FROM v1_cosmos.materialized_pool_balance p
               INNER JOIN (SELECT pool_address,
                                  MAX(height) AS max_height
                           FROM v1_cosmos.materialized_pool_balance
                           WHERE TRUE
                               ${createPoolAddressArraySql(addresses)}
                           GROUP BY pool_address) latest
                          ON p.pool_address = latest.pool_address AND p.height = latest.max_height
      WHERE TRUE
          ${createPoolAddressArraySql(addresses, 'p')}
      ORDER BY p.pool_address;
  `;

  try {
    const result = await db.execute(query);

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error("Error executing raw query:", error);

    throw error;
  }
});

function createPoolAddressArraySql(addresses?: string[], table?: string) {
  if (!addresses || addresses.length === 0) {
    return sql.raw(``);
  }

  table = table && table.length > 0 ? table + '.' : '';
  const quotedAddresses = addresses.map((address) => `"${address}"`).join(",");

  return sql.raw(`AND ${table}pool_address = ANY('{${quotedAddresses}}'::text[])`);
}
