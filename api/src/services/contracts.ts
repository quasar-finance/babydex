import { createPublicClient, http } from 'cosmi';
import type { PublicClient } from 'cosmi';
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
  private client: PublicClient;
  private cache: CacheService;
  private contracts: ContractConfig;

  constructor(
    rpcEndpoint: string,
    contracts: ContractConfig,
    cache: CacheService
  ) {
    this.client = createPublicClient({
      transport: http(rpcEndpoint)
    });
    this.contracts = contracts;
    this.cache = cache;
  }

  async connect(): Promise<void> {
    // No explicit connection needed with cosmi's createPublicClient
    // It connects on first request
  }

  async disconnect(): Promise<void> {
    // No explicit disconnect needed
  }

  async getPools(limit: number = 100, startAfter?: string): Promise<PoolInfo[]> {
    const cacheKey = this.cache.generateKey('pools', String(limit), startAfter || 'all');
    
    const cached = await this.cache.get<PoolInfo[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const pools = await this.client.queryContractSmart({
      address: this.contracts.factory,
      msg: {
        pairs: { limit, start_after: startAfter }
      }
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

    const pool = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        pair: {}
      }
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

    const shares = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        pool: {}
      }
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

    const config = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        config: {}
      }
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

    const simulation = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        simulation: {
          offer_asset: offerAsset,
          ask_asset_info: askAssetInfo
        }
      }
    });

    await this.cache.set(cacheKey, simulation, { ttl: 3000 });
    return simulation;
  }

  async reverseSimulateSwap(
    poolAddress: string,
    askAsset: any,
    offerAssetInfo?: any
  ): Promise<any> {
    const cacheKey = this.cache.generateKey(
      'reverse-simulate',
      poolAddress,
      JSON.stringify(askAsset),
      JSON.stringify(offerAssetInfo || {})
    );
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const simulation = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        reverse_simulation: {
          ask_asset: askAsset,
          offer_asset_info: offerAssetInfo
        }
      }
    });

    await this.cache.set(cacheKey, simulation, { ttl: 3000 });
    return simulation;
  }

  async simulateProvide(
    poolAddress: string,
    assets: any[],
    slippage?: string
  ): Promise<any> {
    const cacheKey = this.cache.generateKey(
      'simulate-provide',
      poolAddress,
      JSON.stringify(assets),
      slippage || 'default'
    );
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const simulation = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        simulate_provide: {
          assets,
          slippage_tolerance: slippage
        }
      }
    });

    await this.cache.set(cacheKey, simulation, { ttl: 5000 });
    return simulation;
  }

  async simulateWithdraw(
    poolAddress: string,
    lpAmount: string
  ): Promise<any> {
    const cacheKey = this.cache.generateKey(
      'simulate-withdraw',
      poolAddress,
      lpAmount
    );
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const simulation = await this.client.queryContractSmart({
      address: poolAddress,
      msg: {
        simulate_withdraw: {
          lp_amount: lpAmount
        }
      }
    });

    await this.cache.set(cacheKey, simulation, { ttl: 5000 });
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

      const incentives = await this.client.queryContractSmart({
        address: this.contracts.incentives,
        msg
      });

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

    const simulation = await this.client.queryContractSmart({
      address: this.contracts.router,
      msg: {
        simulate_swap_operations: {
          offer_amount: offerAmount,
          operations
        }
      }
    });

    await this.cache.set(cacheKey, simulation, { ttl: 3000 });
    return simulation;
  }

  /**
   * Get token decimals from native coin registry or CW20 contract
   */
  async getTokenDecimals(assetInfo: PoolAssetInfo): Promise<number> {
    let cacheKey: string;
    let tokenId: string;
    
    if (assetInfo.native_token) {
      tokenId = assetInfo.native_token.denom;
      cacheKey = this.cache.generateKey('decimals-native', tokenId);
    } else if (assetInfo.token) {
      tokenId = assetInfo.token.contract_addr;
      cacheKey = this.cache.generateKey('decimals-cw20', tokenId);
    } else {
      return 6; // Default fallback
    }

    // Check cache first (long TTL since decimals rarely change)
    const cached = await this.cache.get<number>(cacheKey);
    if (cached !== null) {
      return cached;
    }

    try {
      let decimals: number;

      if (assetInfo.native_token) {
        // Query native coin registry
        const result = await this.client.queryContractSmart({
          address: this.contracts.coinRegistry,
          msg: {
            native_token: { denom: assetInfo.native_token.denom }
          }
        });
        decimals = result.decimals || 6;
      } else if (assetInfo.token) {
        // Query CW20 token contract
        const result = await this.client.queryContractSmart({
          address: assetInfo.token.contract_addr,
          msg: {
            token_info: {}
          }
        });
        decimals = result.decimals || 6;
      } else {
        decimals = 6; // Default fallback
      }

      // Cache with long TTL (1 hour) since decimals rarely change
      await this.cache.set(cacheKey, decimals, { ttl: 3600000 });
      return decimals;

    } catch (error) {
      console.error(`Failed to fetch decimals for ${tokenId}, using default (6):`, (error as Error).message);
      // Cache the default value for a shorter time
      await this.cache.set(cacheKey, 6, { ttl: 300000 }); // 5 minutes
      return 6;
    }
  }

  /**
   * Batch fetch decimals for multiple tokens
   */
  async getBatchTokenDecimals(assetInfos: PoolAssetInfo[]): Promise<Map<string, number>> {
    const decimalsMap = new Map<string, number>();
    
    // Fetch all decimals in parallel
    const decimalsPromises = assetInfos.map(async (assetInfo) => {
      const decimals = await this.getTokenDecimals(assetInfo);
      const tokenId = assetInfo.native_token?.denom || assetInfo.token?.contract_addr || '';
      return { tokenId, decimals };
    });

    const results = await Promise.all(decimalsPromises);
    
    for (const { tokenId, decimals } of results) {
      if (tokenId) {
        decimalsMap.set(tokenId, decimals);
      }
    }

    return decimalsMap;
  }

  /**
   * Get PCL pool configuration (contains amp, gamma, price_scale, fees)
   */
  async getPCLPoolConfig(poolAddress: string): Promise<any> {
    const cacheKey = this.cache.generateKey('pcl-pool-config', poolAddress);
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const config = await this.client.queryContractSmart({
        address: poolAddress,
        msg: {
          config: {}
        }
      });

      await this.cache.set(cacheKey, config, { ttl: 60000 }); // Cache for 1 minute
      return config;
    } catch (error) {
      console.error(`Failed to get PCL pool config for ${poolAddress}:`, error);
      return null;
    }
  }

  /**
   * Get PCL pool current D invariant
   */
  async getPCLPoolD(poolAddress: string): Promise<any> {
    const cacheKey = this.cache.generateKey('pcl-pool-d', poolAddress);
    
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const d = await this.client.queryContractSmart({
        address: poolAddress,
        msg: {
          compute_d: {}
        }
      });

      await this.cache.set(cacheKey, d, { ttl: 10000 }); // Cache for 10 seconds (more volatile)
      return d;
    } catch (error) {
      console.error(`Failed to get PCL pool D for ${poolAddress}:`, error);
      return null;
    }
  }
}