import { initTRPC } from "@trpc/server";

import type { BaseCurrency, Cache } from "@towerfi/types";
import type { CoingeckoServiceReturnType } from "./services/coingecko.js";
import type { PublicClient } from "cosmi";

export type ContextOptions = {
  publicClient: PublicClient;
  assets: Record<string, BaseCurrency>;
  cacheService: Cache;
  coingeckoService: CoingeckoServiceReturnType;
  contracts: {
    coinRegistry: string;
    factory: string;
    incentives: string;
    router: string;
  };
};

export const createInnerTRPCContext = (opts: ContextOptions) => {
  return opts;
};

const t = initTRPC.context<typeof createInnerTRPCContext>().create({
  allowOutsideOfServer: true,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const createTRPCPublicProcedure = t.procedure;
