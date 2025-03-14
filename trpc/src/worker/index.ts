import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createRedisService } from "../services/redis.js";
import { createCoingeckoService } from "../services/coingecko.js";
import {createIndexerService} from "../services/indexer.js";

import { appRouter } from "../router.js";
import { createPublicClient, http } from "cosmi";

interface Env {
  CONTRACTS: string;
  RPC_NODE: string;
  DB_CREDENTIALS: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return fetchRequestHandler({
      req: request,
      router: appRouter,
      createContext: () => {
        const cacheService = createRedisService();
        const indexerService = createIndexerService(env.DB_CREDENTIALS);
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
  },
};
