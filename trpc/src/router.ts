import { createTRPCRouter, createTRPCPublicProcedure } from "./config.js";
import { userRouter } from "./routers/user.js";
import { poolsRouter } from "./routers/pools.js";
import { assetsRouter } from "./routers/assets.js";

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
