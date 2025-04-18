import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createRedisService } from "../services/redis.js";
import { createCoingeckoService } from "../services/coingecko.js";
import { createIndexerService } from "@towerfi/indexer";

import { edgeRouter } from "../router.js";
import { createPublicClient, http } from "cosmi";
import { createTRPCRouter } from "../config.js";

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

// const allowedOrigins = [
//   "https://tower-frontend-git-feat-add-pool-metrics-quasar-fi.vercel.app",
//   "https://tower.fi",
//   "http://localhost:3000"
// ] as const;

// const getOrigin = (request: Request): string => {
//   const origin = request.headers.get("origin");
//   return origin && allowedOrigins.includes(origin as typeof allowedOrigins[number]) 
//     ? origin 
//     : allowedOrigins[0];
// };


const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers":
            request.headers.get("Access-Control-Request-Headers") || "*",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    const response = await fetchRequestHandler({
      req: request,
      router: createTRPCRouter({ edge: edgeRouter }),
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

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers":
          request.headers.get("Access-Control-Request-Headers") || "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  },
};
