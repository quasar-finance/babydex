export interface PoolAsset {
  contract_addr: string;
  symbol: string;
  name: string;
  reserve: number;
}

export interface PoolResponse {
  contract_addr: string;
  token0: PoolAsset;
  token1: PoolAsset;
  fee_tier: number;
  liquidity_token: string;
}