import type { BaseCurrency, WithPrice } from "./currency.js";

export type PoolType = "concentrated";

export type PoolInfo = {
  name: `${string} / ${string}`;
  poolAddress: string;
  lpAddress: string;
  poolType: PoolType;
  assets: WithPrice<BaseCurrency>[];
  poolLiquidity: number;
  rewards: [];
};
