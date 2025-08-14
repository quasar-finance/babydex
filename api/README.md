# Astrofork DEX REST API

REST API for Astrofork DEX with CoinGecko integration, built with Hono framework.

## Features

- ✅ CoinGecko-compliant endpoints for DEX integration
- ✅ Built-in caching with LRU cache
- ✅ Support for both XYK and PCL pool types
- ✅ 24-hour volume tracking
- ✅ Historical trade data
- ✅ Real-time price and liquidity data

## CoinGecko Endpoints

### 1. `/tickers` - Market Info
Returns 24-hour pricing and volume information for all market pairs.

**Response fields:**
- `ticker_id`: Pool identifier (base_target format)
- `base_currency`: Base token address/denom
- `target_currency`: Target token address/denom
- `pool_id`: Pool contract address
- `last_price`: Current price
- `base_volume`: 24h volume in base token
- `target_volume`: 24h volume in target token
- `liquidity_in_usd`: Total pool liquidity in USD
- `bid`: Current bid price
- `ask`: Current ask price
- `high`: 24h high price
- `low`: 24h low price

### 2. `/orderbook` - Order Book
For AMM pools, returns information about the liquidity formula used.

**Query Parameters:**
- `ticker_id` (required): Trading pair identifier
- `depth` (optional): Order book depth (default: 100)

### 3. `/historical_trades` - Historical Trades
Returns historical trade data for a given trading pair.

**Query Parameters:**
- `ticker_id` (required): Trading pair identifier
- `type` (optional): Trade type filter (buy/sell/all)
- `limit` (optional): Number of trades to return
- `start_time` (optional): Start timestamp (milliseconds)
- `end_time` (optional): End timestamp (milliseconds)

## Setup

1. Install dependencies:
```bash
cd api
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your contract addresses and RPC endpoint
```

3. Run the server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Architecture

### Services

- **CacheService**: LRU cache for API responses
- **ContractService**: Blockchain contract interactions
- **VolumeTracker**: 24-hour volume and trade tracking
- **PriceService**: Token price fetching
- **AMMCalculator**: AMM-specific calculations (TODO: Implement pool-specific formulas)

### Pool Types

The API supports multiple pool types:
- **XYK Pools**: Standard x*y=k constant product pools
- **PCL Pools**: Passive Concentrated Liquidity pools

## TODO

- [ ] Implement XYK pool formula in AMMCalculator
- [ ] Implement PCL pool formula in AMMCalculator
- [ ] Add token decimals fetching from registry
- [ ] Implement actual trade detection from blockchain events
- [ ] Add WebSocket support for real-time updates
- [ ] Implement rate limiting
- [ ] Add comprehensive error handling
- [ ] Add unit and integration tests

## Contract Integration

The API requires the following deployed contracts:
- Factory Contract: Pool creation and management
- Router Contract: Multi-hop swaps
- Incentives Contract: Reward distribution
- Coin Registry: Token metadata

## Development

### Adding New Pool Types

1. Update `AMMCalculator` with new pool formulas
2. Add pool type detection in contract service
3. Update ticker generation logic if needed

### Extending Cache

The cache service uses LRU (Least Recently Used) strategy. To adjust cache behavior:
- Modify `CACHE_MAX_SIZE` for cache capacity
- Adjust `CACHE_DEFAULT_TTL` for default expiration
- Use custom TTL per endpoint as needed

## License

MIT