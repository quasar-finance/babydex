export type AssetInfo = Token | NativeToken;

export type Token = {
  token: {
    contract_addr: string;
  }
}

export type NativeToken = {
  native_token: {
    denom: string;
  };
}

export interface PairInfo {
  asset_infos: AssetInfo[];
  contract_addr: string;
  liquidity_token: string;
  pair_type: PairType;
}

export type PairType = {
  xyk: {};
} | {
  concentrated: {};
} | {
  custom: string;
}

export interface CoinResponse {
  decimals: number;
  denom: string;
}

export type ContractAsset = {
  info: AssetInfo;
  amount: number;
}

export interface ContractPoolResponse {
  assets: ContractAsset[];
  total_share: number;
}

export interface ContractConfigResponse {
  /// Last timestamp when the cumulative prices in the pool were updated
  block_time_last: number,
  /// The pool's parameters
  params?: string,
  /// The contract owner
  owner: string,
  /// The factory contract address
  factory_addr: string,
}

interface FeeShareConfig {
  /// The fee shared with the address
  bps: number;
  /// The share is sent to this address on every swap
  recipient: string;
}

export interface ContractXYKPoolParams {
  /// The config for swap fee sharing
  fee_share?: FeeShareConfig,
}

export interface ContractConcentratedPoolParams {
  /// Amplification coefficient affects trades close to price_scale
  amp: number;
  /// Affects how gradual the curve changes from constant sum to constant product
  /// as price moves away from price scale. Low values mean more gradual.
  gamma: number;
  /// The minimum fee, charged when pool is fully balanced
  mid_fee: number;
  /// The maximum fee, charged when pool is imbalanced
  out_fee: number;
  /// Parameter that defines how gradual the fee changes from fee_mid to fee_out
  /// based on distance from price_scale.
  fee_gamma: number;
  /// Minimum profit before initiating a new repeg
  repeg_profit_threshold: number;
  /// Minimum amount to change price_scale when repegging.
  min_price_scale_delta: number;
  /// 1 x\[0] = price_scale * x\[1].
  price_scale: number;
  /// Half-time used for calculating the price oracle.
  ma_half_time: number;
  /// The config for swap fee sharing
  fee_share?: FeeShareConfig;
}