import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createRedisService } from "../services/redis.js";
import { createCoingeckoService } from "../services/coingecko.js";

import { appRouter } from "../router.js";
import { createPublicClient, http } from "cosmi";

interface Env {
  CONTRACTS: string;
  RPC_NODE: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return fetchRequestHandler({
      req: request,
      router: appRouter,
      createContext: () => {
        const cacheService = createRedisService();
        return {
          contracts: JSON.parse(env.CONTRACTS),
          cacheService,
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
  },
};
