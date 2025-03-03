export type AssetType = 'native' | 'erc20' | 'ibc';

export type AssetResponse = {
  contract_addr: string;
  symbol: string;
  denom: string;
  type: AssetType;
  decimals: number;
  price: string;
  name: string;
  logo_URI: string;
}