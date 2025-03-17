import {createTRPCPublicProcedure, createTRPCRouter} from "../config.js";
import {z} from "zod";

const input = z.object({
    orderBy: z.enum(["asc", "desc"]).nullish(),
    orderByColumn: z.string().nullish(), // PgColumn | SQL | SQL.Aliased,
    page: z.number().min(1).nullish(),
    limit: z.number().min(1).max(100).nullish(),
}).nullish();

export const indexerRouter = createTRPCRouter(
    {
        addLiquidity: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView('addLiquidity', opts.input);
            }),
        historicPoolYield: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView('historicPoolYield', opts.input);
            }),
        incentivize: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView('incentivize', opts.input);
            }),
        pools: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView('pools', opts.input);
            }),
        poolBalance: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView('poolBalance', opts.input);
            }),
        poolFeePeriods: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView('poolFeePeriods', opts.input);
            }),
        poolUserShares: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView('poolUserShares', opts.input);
            }),
        swap: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView('swap', opts.input);
            }),
        withdrawLiquidity: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView('withdrawLiquidity', opts.input);
            }),
    }
);
