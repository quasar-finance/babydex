import { createTRPCRouter, createTRPCPublicProcedure } from "./config.js";
import { userRouter } from "./routers/user.js";
import { poolsRouter } from "./routers/pools.js";
import { assetsRouter } from "./routers/assets.js";
import { indexerRouter } from "./routers/indexer.js";

export const edgeRouter = createTRPCRouter({
  user: userRouter,
  indexer: indexerRouter,
  health: createTRPCPublicProcedure.query(async () => {
    return { status: "up" };
  }),
});

const edgerWrapper = createTRPCRouter({ edge: edgeRouter });

export const localRouter = createTRPCRouter({
  pools: poolsRouter,
  assets: assetsRouter,
});

export const appRouter = createTRPCRouter({
  edge: edgeRouter,
  local: localRouter,
});

export type EdgeRouter = typeof edgerWrapper;
export type AppRouter = typeof appRouter;
