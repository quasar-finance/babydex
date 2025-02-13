interface PoolAsset {
  address: string,
  symbol: string,
  name: string,
  reserve: string;
}

export interface Pool {
  address: string;
  token0: PoolAsset;
  token1: PoolAsset;
  fee_tier: number;
}