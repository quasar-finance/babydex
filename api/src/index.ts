import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { CacheService } from './services/cache.js';
import { ContractService } from './services/contracts.js';
import { VolumeTracker } from './services/volume-tracker.js';
import { PriceService } from './services/price.js';
import { AMMCalculator } from './services/amm-calculator.js';
import { AMMCalculatorDB } from './services/amm-calculator-db.js';
import { DatabaseService } from './services/database.js';
import { createDatabaseService, getOperationMode } from './config/database.js';
import { errorHandler } from './middleware/error.js';
import coingeckoRoute from './routes/coingecko.js';
import coingeckoDBRoute from './routes/coingecko-db.js';
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
// For Cloudflare Workers, pass env.CACHE_KV as third parameter:
// const cacheService = new CacheService(config.cache.maxSize, config.cache.defaultTTL, env.CACHE_KV);
const cacheService = new CacheService(config.cache.maxSize, config.cache.defaultTTL);
const contractService = new ContractService(config.rpcEndpoint, config.contracts, cacheService);
const volumeTracker = new VolumeTracker(cacheService);
const priceService = new PriceService(cacheService);

// Initialize database service (if configured)
let databaseService: DatabaseService | null = null;
let ammCalculator: AMMCalculator | AMMCalculatorDB;
let operationMode: 'database' | 'contract' | 'hybrid' = 'contract';

// Initialize Hono app with typed context
type AppVariables = {
  contracts: ContractService;
  volumeTracker: VolumeTracker;
  priceService: PriceService;
  ammCalculator: AMMCalculator | AMMCalculatorDB;
  database?: DatabaseService;
  ammCalculatorDB?: AMMCalculatorDB;
};

const app = new Hono<{ Variables: AppVariables }>();

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
  
  // Add database services if available
  if (databaseService) {
    c.set('database', databaseService);
    if (ammCalculator instanceof AMMCalculatorDB) {
      c.set('ammCalculatorDB', ammCalculator);
    }
  }
  
  await next();
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    mode: operationMode,
    config: {
      rpcEndpoint: config.rpcEndpoint,
      database: databaseService ? 'connected' : 'not configured',
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

// Routes will be mounted after initialization

// Start server
const startServer = async () => {
  try {
    // Connect to blockchain
    await contractService.connect();
    // Connected to blockchain RPC
    
    // Initialize database if configured
    operationMode = getOperationMode();
    databaseService = await createDatabaseService();
    
    if (databaseService && (operationMode === 'database' || operationMode === 'hybrid')) {
      ammCalculator = new AMMCalculatorDB(databaseService, contractService);
      // Using database mode
      
      // Mount database-based routes
      app.route('/api/v1', coingeckoDBRoute);
      app.route('/', coingeckoDBRoute);
    } else {
      ammCalculator = new AMMCalculator(contractService);
      // Using contract-only mode
      
      // Mount contract-based routes
      app.route('/api/v1', coingeckoRoute);
      app.route('/', coingeckoRoute);
    }
    
    // Mount pool routes (always available)
    app.route('/api/v1/pools', poolsRoute);
    
    // Start HTTP server
    serve({
      fetch: app.fetch,
      port: config.port
    });
    
    // Server started successfully
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  // Shutting down server
  await contractService.disconnect();
  if (databaseService) {
    await databaseService.disconnect();
  }
  process.exit(0);
});

// Start the server
startServer();