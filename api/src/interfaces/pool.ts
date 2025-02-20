import { Addr, AssetInfo } from '~/interfaces/asset';

export type PoolAsset = {
  contract_addr: string;
  symbol: string;
  name: string;
  reserve: string;
}

export type Pool = {
  contract_addr: string;
  token0: PoolAsset;
  token1: PoolAsset;
  fee_tier: number;
}

export type PairInfo = {
  asset_infos: AssetInfo[];
  contract_addr: Addr;
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
