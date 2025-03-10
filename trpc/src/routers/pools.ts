import { createCallerFactory, createTRPCPublicProcedure, createTRPCRouter } from "../config.js";

import { appRouter } from "../router.js";

import type { BaseCurrency, PairInfo, PoolResponse } from "@towerfi/types";

export const poolsRouter = createTRPCRouter({
  getPools: createTRPCPublicProcedure.query(async ({ ctx }) => {
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

        const t1: BaseCurrency = await (async () => {
          if ("token" in token1) {
            return await caller.local.assets.getAsset({
              denom: "",
            });
          }

          return await caller.local.assets.getAsset({
            denom: token1.native_token.denom,
          });
        })();

        const t2: BaseCurrency = await (async () => {
          if ("token" in token2) {
            return await caller.local.assets.getAsset({
              denom: "",
            });
          }

          return await caller.local.assets.getAsset({
            denom: token2.native_token.denom,
          });
        })();

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
