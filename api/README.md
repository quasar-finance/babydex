# Astrofork DEX REST API

REST API for Astrofork DEX with CoinGecko integration, built with Hono framework.

## Features

- CoinGecko-compliant endpoints for DEX integration  
- deployment on Cloudflare Workers
- KV cache on Cloudflare Workers
- Support for both XYK and PCL pool types
- Database integration with the Tower babydex indexer

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
For AMM pools, returns information about the liquidity formula used and directs to simulation endpoints.

**Query Parameters:**
- `ticker_id` (required): Trading pair identifier
- `depth` (optional): Order book depth (default: 100)

### 3. `/historical_trades` - Historical Trades
Returns historical trade data for a given trading pair from database.

**Query Parameters:**
- `ticker_id` (required): Trading pair identifier
- `type` (optional): Trade type filter (buy/sell/all)  
- `limit` (optional): Number of trades to return
- `start_time` (optional): Start timestamp (milliseconds)
- `end_time` (optional): End timestamp (milliseconds)

### 4. `/simulate_depth` - Price Depth Simulation
**NEW**: Calculates liquidity needed for specific price movements.

**Query Parameters:**
- `pool_id` (required): Pool contract address
- `percentage` (required): Price change percentage (e.g., 2 or -2 for ±2%)
- `amount_usd` (optional): Target USD amount for depth calculation

## Setup

### Node.js Development

1. Install dependencies:
```bash
cd api
pnpm install
```

2. Configure environment variables:
```bash
# Create .env file with:
SUPABASE_HOST=your-db-host
SUPABASE_PORT=5432
SUPABASE_USER=your-username
SUPABASE_PW=your-password
SUPABASE_DB=your-database
SUPABASE_SSL=require
FACTORY_CONTRACT=your-factory-contract
ROUTER_CONTRACT=your-router-contract
INCENTIVES_CONTRACT=your-incentives-contract
COIN_REGISTRY_CONTRACT=your-coin-registry-contract
API_MODE=hybrid
RPC_ENDPOINT=https://rpc.babylon.nodestake.org
```

3. Run the server:
```bash
# Development
pnpm dev

# Production  
pnpm run build
pnpm start
```

### Cloudflare Workers Deployment
The api is currently deployed directly from the CLI with no CI attached. For now no CI is needed since this should be a 1 off and overhauled anyway on EVM dex deployment

1. **Install Wrangler CLI:**
```bash
npm install -g wrangler
wrangler login
```

2. **Create KV Namespace:**
```bash
wrangler kv:namespace create "CACHE_KV"
wrangler kv:namespace create "CACHE_KV" --preview
# Update wrangler.toml with returned IDs
```

3. **Set Environment Secrets:**
```bash
wrangler secret put SUPABASE_HOST
wrangler secret put SUPABASE_PORT
wrangler secret put SUPABASE_USER
wrangler secret put SUPABASE_PW
wrangler secret put SUPABASE_DB
wrangler secret put SUPABASE_SSL
```

4. **Deploy:**
```bash
pnpm run build
pnpm run deploy
```

## Architecture

### Services

- **CacheService**: Smart caching (LRU for Node.js, KV for Workers)
- **ContractService**: Blockchain contract interactions with caching
- **DatabaseService**: PostgreSQL integration with materialized views
- **AMMCalculatorDB**: Database-backed AMM calculations with real price data
- **PriceService**: Token price fetching from external APIs

### Pool Types

The API supports multiple pool types with full depth simulation:

#### XYK Pools
- **Formula**: x*y=k constant product
- **Depth Calculation**: Mathematical simulation using √(k/target_price)
- **Swap Amount**: Exact calculation for ±2% price movements

#### PCL Pools (Astroport Concentrated Liquidity)  
- **Formula**: Curve CryptoSwap with dynamic parameters
- **Parameters**: amp, gamma, price_scale extracted from contracts
- **Depth Calculation**: Approximation based on curve mathematics
- **Contract Queries**: `config` and `compute_d` messages

### Database Schema

Required materialized views:
- `poolsInV1Cosmos` - Pool metadata and addresses
- `poolBalancesInV1Cosmos` - Current pool reserves  
- `swapsInV1Cosmos` - Historical swap transactions
- `tokenPricesInV1Cosmos` - Token USD price data

## Completed Features

- ✅ Real data integration with PostgreSQL database
- ✅ XYK pool mathematical depth simulation  
- ✅ PCL pool parameter extraction and approximation
- ✅ 32 deprecated pools filtered from all endpoints
- ✅ Cloudflare Workers deployment ready
- ✅ Comprehensive error handling and validation
- ✅ Token decimals handling for accurate calculations

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