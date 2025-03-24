import type { BaseCurrency, WithPrice } from "./currency.js";

export type PoolType = "concentrated" | "xyk";

export type PoolInfo = {
  name: string;
  poolAddress: string;
  lpAddress: string;
  poolType: PoolType;
  assets: WithPrice<BaseCurrency>[];
  poolLiquidity: string;
  rewards: [];
};
