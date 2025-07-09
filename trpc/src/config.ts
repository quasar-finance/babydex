import { initTRPC } from "@trpc/server";

import type { Indexer, Referral } from "@towerfi/indexer";
import type { Cache, Currency } from "@towerfi/types";
import type { PublicClient } from "cosmi";
import type { CoingeckoServiceReturnType } from "./services/coingecko.js";

export type ContextOptions = {
  publicClient: PublicClient;
  assets: Record<string, Currency>;
  cacheService: Cache;
  indexerService: Indexer;
  referralService: Referral;
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
