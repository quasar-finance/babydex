export interface TickerResponse {
  ticker_id: string;
  base_currency: string;
  target_currency: string;
  pool_id: string;
  last_price: string;
  base_volume: string;
  target_volume: string;
  liquidity_in_usd: string;
  bid: string;
  ask: string;
  high: string;
  low: string;
}

export interface OrderBookResponse {
  ticker_id: string;
  timestamp: string;
  bids: [string, string][];
  asks: [string, string][];
}

export interface HistoricalTrade {
  trade_id: number;
  price: string;
  base_volume: string;
  target_volume: string;
  trade_timestamp: string;
  type: 'buy' | 'sell';
}

export interface HistoricalTradesResponse {
  buy: HistoricalTrade[];
  sell: HistoricalTrade[];
}

export interface PoolAssetInfo {
  token?: {
    contract_addr: string;
  };
  native_token?: {
    denom: string;
  };
}

export interface Pool24HrStats {
  volume_base: string;
  volume_target: string;
  high_price: string;
  low_price: string;
  price_change_24h: number;
}