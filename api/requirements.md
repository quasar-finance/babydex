# CoinGecko API Integration Requirements for AMM DEX

## Introduction

This document outlines the API endpoint specifications required for integrating our AMM DEX with CoinGecko. Our implementation focuses on providing accurate market data for XYK pools and Astroport PCL pools.

## General Requirements

- **Public Access**: All endpoints must be publicly accessible without authentication
- **Rate Limits**: Support reasonable rate limits for minutely queries
- **Format**: All responses in JSON format
- **Data Verification**: Display key metrics on web interface for data verification

## Required Endpoints

### 1. `/tickers` - Market Information

Provides 24-hour pricing and volume information for all trading pairs.

**Endpoint**: `GET /api/coingecko/tickers`

**Response Format**:
```json
[
  {
    "ticker_id": "0x..._0x...",
    "base_currency": "SYMBOL1",
    "target_currency": "SYMBOL2", 
    "pool_id": "0x...",
    "last_price": "1.234",
    "base_volume": "10000.0",
    "target_volume": "12340.0",
    "liquidity_in_usd": "100000.0",
    "high": "1.250",
    "low": "1.220"
  }
]
```

**Field Descriptions**:

| Field | Type | Status | Description |
|-------|------|--------|-------------|
| ticker_id | string | Mandatory | Concatenated contract addresses with underscore delimiter |
| base_currency | string | Mandatory | Token symbol from database mapping |
| target_currency | string | Mandatory | Token symbol from database mapping |
| pool_id | string | Mandatory | Pool contract address |
| last_price | decimal | Mandatory | Current price (1 base = X target) |
| base_volume | decimal | Mandatory | 24h volume in base token |
| target_volume | decimal | Mandatory | 24h volume in target token |
| liquidity_in_usd | decimal | Mandatory | Total pool liquidity in USD |
| high | decimal | Recommended | 24h highest price |
| low | decimal | Recommended | 24h lowest price |

**Notes**:
- Token symbols are mapped from contract addresses using the tokens table in database
- Bid/ask prices omitted as they're not standard for AMM DEXes

### 2. Depth Calculation (No separate endpoint required)

Since we're an AMM DEX, we don't provide a traditional `/orderbook` endpoint. Instead, depth is calculated using pool formulas.

**Depth Calculation Methods**:

1. **XYK Pools**: Standard constant product formula (x * y = k)
2. **Astroport PCL Pools**: 
   - Option A: Use existing Rust implementation formulas
   - Option B: Simulate swaps for 2% of pool liquidity to determine +2%/-2% depth

**Formula Documentation**: Must provide CoinGecko with the exact formula or simulation method used for depth calculations.

### 3. `/historical_trades` - Historical Trade Data

Returns completed trades for a given trading pair.

**Endpoint**: `GET /api/coingecko/historical_trades`

**Parameters**:
| Parameter | Type | Status | Description |
|-----------|------|--------|-------------|
| ticker_id | string | Mandatory | Pair identifier (e.g., "0x..._0x...") |
| type | string | Mandatory | Trade type: "buy" or "sell" |
| limit | integer | Recommended | Number of trades to return (0 = all) |
| start_time | timestamp | Recommended | Start time for query range |
| end_time | timestamp | Recommended | End time for query range |

**Response Format**:
```json
{
  "buy": [
    {
      "trade_id": 1234567,
      "price": "1.234",
      "base_volume": "100.0",
      "target_volume": "123.4",
      "trade_timestamp": "1700050000",
      "type": "buy"
    }
  ],
  "sell": [
    {
      "trade_id": 1234568,
      "price": "1.233",
      "base_volume": "50.0",
      "target_volume": "61.65",
      "trade_timestamp": "1700050100",
      "type": "sell"
    }
  ]
}
```

**Field Descriptions**:

| Field | Type | Status | Description |
|-------|------|--------|-------------|
| trade_id | integer | Mandatory | Unique trade identifier (not unix timestamp) |
| price | decimal | Mandatory | Execution price |
| base_volume | decimal | Mandatory | Volume in base token |
| target_volume | decimal | Mandatory | Volume in target token |
| trade_timestamp | timestamp | Mandatory | Unix timestamp in milliseconds |
| type | string | Mandatory | "buy" or "sell" |

## Implementation Notes

### Database Requirements
- **Tokens Table**: Must maintain mapping of contract addresses to token symbols
- **24h Statistics**: Track rolling 24-hour volume, high, and low prices
- **Trade History**: Store historical trades with unique IDs

### Pool Types
- **XYK Pools**: Standard constant product AMM
- **Astroport PCL Pools**: Concentrated liquidity pools with custom pricing curves

### Data Accuracy
- All API data must match values displayed on the web interface
- Prices should be calculated using the same formulas as the smart contracts
- Volume tracking must be single-sided (not double-counted)

## Example Implementations

Reference DEX implementations:
- https://api.hyperliquid.xyz/aggregator/v1/spot/tickers
- https://api.cellana.finance/api/v1/tool/tickers

## Next Steps

1. Implement the three endpoints according to specifications
2. Document the depth calculation formula for CoinGecko
3. Set up monitoring for API uptime and data accuracy
4. Submit application via CoinGecko Application Form
5. Whitelist CoinGecko IP addresses if rate limiting is implemented