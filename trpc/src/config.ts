import { initTRPC } from "@trpc/server";

import { userRouter } from "./routers/user.js";
import { poolsRouter } from "./routers/pools.js";
import { assetsRouter } from "./routers/assets.js";

import type { BaseCurrency, Cache } from "@towerfi/types";
import type { CoingeckoServiceReturnType } from "./services/coingecko.js";

export type ContextOptions = {
  publicClient: any;
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

export const edgeRouter = createTRPCRouter({
  user: userRouter,
  health: createTRPCPublicProcedure.query(async () => {
    return { status: "up" };
  }),
});

export const localRouter = createTRPCRouter({
  pools: poolsRouter,
  assets: assetsRouter,
});

export const appRouter = createTRPCRouter({
  edge: edgeRouter,
  local: localRouter,
});

export type AppRouter = typeof appRouter;
