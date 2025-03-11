import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { drizzleService, withPagination } from "~/services/drizzle.service";
import {
  addLiquidityInV1Cosmos,
  historicPoolYieldInV1Cosmos,
  incentivizeInV1Cosmos,
  poolBalanceInV1Cosmos,
  poolFeePeriodsInV1Cosmos,
  poolUserSharesInV1Cosmos,
  swapInV1Cosmos,
  withdrawLiquidityInV1Cosmos,
} from "../../drizzle/schema";
import { generateDrizzleFilter } from "drizzle-query-helper";

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

// root router to call
export const trpcRouter = router({
  addLiquidity: publicProcedure
    .input(z.object({
      orderBy: z.enum(["asc", "desc"]),
      orderByColumn: z.string().nullish(), // PgColumn | SQL | SQL.Aliased,
      page: z.number().min(1).nullish(),
      limit: z.number().min(1).max(100).nullish(),
      filter: z.string().nullish(),
    }).nullish())
    .query(async (opts) => {
      if (!opts.input) {
        return drizzleService.select().from(addLiquidityInV1Cosmos);
      }

      const { input } = opts;
      const orderBy = input?.orderBy ?? "asc";
      const orderByColumn = input?.orderByColumn;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 50;
      const filter = input?.filter ?? null;

      const query = drizzleService.select().from(addLiquidityInV1Cosmos);
      const dynamicQuery = query.$dynamic();

      if (filter) {
        const drizzleFilter = generateDrizzleFilter(addLiquidityInV1Cosmos, filter);
        if (drizzleFilter) {
          dynamicQuery.where(drizzleFilter);
        }
      }

      return withPagination(dynamicQuery, page, limit, orderBy, orderByColumn);

    }),
  historicPoolYield: publicProcedure
    .input(z.object({
      orderBy: z.enum(["asc", "desc"]),
      orderByColumn: z.string().nullish(), // PgColumn | SQL | SQL.Aliased,
      page: z.number().min(1).nullish(),
      limit: z.number().min(1).max(100).nullish(),
      filter: z.string().nullish(),
    }).nullish())
    .query(async (opts) => {
      if (!opts.input) {
        return drizzleService.select().from(historicPoolYieldInV1Cosmos);
      }

      const { input } = opts;
      const orderBy = input?.orderBy ?? "asc";
      const orderByColumn = input?.orderByColumn;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 50;
      const filter = input?.filter ?? null;

      const query = drizzleService.select().from(historicPoolYieldInV1Cosmos);
      const dynamicQuery = query.$dynamic();

      if (filter) {
        const drizzleFilter = generateDrizzleFilter(addLiquidityInV1Cosmos, filter);
        if (drizzleFilter) {
          dynamicQuery.where(drizzleFilter);
        }
      }

      return withPagination(dynamicQuery, page, limit, orderBy, orderByColumn);
    }),
  incentivize: publicProcedure
    .input(z.object({
      orderBy: z.enum(["asc", "desc"]),
      orderByColumn: z.string().nullish(), // PgColumn | SQL | SQL.Aliased,
      page: z.number().min(1).nullish(),
      limit: z.number().min(1).max(100).nullish(),
      filter: z.string().nullish(),
    }).nullish())
    .query(async (opts) => {
      if (!opts.input) {
        return drizzleService.select().from(incentivizeInV1Cosmos);
      }

      const { input } = opts;
      const orderBy = input?.orderBy ?? "asc";
      const orderByColumn = input?.orderByColumn;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 50;
      const filter = input?.filter ?? null;

      const query = drizzleService.select().from(incentivizeInV1Cosmos);
      const dynamicQuery = query.$dynamic();

      if (filter) {
        const drizzleFilter = generateDrizzleFilter(addLiquidityInV1Cosmos, filter);
        if (drizzleFilter) {
          dynamicQuery.where(drizzleFilter);
        }
      }

      return withPagination(dynamicQuery, page, limit, orderBy, orderByColumn);
    }),
  poolBalance: publicProcedure
    .input(z.object({
      orderBy: z.enum(["asc", "desc"]),
      orderByColumn: z.string().nullish(), // PgColumn | SQL | SQL.Aliased,
      page: z.number().min(1).nullish(),
      limit: z.number().min(1).max(100).nullish(),
      filter: z.string().nullish(),
    }).nullish())
    .query(async (opts) => {
      if (!opts.input) {
        return drizzleService.select().from(poolBalanceInV1Cosmos);
      }

      const { input } = opts;
      const orderBy = input?.orderBy ?? "asc";
      const orderByColumn = input?.orderByColumn;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 50;
      const filter = input?.filter ?? null;

      const query = drizzleService.select().from(poolBalanceInV1Cosmos);
      const dynamicQuery = query.$dynamic();

      if (filter) {
        const drizzleFilter = generateDrizzleFilter(addLiquidityInV1Cosmos, filter);
        if (drizzleFilter) {
          dynamicQuery.where(drizzleFilter);
        }
      }

      return withPagination(dynamicQuery, page, limit, orderBy, orderByColumn);
    }),
  poolFeePeriods: publicProcedure
    .input(z.object({
      orderBy: z.enum(["asc", "desc"]),
      orderByColumn: z.string().nullish(), // PgColumn | SQL | SQL.Aliased,
      page: z.number().min(1).nullish(),
      limit: z.number().min(1).max(100).nullish(),
      filter: z.string().nullish(),
    }).nullish())
    .query(async (opts) => {
      if (!opts.input) {
        return drizzleService.select().from(poolFeePeriodsInV1Cosmos);
      }

      const { input } = opts;
      const orderBy = input?.orderBy ?? "asc";
      const orderByColumn = input?.orderByColumn;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 50;
      const filter = input?.filter ?? null;

      const query = drizzleService.select().from(poolFeePeriodsInV1Cosmos);
      const dynamicQuery = query.$dynamic();

      if (filter) {
        const drizzleFilter = generateDrizzleFilter(addLiquidityInV1Cosmos, filter);
        if (drizzleFilter) {
          dynamicQuery.where(drizzleFilter);
        }
      }

      return withPagination(dynamicQuery, page, limit, orderBy, orderByColumn);
    }),
  poolUserShares: publicProcedure
    .input(z.object({
      orderBy: z.enum(["asc", "desc"]),
      orderByColumn: z.string().nullish(), // PgColumn | SQL | SQL.Aliased,
      page: z.number().min(1).nullish(),
      limit: z.number().min(1).max(100).nullish(),
      filter: z.string().nullish(),
    }).nullish())
    .query(async (opts) => {
      if (!opts.input) {
        return drizzleService.select().from(poolUserSharesInV1Cosmos);
      }

      const { input } = opts;
      const orderBy = input?.orderBy ?? "asc";
      const orderByColumn = input?.orderByColumn;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 50;
      const filter = input?.filter ?? null;

      const query = drizzleService.select().from(poolUserSharesInV1Cosmos);
      const dynamicQuery = query.$dynamic();

      if (filter) {
        const drizzleFilter = generateDrizzleFilter(addLiquidityInV1Cosmos, filter);
        if (drizzleFilter) {
          dynamicQuery.where(drizzleFilter);
        }
      }

      return withPagination(dynamicQuery, page, limit, orderBy, orderByColumn);
    }),
  swap: publicProcedure
    .input(z.object({
      orderBy: z.enum(["asc", "desc"]),
      orderByColumn: z.string().nullish(), // PgColumn | SQL | SQL.Aliased,
      page: z.number().min(1).nullish(),
      limit: z.number().min(1).max(100).nullish(),
      filter: z.string().nullish(),
    }).nullish())
    .query(async (opts) => {
      if (!opts.input) {
        return drizzleService.select().from(swapInV1Cosmos);
      }

      const { input } = opts;
      const orderBy = input?.orderBy ?? "asc";
      const orderByColumn = input?.orderByColumn;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 50;
      const filter = input?.filter ?? null;

      const query = drizzleService.select().from(swapInV1Cosmos);
      const dynamicQuery = query.$dynamic();

      if (filter) {
        const drizzleFilter = generateDrizzleFilter(addLiquidityInV1Cosmos, filter);
        if (drizzleFilter) {
          dynamicQuery.where(drizzleFilter);
        }
      }

      return withPagination(dynamicQuery, page, limit, orderBy, orderByColumn);
    }),
  withdrawLiquidity: publicProcedure
    .input(z.object({
      orderBy: z.enum(["asc", "desc"]),
      orderByColumn: z.string().nullish(), // PgColumn | SQL | SQL.Aliased,
      page: z.number().min(1).nullish(),
      limit: z.number().min(1).max(100).nullish(),
      filter: z.string().nullish(),
    }).nullish())
    .query(async (opts) => {
      if (!opts.input) {
        return drizzleService.select().from(withdrawLiquidityInV1Cosmos);
      }

      const { input } = opts;
      const orderBy = input?.orderBy ?? "asc";
      const orderByColumn = input?.orderByColumn;
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 50;
      const filter = input?.filter ?? null;

      const query = drizzleService.select().from(withdrawLiquidityInV1Cosmos);
      const dynamicQuery = query.$dynamic();

      if (filter) {
        const drizzleFilter = generateDrizzleFilter(addLiquidityInV1Cosmos, filter);
        if (drizzleFilter) {
          dynamicQuery.where(drizzleFilter);
        }
      }

      return withPagination(dynamicQuery, page, limit, orderBy, orderByColumn);
    }),
});

export type AppRouter = typeof trpcRouter;