import { createTRPCPublicProcedure, createTRPCRouter } from "../config.js";
import { z } from "zod";

const input = z
  .object({
    orderBy: z.enum(["asc", "desc"]).optional(),
    orderByColumn: z.string().optional(),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
  })
  .optional();

export const indexerRouter = createTRPCRouter({
  addLiquidity: createTRPCPublicProcedure.input(input).query(async ({ ctx, input }) => {
    return await ctx.indexerService.queryView("addLiquidity", input);
  }),
  historicPoolYield: createTRPCPublicProcedure.input(input).query(async ({ ctx, input }) => {
    return await ctx.indexerService.queryView("historicPoolYield", input);
  }),
  incentivize: createTRPCPublicProcedure.input(input).query(async ({ ctx, input }) => {
    return await ctx.indexerService.queryView("incentivize", input);
  }),
  pools: createTRPCPublicProcedure.input(input).query(async ({ ctx, input }) => {
    return await ctx.indexerService.queryView("pools", input);
  }),
  poolBalance: createTRPCPublicProcedure.input(input).query(async ({ ctx, input }) => {
    return await ctx.indexerService.queryView("poolBalance", input);
  }),
  poolUserShares: createTRPCPublicProcedure.input(input).query(async ({ ctx, input }) => {
    return await ctx.indexerService.queryView("poolUserShares", input);
  }),
  stakeLiquidity: createTRPCPublicProcedure.input(input).query(async ({ ctx, input }) => {
    return await ctx.indexerService.queryView("stakeLiquidity", input);
  }),
  swap: createTRPCPublicProcedure.input(input).query(async ({ ctx, input }) => {
    return await ctx.indexerService.queryView("swap", input);
  }),
  withdrawLiquidity: createTRPCPublicProcedure.input(input).query(async ({ ctx, input }) => {
    return await ctx.indexerService.queryView("withdrawLiquidity", input);
  }),
  unstakeLiquidity: createTRPCPublicProcedure.input(input).query(async ({ ctx, input }) => {
    return await ctx.indexerService.queryView("unstakeLiquidity", input);
  }),
  getUserBalances: createTRPCPublicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getUserBalances(input.address);
    }),
  getCurrentPoolBalances: createTRPCPublicProcedure
    .input(z.object({ page: z.number().min(1), limit: z.number().min(1).max(100) }))
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getCurrentPoolBalances(input.page, input.limit);
    }),
  getPoolBalancesByAddresses: createTRPCPublicProcedure
    .input(z.object({ addresses: z.string().array() }))
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getPoolBalancesByPoolAddresses(input.addresses);
    }),
  getCurrentPoolVolumes: createTRPCPublicProcedure
    .input(z.object({ page: z.number().min(1), limit: z.number().min(1).max(100) }))
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getCurrentPoolVolumes(input.page, input.limit);
    }),
  getPoolVolumesByAddresses: createTRPCPublicProcedure
    .input(z.object({ addresses: z.string().array() }))
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getPoolVolumesByPoolAddresses(input.addresses);
    }),
  getCurrentPoolAprs: createTRPCPublicProcedure
    .input(
      z.object({
        interval: z.number().min(1).max(365),
        page: z.number().min(1),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getCurrentPoolAprs(input.interval, input.limit, input.page);
    }),
  getPoolAprsByAddresses: createTRPCPublicProcedure
    .input(z.object({ interval: z.number().min(1).max(365), addresses: z.string().array() }))
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getPoolAprsByPoolAddresses(input.interval, input.addresses);
    }),
  getCurrentPoolIncentives: createTRPCPublicProcedure
    .input(
      z.object({
        interval: z.number().min(1).max(365),
        page: z.number().min(1),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getCurrentPoolIncentives(
        input.interval,
        input.limit,
        input.page,
      );
    }),
  getPoolIncentivesByAddresses: createTRPCPublicProcedure
    .input(z.object({ interval: z.number().min(1).max(365), addresses: z.string().array() }))
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getPoolIncentivesByPoolAddresses(
        input.interval,
        input.addresses,
      );
    }),
  getPoolIncentiveAprsByAddresses: createTRPCPublicProcedure
    .input(z.object({
      addresses: z.string().array(),
      startDate: z.string().refine(str => !isNaN(Date.parse(str)), {
        message: "Invalid date string"
      }).transform(str => new Date(str)).nullish(),
      endDate: z.string().refine(str => !isNaN(Date.parse(str)), {
        message: "Invalid date string"
      }).transform(str => new Date(str)).nullish()
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getPoolIncentiveAprsByPoolAddresses(
        input.addresses,
        input.startDate,
        input.endDate,
      );
    }),
  getPoolMetricsByAddresses: createTRPCPublicProcedure
    .input(z.object({ 
      addresses: z.string().array(), 
      startDate: z.string().refine(str => !isNaN(Date.parse(str)), {
        message: "Invalid date string"
      }).transform(str => new Date(str)).nullish(), 
      endDate: z.string().refine(str => !isNaN(Date.parse(str)), {
        message: "Invalid date string"
      }).transform(str => new Date(str)).nullish() 
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.indexerService.getPoolMetricsByPoolAddresses(
        input.addresses,
        input.startDate,
        input.endDate,
      );
    }),
});
