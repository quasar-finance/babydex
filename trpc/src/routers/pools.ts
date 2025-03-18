import { z } from "zod";
import { createCallerFactory, createTRPCPublicProcedure, createTRPCRouter } from "../config.js";

import { appRouter } from "../router.js";

import type {
  PoolInfo,
  BaseCurrency,
  ConfigResponse,
  CumulativePricesResponse,
  PairInfo,
  PoolResponse,
  PoolType,
  WithPrice,
} from "@towerfi/types";
import { fromBase64, fromUtf8 } from "cosmi/utils";
import { getInnerValueFromAsset } from "../utils/assets.js";

export const poolsRouter = createTRPCRouter({
  getPoolConfig: createTRPCPublicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ ctx, input }) => {
      const { publicClient } = ctx;
      const { address } = input;

      const pool = await publicClient.queryContractSmart<ConfigResponse>({
        address,
        msg: {
          config: {},
        },
      });

      if (!pool) throw new Error("Pool not found or invalid");

      return {
        ...pool,
        params: JSON.parse(fromUtf8(fromBase64(pool.params ?? ""))),
      };
    }),
  getOptimalRatio: createTRPCPublicProcedure
    .input(z.object({ address: z.string() }))
    .query(async ({ ctx, input }) => {
      const { publicClient } = ctx;
      const { address } = input;
      const caller = createCallerFactory(appRouter)(ctx);

      const [pool, config, cumulativePrices] = await Promise.all([
        caller.local.pools.getPool({ address }),
        caller.local.pools.getPoolConfig({ address }),
        publicClient.queryContractSmart<CumulativePricesResponse>({
          address,
          msg: { cumulative_prices: {} },
        }),
      ]);

      const { params } = config;
      const pairType = Object.keys(pool.pair_type)[0] as string;

      if (!cumulativePrices) throw new Error("Pool not found or invalid");
      const [token0, token1] = cumulativePrices.assets;
      if (!token0 || !token1) throw new Error("Invalid number of tokens");

      const { amount: token0Amount } = token0;
      const { amount: token1Amount } = token1;

      const assetInfo0 = await caller.local.assets.getAsset({
        asset: getInnerValueFromAsset(token0.info),
      });
      const assetInfo1 = await caller.local.assets.getAsset({
        asset: getInnerValueFromAsset(token1.info),
      });

      const poolAmount0 = Number(token0Amount) / 10 ** assetInfo0.decimals;
      const poolAmount1 = Number(token1Amount) / 10 ** assetInfo1.decimals;

      if (pairType === "xyk") {
        const optimalRatio: number = poolAmount0 / poolAmount1;
        return optimalRatio;
      }

      const priceScale = Number(params.price_scale);

      const optimalRatio: number = poolAmount0 / (poolAmount1 * priceScale);

      return optimalRatio;
    }),
  getPool: createTRPCPublicProcedure
    .input(z.object({ address: z.string() }))
    .query<PairInfo>(async ({ ctx, input }) => {
      const { publicClient } = ctx;
      const { address } = input;

      return await publicClient.queryContractSmart<PairInfo>({
        address,
        msg: { pair: {} },
      });
    }),
  getPools: createTRPCPublicProcedure.query<PoolInfo[]>(async ({ ctx }) => {
    const { publicClient, contracts } = ctx;

    const pools: PairInfo[] = await publicClient.queryContractSmart<PairInfo[]>({
      address: contracts.factory,
      msg: { pairs: {} },
    });

    const caller = createCallerFactory(appRouter)(ctx);

    return await Promise.all(
      pools.map(async (pool) => {
        const info = await publicClient.queryContractSmart<PoolResponse>({
          address: pool.contract_addr,
          msg: { pool: {} },
        });

        const [token1, token2] = pool.asset_infos;
        if (!token1 || !token2) throw new Error("Invalid pool");

        const t1: WithPrice<BaseCurrency> = await caller.local.assets.getAsset({
          asset: getInnerValueFromAsset(token1),
        });

        const t2: WithPrice<BaseCurrency> = await caller.local.assets.getAsset({
          asset: getInnerValueFromAsset(token2),
        });

        const name = `${t1.symbol} / ${t2.symbol}`;

        return {
          name,
          poolAddress: pool.contract_addr,
          lpAddress: pool.liquidity_token,
          poolType: Object.keys(pool.pair_type)[0] as PoolType,
          assets: [t1, t2],
          poolLiquidity: info.total_share,

          rewards: [],
        };
      }),
    );
  }),
});
