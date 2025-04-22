import type { Currency, WithPrice } from "./currency.js";

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
  assets: WithPrice<Currency>[];
  poolLiquidity: string;
  rewards: [];
};


type AssetInfo = 
  | { 
      token: { 
        contract_addr: string
      } 
    }
  | { 
      native_token: { 
        denom: string 
      } 
    };

type RewardType = 
  | { int: AssetInfo }
  | { 
      ext: {
        info: AssetInfo;
        next_update_ts: number;
      }
    };

export type RewardInfo = {
  reward: RewardType;  // The reward token info and type
  rps: string;        // Decimal256 in Rust maps to string in TypeScript for precision
  index: string;      // Last checkpointed reward per LP token
  orphaned: string;   // Orphaned rewards between incentivization and first stake
}