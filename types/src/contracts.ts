export type Uint128 = string;
export type Addr = string;

export type PoolResponse = {
  assets: Asset[];
  total_share: Uint128;
};

export type ConfigResponse = {
  block_time_last: number;
  factory_addr: Addr;
  owner: Addr;
  params?: string | null;
};

export type CumulativePricesResponse = {
  assets: Asset[];
  cumulative_prices: [AssetInfo, AssetInfo, Uint128][];
  total_share: Uint128;
};

export type Asset = {
  amount: Uint128;
  info: AssetInfo;
};

export interface PairInfo {
  asset_infos: AssetInfo[];
  contract_addr: Addr;
  liquidity_token: string;
  pair_type: PairType;
}

export type PairType =
  | {
      xyk: {};
    }
  | {
      concentrated: {};
    }
  | {
      custom: string;
    };

export type AssetInfo =
  | {
      token: {
        contract_addr: Addr;
      };
    }
  | {
      native_token: {
        denom: string;
      };
    };
