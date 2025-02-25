export type AssetType = 'native' | 'erc20' | 'ibc';

export type Asset = {
  contract_addr: Addr;
  symbol: string;
  denom: string;
  type: AssetType;
  decimals: number;
  price: string;
  name: string;
  logo_URI: string;
}

export type Addr = string;

export type AssetInfo = Token | NativeToken;

export type Token = {
  token: {
    contract_addr: Addr;
  }
}

export type NativeToken = {
  native_token: {
    denom: string;
  };
}

export interface CoinResponse {
  decimals: number;
  denom: string;
}