import { CosmWasmClient } from 'cosmi';
import { CacheService } from './cache.js';
import { PoolAssetInfo } from '../types/coingecko.js';

export interface ContractConfig {
  factory: string;
  router: string;
  incentives: string;
  coinRegistry: string;
}

export interface PoolInfo {
  contract_addr: string;
  liquidity_token: string;
  asset_infos: PoolAssetInfo[];
  pair_type: any;
}

export interface PoolAsset {
  info: PoolAssetInfo;
  amount: string;
}

export interface PoolResponse {
  assets: PoolAsset[];
  total_share: string;
}

export class ContractService {
  private client: CosmWasmClient;
  private cache: CacheService;
  private contracts: ContractConfig;

  constructor(
    rpcEndpoint: string,
    contracts: ContractConfig,
    cache: CacheService
  ) {
    this.client = new CosmWasmClient(rpcEndpoint);
    this.contracts = contracts;
    this.cache = cache;
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    this.client.disconnect();
  }

  async getPools(limit: number = 100, startAfter?: string): Promise<PoolInfo[]> {
    const cacheKey = this.cache.generateKey('pools', String(limit), startAfter || 'all');
    
    const cached = await this.cache.get<PoolInfo[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const pools = await this.client.queryContractSmart(this.contracts.factory, {
      pairs: { limit, start_after: startAfter }
    });

    await this.cache.set(cacheKey, pools, { ttl: 30000 });
    return pools;
  }

  async getPool(poolAddress: string): Promise<any> {
    const cacheKey = this.cache.generateKey('pool', poolAddress);
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const pool = await this.client.queryContractSmart(poolAddress, {
      pair: {}
    });

    await this.cache.set(cacheKey, pool, { ttl: 10000 });
    return pool;
  }

  async getPoolShares(poolAddress: string): Promise<PoolResponse> {
    const cacheKey = this.cache.generateKey('pool-shares', poolAddress);
    
    const cached = await this.cache.get<PoolResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    const shares = await this.client.queryContractSmart(poolAddress, {
      pool: {}
    });

    await this.cache.set(cacheKey, shares, { ttl: 5000 });
    return shares;
  }

  async getPoolConfig(poolAddress: string): Promise<any> {
    const cacheKey = this.cache.generateKey('pool-config', poolAddress);
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const config = await this.client.queryContractSmart(poolAddress, {
      config: {}
    });

    await this.cache.set(cacheKey, config, { ttl: 60000 });
    return config;
  }

  async simulateSwap(
    poolAddress: string,
    offerAsset: any,
    askAssetInfo?: any
  ): Promise<any> {
    const cacheKey = this.cache.generateKey(
      'simulate-swap',
      poolAddress,
      JSON.stringify(offerAsset),
      JSON.stringify(askAssetInfo || {})
    );
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const simulation = await this.client.queryContractSmart(poolAddress, {
      simulation: {
        offer_asset: offerAsset,
        ask_asset_info: askAssetInfo
      }
    });

    await this.cache.set(cacheKey, simulation, { ttl: 3000 });
    return simulation;
  }

  async getIncentives(lpToken: string, user?: string): Promise<any[]> {
    const cacheKey = this.cache.generateKey('incentives', lpToken, user || 'all');
    
    const cached = await this.cache.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const msg = user 
        ? { pending_rewards: { lp_token: lpToken, user } }
        : { pool_info: { lp_token: lpToken } };

      const incentives = await this.client.queryContractSmart(
        this.contracts.incentives,
        msg
      );

      await this.cache.set(cacheKey, incentives, { ttl: 10000 });
      return incentives;
    } catch {
      return [];
    }
  }

  async getRouterSimulation(
    offerAmount: string,
    operations: any[]
  ): Promise<any> {
    const cacheKey = this.cache.generateKey(
      'router-sim',
      offerAmount,
      JSON.stringify(operations)
    );
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const simulation = await this.client.queryContractSmart(this.contracts.router, {
      simulate_swap_operations: {
        offer_amount: offerAmount,
        operations
      }
    });

    await this.cache.set(cacheKey, simulation, { ttl: 3000 });
    return simulation;
  }
}