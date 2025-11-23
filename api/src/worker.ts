/**
 * Cloudflare Worker entry point for Astrofork DEX API
 * 
 * To deploy:
 * 1. Create a KV namespace: wrangler kv:namespace create "CACHE_KV"
 * 2. Add to wrangler.toml: kv_namespaces = [{ binding = "CACHE_KV", id = "your-namespace-id" }]
 * 3. Deploy: wrangler deploy
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { CacheService } from './services/cache.js';
import { ContractService } from './services/contracts.js';
import { AMMCalculatorDB } from './services/amm-calculator-db.js';
import { DatabaseService } from './services/database.js';
import { createDatabaseService } from './config/database.js';
import { errorHandler } from './middleware/error.js';
import coingeckoDBRoute from './routes/coingecko-db.js';

// Cloudflare Worker Environment
export interface Env {
  CACHE_KV: any; // KVNamespace type not available in this context
  KV_BINDING: any; // Additional KV binding from wrangler.toml
  HYPERDRIVE: any; // Hyperdrive binding for database connections
  
  // Database config (fallback for local dev)
  SUPABASE_HOST: string;
  SUPABASE_PORT: string;
  SUPABASE_USER: string;
  SUPABASE_PW: string;
  SUPABASE_DB: string;
  SUPABASE_SSL: string;
  
  // Contract addresses
  FACTORY_CONTRACT: string;
  ROUTER_CONTRACT: string;
  INCENTIVES_CONTRACT: string;
  COIN_REGISTRY_CONTRACT: string;
  
  // Other config
  RPC_ENDPOINT: string;
  API_MODE: string;
  CACHE_MAX_SIZE: string;
  CACHE_DEFAULT_TTL: string;
}

// Worker context type
type WorkerVariables = {
  contracts: ContractService;
  ammCalculatorDB: AMMCalculatorDB;
  database: DatabaseService;
};

const app = new Hono<{ Bindings: Env; Variables: WorkerVariables }>();

// Global middleware
app.use('*', cors());
app.use('*', errorHandler);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    worker: 'cloudflare'
  });
});

// API Info endpoint
app.get('/', (c) => {
  return c.json({
    name: 'Tower Babydex API',
    version: '1.0.0',
    description: 'REST API for Babydex DEX for CoinGecko integration',
    deployment: 'Cloudflare Workers',
    endpoints: {
      coingecko: {
        '/tickers': 'Get 24hr market data for all pools',
        '/orderbook': 'Get AMM formula explanation',
        '/historical_trades': 'Get historical trade data',
        '/simulate_depth': 'Calculate depth for price movements'
      }
    }
  });
});

// Main request handler
app.use('*', async (c, next) => {
  const env = c.env;
  
  // Configuration from environment
  const config = {
    port: 3000,
    rpcEndpoint: env.RPC_ENDPOINT || 'https://rpc.babylon.nodestake.org',
    contracts: {
      factory: env.FACTORY_CONTRACT || '',
      router: env.ROUTER_CONTRACT || '',
      incentives: env.INCENTIVES_CONTRACT || '',
      coinRegistry: env.COIN_REGISTRY_CONTRACT || ''
    },
    cache: {
      maxSize: parseInt(env.CACHE_MAX_SIZE || '1000'),
      defaultTTL: parseInt(env.CACHE_DEFAULT_TTL || '60000')
    }
  };

  // Initialize services with KV cache (use KV_BINDING from wrangler.toml)
  const kvNamespace = env.KV_BINDING || env.CACHE_KV;
  const cacheService = new CacheService(
    config.cache.maxSize, 
    config.cache.defaultTTL, 
    kvNamespace  // Pass Cloudflare KV namespace
  );
  
  const contractService = new ContractService(
    config.rpcEndpoint, 
    config.contracts, 
    cacheService
  );

  // Initialize database service if configured
  let databaseService: DatabaseService | null = null;
  let ammCalculator: AMMCalculatorDB;

  try {
    // Set environment variables for database config
    process.env.SUPABASE_HOST = env.SUPABASE_HOST;
    process.env.SUPABASE_PORT = env.SUPABASE_PORT;
    process.env.SUPABASE_USER = env.SUPABASE_USER;
    process.env.SUPABASE_PW = env.SUPABASE_PW;
    process.env.SUPABASE_DB = env.SUPABASE_DB;
    process.env.SUPABASE_SSL = env.SUPABASE_SSL;
    process.env.API_MODE = env.API_MODE;

    // Pass Hyperdrive binding if available, otherwise use environment variables
    databaseService = await createDatabaseService(env.HYPERDRIVE);
    
    if (databaseService) {
      ammCalculator = new AMMCalculatorDB(databaseService, contractService);
      
      // Inject services into context
      c.set('contracts', contractService);
      c.set('ammCalculatorDB', ammCalculator);
      c.set('database', databaseService);
    } else {
      throw new Error('Database not configured');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return c.json({ error: 'Database initialization failed' }, 500);
  }

  await next();
});

// Mount CoinGecko routes
app.route('/', coingeckoDBRoute);
app.route('/api/v1', coingeckoDBRoute);

export default app;