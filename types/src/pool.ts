import type { BaseCurrency, WithPrice } from "./currency.js";

export type PoolType = "concentrated" | "xyk";

export type PoolInfo = {
  name: string;
  config: {
    block_time_last: number;
    params: {
      amp: string;
      gamma: string;
      mid_fee: string;
      out_fee: string;
      fee_gamma: string;
      repeg_profit_threshold: string;
      min_price_scale_delta: string;
      price_scale: string;
      ma_half_time: number;
      fee_share: null;
    };
    owner: string;
    factory_addr: string;
  };
  poolAddress: string;
  lpAddress: string;
  poolType: PoolType;
  assets: WithPrice<BaseCurrency>[];
  poolLiquidity: string;
  rewards: [];
};
