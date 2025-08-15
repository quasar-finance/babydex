import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { CacheService } from './services/cache.js';
import { ContractService } from './services/contracts.js';
import { VolumeTracker } from './services/volume-tracker.js';
import { PriceService } from './services/price.js';
import { AMMCalculator } from './services/amm-calculator.js';
import { errorHandler } from './middleware/error.js';
import coingeckoRoute from './routes/coingecko.js';
import poolsRoute from './routes/pools.js';

// Environment configuration
const config = {
  port: parseInt(process.env.PORT || '3000'),
  rpcEndpoint: process.env.RPC_ENDPOINT || 'https://rpc.babylon.nodestake.org',
  contracts: {
    factory: process.env.FACTORY_CONTRACT || '',
    router: process.env.ROUTER_CONTRACT || '',
    incentives: process.env.INCENTIVES_CONTRACT || '',
    coinRegistry: process.env.COIN_REGISTRY_CONTRACT || ''
  },
  cache: {
    maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000'),
    defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL || '60000')
  }
};

// Initialize services
const cacheService = new CacheService(config.cache.maxSize, config.cache.defaultTTL);
const contractService = new ContractService(config.rpcEndpoint, config.contracts, cacheService);
const volumeTracker = new VolumeTracker(cacheService);
const priceService = new PriceService(cacheService);
const ammCalculator = new AMMCalculator(contractService);

// Initialize Hono app
const app = new Hono();

// Global middleware
app.use('*', cors());
app.use('*', logger());
app.use('*', errorHandler);

// Inject services into context
app.use('*', async (c, next) => {
  c.set('contracts', contractService);
  c.set('volumeTracker', volumeTracker);
  c.set('priceService', priceService);
  c.set('ammCalculator', ammCalculator);
  await next();
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    config: {
      rpcEndpoint: config.rpcEndpoint,
      contracts: Object.keys(config.contracts).reduce((acc, key) => {
        acc[key] = config.contracts[key as keyof typeof config.contracts] ? 'configured' : 'not configured';
        return acc;
      }, {} as Record<string, string>)
    }
  });
});

// API Info endpoint
app.get('/', (c) => {
  return c.json({
    name: 'Astrofork DEX API',
    version: '1.0.0',
    description: 'REST API for Astrofork DEX with CoinGecko integration',
    endpoints: {
      coingecko: {
        '/tickers': 'Get 24hr market data for all pools',
        '/orderbook': 'Get orderbook data (AMM formula-based)',
        '/historical_trades': 'Get historical trade data'
      },
      pools: {
        '/pools': 'Get all pools',
        '/pools/:address': 'Get specific pool details',
        '/pools/:address/simulate': 'Simulate swap'
      }
    },
    documentation: 'https://github.com/yourusername/astrofork-api'
  });
});

// Mount routes
app.route('/api/v1', coingeckoRoute);
app.route('/api/v1/pools', poolsRoute);

// CoinGecko-specific routes at root level (if they expect it)
app.route('/', coingeckoRoute);

// Start server
const startServer = async () => {
  try {
    // Connect to blockchain
    await contractService.connect();
    console.log('Connected to blockchain RPC');
    
    // Start HTTP server
    serve({
      fetch: app.fetch,
      port: config.port
    });
    
    console.log(`Astrofork DEX API server running on port ${config.port}`);
    console.log(`CoinGecko endpoints available at:`);
    console.log(`   - http://localhost:${config.port}/tickers`);
    console.log(`   - http://localhost:${config.port}/orderbook`);
    console.log(`   - http://localhost:${config.port}/historical_trades`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  await contractService.disconnect();
  process.exit(0);
});

// Start the server
startServer();