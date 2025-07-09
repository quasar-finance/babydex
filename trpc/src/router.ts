import { createTRPCPublicProcedure, createTRPCRouter } from "./config.js";
import { assetsRouter } from "./routers/assets.js";
import { indexerRouter } from "./routers/indexer.js";
import { poolsRouter } from "./routers/pools.js";
import { referralRouter } from "./routers/referral.js";
import { userRouter } from "./routers/user.js";

export const edgeRouter = createTRPCRouter({
  user: userRouter,
  indexer: indexerRouter,
  referral: referralRouter,
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
