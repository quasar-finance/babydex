import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createRedisService } from "../services/redis.js";
import { createCoingeckoService } from "../services/coingecko.js";
import {createIndexerService} from "../services/indexer.js";

import { appRouter } from "../router.js";
import { createPublicClient, http } from "cosmi";
import type {DbCredentials} from "@towerfi/types";

interface Env {
  CONTRACTS: string;
  RPC_NODE: string;
  COSMOS_V1_READONLY_HOST: string;
  COSMOS_V1_READONLY_PORT: string;
  COSMOS_V1_READONLY_USER: string;
  COSMOS_V1_READONLY_PASSWORD: string;
  COSMOS_V1_READONLY_DATABASE: string;
  COSMOS_V1_READONLY_SSL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return fetchRequestHandler({
      req: request,
      router: appRouter,
      createContext: () => {
        const cacheService = createRedisService();
        const indexerService = createIndexerService({
          host: env.COSMOS_V1_READONLY_HOST,
          port: Number(env.COSMOS_V1_READONLY_PORT),
          user: env.COSMOS_V1_READONLY_USER,
          password: env.COSMOS_V1_READONLY_PASSWORD,
          database: env.COSMOS_V1_READONLY_DATABASE,
          ssl: Boolean(env.COSMOS_V1_READONLY_SSL),
        } as DbCredentials);
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
