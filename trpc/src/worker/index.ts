import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createRedisService } from "../services/redis.js";
import { createCoingeckoService } from "../services/coingecko.js";
import { createIndexerService } from "@towerfi/indexer";

import { appRouter } from "../router.js";
import { createPublicClient, http } from "cosmi";

interface Env {
  CONTRACTS: string;
  RPC_NODE: string;
  SUPABASE_READONLY_HOST: string;
  SUPABASE_READONLY_PORT: string;
  SUPABASE_READONLY_USER: string;
  SUPABASE_READONLY_PASSWORD: string;
  SUPABASE_READONLY_DATABASE: string;
  SUPABASE_READONLY_SSL: string;
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers,
      });
    }

    const response = await fetchRequestHandler({
      req: request,
      router: appRouter,
      createContext: () => {
        const cacheService = createRedisService();
        const indexerService = createIndexerService({
          host: env.SUPABASE_READONLY_HOST,
          port: Number(env.SUPABASE_READONLY_PORT),
          user: env.SUPABASE_READONLY_USER,
          password: env.SUPABASE_READONLY_PASSWORD,
          database: env.SUPABASE_READONLY_DATABASE,
          ssl: Boolean(env.SUPABASE_READONLY_SSL),
        });
        return {
          contracts: JSON.parse(env.CONTRACTS),
          cacheService,
          indexerService,
          assets: {},
          coingeckoService: createCoingeckoService({ cacheService }),
          publicClient: createPublicClient({
            transport: http(env.RPC_NODE),
          }),
        };
      },
      endpoint: "/trpc",
      batching: {
        enabled: true,
      },
    });

    return new Response(response.body, { headers, status: response.status });
  },
};
