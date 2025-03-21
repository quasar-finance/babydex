import {createTRPCPublicProcedure, createTRPCRouter} from "../config.js";
import {z} from "zod";

const input = z
  .object({
    orderBy: z.enum(["asc", "desc"]).optional(),
    orderByColumn: z.string().optional(),
    page: z.number().min(1).optional(),
    limit: z.number().min(1).max(100).optional(),
  })
  .optional();

export const indexerRouter = createTRPCRouter({
  addLiquidity: createTRPCPublicProcedure.input(input).query(async ({ctx, input}) => {
    return await ctx.indexerService.queryView("addLiquidity", input);
  }),
  historicPoolYield: createTRPCPublicProcedure.input(input).query(async ({ctx, input}) => {
    return await ctx.indexerService.queryView("historicPoolYield", input);
  }),
  incentivize: createTRPCPublicProcedure.input(input).query(async ({ctx, input}) => {
    return await ctx.indexerService.queryView("incentivize", input);
  }),
  pools: createTRPCPublicProcedure.input(input).query(async ({ctx, input}) => {
    return await ctx.indexerService.queryView("pools", input);
  }),
  poolBalance: createTRPCPublicProcedure.input(input).query(async ({ctx, input}) => {
    return await ctx.indexerService.queryView("poolBalance", input);
  }),
  poolFeePeriods: createTRPCPublicProcedure.input(input).query(async ({ctx, input}) => {
    return await ctx.indexerService.queryView("poolFeePeriods", input);
  }),
  poolUserShares: createTRPCPublicProcedure.input(input).query(async ({ctx, input}) => {
    return await ctx.indexerService.queryView("poolUserShares", input);
  }),
  swap: createTRPCPublicProcedure.input(input).query(async ({ctx, input}) => {
    return await ctx.indexerService.queryView("swap", input);
  }),
  withdrawLiquidity: createTRPCPublicProcedure.input(input).query(async ({ctx, input}) => {
    return await ctx.indexerService.queryView("withdrawLiquidity", input);
  }),
  getCurrentPoolBalances: createTRPCPublicProcedure
    .input(z.object({page: z.number().min(1), limit: z.number().min(1).max(100)}))
    .query(async ({ctx, input}) => {
      return await ctx.indexerService.getCurrentPoolBalances(input.page, input.limit);
    }),
  getPoolBalancesByAddresses: createTRPCPublicProcedure
    .input(z.object({addresses: z.string().array()}))
    .query(async ({ctx, input}) => {
      return await ctx.indexerService.getPoolBalancesByPoolAddresses(input.addresses);
    }),
  getCurrentPoolVolumes: createTRPCPublicProcedure
    .input(z.object({page: z.number().min(1), limit: z.number().min(1).max(100)}))
    .query(async ({ctx, input}) => {
      return await ctx.indexerService.getCurrentPoolVolumes(input.page, input.limit);
    }),
  getPoolVolumesByAddresses: createTRPCPublicProcedure
    .input(z.object({addresses: z.string().array()}))
    .query(async ({ctx, input}) => {
      return await ctx.indexerService.getPoolVolumesByPoolAddresses(input.addresses);
    }),
});
