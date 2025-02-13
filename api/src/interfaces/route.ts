export interface Hop {
  address: string;
  token_in: string;
  token_out: string;
  amount_out: string;
  slippage: number;
}

export interface Route {
  hops: Array<Hop>
}