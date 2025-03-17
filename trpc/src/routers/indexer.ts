import {createTRPCPublicProcedure, createTRPCRouter} from "../config.js";
import {z} from "zod";
import {
    addLiquidityInV1Cosmos,
    historicPoolYieldInV1Cosmos,
    incentivizeInV1Cosmos,
    poolsInV1Cosmos,
    poolBalanceInV1Cosmos,
    poolFeePeriodsInV1Cosmos,
    poolUserSharesInV1Cosmos,
    swapInV1Cosmos,
    withdrawLiquidityInV1Cosmos
} from "@towerfi/indexer";

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
                return await opts.ctx.indexerService.queryView(addLiquidityInV1Cosmos, opts.input);
            }),
        historicPoolYield: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView(historicPoolYieldInV1Cosmos, opts.input);
            }),
        incentivize: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView(incentivizeInV1Cosmos, opts.input);
            }),
        pools: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView(poolsInV1Cosmos, opts.input);
            }),
        poolBalance: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView(poolBalanceInV1Cosmos, opts.input);
            }),
        poolFeePeriods: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView(poolFeePeriodsInV1Cosmos, opts.input);
            }),
        poolUserShares: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView(poolUserSharesInV1Cosmos, opts.input);
            }),
        swap: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView(swapInV1Cosmos, opts.input);
            }),
        withdrawLiquidity: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return await opts.ctx.indexerService.queryView(withdrawLiquidityInV1Cosmos, opts.input);
            }),
    }
);
