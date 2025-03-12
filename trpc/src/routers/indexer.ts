import {createTRPCPublicProcedure, createTRPCRouter} from "../config.js";
import {z} from "zod";
import {buildQuery} from "../services/drizzle.service.js";

const input = z.object({
    orderBy: z.enum(["asc", "desc"]).nullish(),
    orderByColumn: z.string().nullish(), // PgColumn | SQL | SQL.Aliased,
    page: z.number().min(1).nullish(),
    limit: z.number().min(1).max(100).nullish(),
    filter: z.string().nullish(),
}).nullish();

export const indexerRouter = createTRPCRouter(
    {
        addLiquidity: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return buildQuery('addLiquidity', opts.input);

            }),
        historicPoolYield: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return buildQuery('historicPoolYield', opts.input);
            }),
        incentivize: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return buildQuery('incentivize', opts.input);
            }),
        poolBalance: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return buildQuery('poolBalance', opts.input);
            }),
        poolFeePeriods: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return buildQuery('poolFeePeriods', opts.input);
            }),
        poolUserShares: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return buildQuery('poolUserShares', opts.input);
            }),
        swap: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return buildQuery('swap', opts.input);
            }),
        withdrawLiquidity: createTRPCPublicProcedure
            .input(input)
            .query(async (opts) => {
                return buildQuery('withdrawLiquidity', opts.input);
            }),
    }
);
