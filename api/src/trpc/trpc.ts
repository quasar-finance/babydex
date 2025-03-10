import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { drizzleService } from "~/services/drizzle.service";
import {
  addLiquidityInV1Cosmos,
  historicPoolYieldInV1Cosmos,
  incentivizeInV1Cosmos,
  poolBalanceInV1Cosmos,
  poolFeePeriodsInV1Cosmos,
  swapInV1Cosmos,
  withdrawLiquidityInV1Cosmos,
} from "../../drizzle/schema";

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

// root router to call
export const trpcRouter = router({
  addLiquidity: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input }) => {
      return drizzleService.select().from(addLiquidityInV1Cosmos);
    }),
  historicPoolYield: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input }) => {
      return drizzleService.select().from(historicPoolYieldInV1Cosmos);
    }),
  incentivize: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input }) => {
      return drizzleService.select().from(incentivizeInV1Cosmos);
    }),
  poolBalance: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input }) => {
      return drizzleService.select().from(poolBalanceInV1Cosmos);
    }),
  poolFeePeriods: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input }) => {
      return drizzleService.select().from(poolFeePeriodsInV1Cosmos);
    }),
  swap: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input }) => {
      return drizzleService.select().from(swapInV1Cosmos);
    }),
  withdrawLiquidity: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input }) => {
      return drizzleService.select().from(withdrawLiquidityInV1Cosmos);
    }),
});

export type AppRouter = typeof trpcRouter;