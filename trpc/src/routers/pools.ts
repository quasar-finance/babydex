import { createCallerFactory, createTRPCPublicProcedure, createTRPCRouter } from "../config.js";

import { appRouter } from "../router.js";

import type { BaseCurrency, PairInfo, PoolResponse } from "@towerfi/types";

export const poolsRouter = createTRPCRouter({
  getPools: createTRPCPublicProcedure.query(async ({ ctx }) => {
    const { publicClient, contracts } = ctx;
    const pools: PairInfo[] = await publicClient.request.wasm.queryContractSmart(
      contracts.factory,
      {
        pairs: {},
      },
    );

    const caller = createCallerFactory(appRouter)(ctx);

    return await Promise.all(
      pools.map(async (pool) => {
        const info: PoolResponse = await publicClient.request.wasm.queryContractSmart(
          pool.contract_addr,
          {
            pool: {},
          },
        );
        const [
          {
            native_token: { denom: denom1 },
          },
          {
            native_token: { denom: denom2 },
          },
        ] = pool.asset_infos as any; // { native_token: { denom: string } }[];

        const t1: BaseCurrency = await caller.local.assets.getAsset({
          denom: denom1,
        });
        const t2: BaseCurrency = await caller.local.assets.getAsset({
          denom: denom2,
        });
        const name: string = `${t1.symbol} / ${t2.symbol}`;

        return {
          name: name,
          poolAddress: pool.contract_addr,
          lpAddress: pool.liquidity_token,
          poolType: Object.keys(pool.pair_type)[0],
          assets: [t1, t2],
          poolLiquidity: info.total_share,

          rewards: [],
        };
      }),
    );
  }),
});
