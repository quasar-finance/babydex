import { CacheService } from './cache.js';

interface VolumeData {
  timestamp: number;
  baseVolume: number;
  targetVolume: number;
  price: number;
}

interface PoolStats {
  volume24h_base: number;
  volume24h_target: number;
  high24h: number;
  low24h: number;
  trades: VolumeData[];
}

export class VolumeTracker {
  private cache: CacheService;
  private readonly VOLUME_TTL = 86400000; // 24 hours in ms
  
  constructor(cache: CacheService) {
    this.cache = cache;
  }

  async recordTrade(
    poolId: string,
    baseVolume: number,
    targetVolume: number,
    price: number
  ): Promise<void> {
    const stats = await this.getPoolStats(poolId);
    const now = Date.now();
    
    // Add new trade
    stats.trades.push({
      timestamp: now,
      baseVolume,
      targetVolume,
      price
    });
    
    // Remove trades older than 24h
    const cutoff = now - this.VOLUME_TTL;
    stats.trades = stats.trades.filter(t => t.timestamp > cutoff);
    
    // Recalculate 24h stats
    stats.volume24h_base = stats.trades.reduce((sum, t) => sum + t.baseVolume, 0);
    stats.volume24h_target = stats.trades.reduce((sum, t) => sum + t.targetVolume, 0);
    
    const prices = stats.trades.map(t => t.price);
    stats.high24h = Math.max(...prices, price);
    stats.low24h = Math.min(...prices, price);
    
    const cacheKey = this.cache.generateKey('pool-stats', poolId);
    await this.cache.set(cacheKey, stats, { ttl: this.VOLUME_TTL });
  }

  async getPoolStats(poolId: string): Promise<PoolStats> {
    const cacheKey = this.cache.generateKey('pool-stats', poolId);
    const cached = await this.cache.get<PoolStats>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    // Initialize empty stats
    return {
      volume24h_base: 0,
      volume24h_target: 0,
      high24h: 0,
      low24h: 0,
      trades: []
    };
  }

  async get24HourVolume(poolId: string): Promise<{
    base: number;
    target: number;
    high: number;
    low: number;
  }> {
    const stats = await this.getPoolStats(poolId);
    
    return {
      base: stats.volume24h_base,
      target: stats.volume24h_target,
      high: stats.high24h,
      low: stats.low24h
    };
  }

  async getHistoricalTrades(
    poolId: string,
    limit?: number,
    startTime?: number,
    endTime?: number
  ): Promise<VolumeData[]> {
    const stats = await this.getPoolStats(poolId);
    let trades = [...stats.trades];
    
    if (startTime) {
      trades = trades.filter(t => t.timestamp >= startTime);
    }
    
    if (endTime) {
      trades = trades.filter(t => t.timestamp <= endTime);
    }
    
    // Sort by timestamp descending
    trades.sort((a, b) => b.timestamp - a.timestamp);
    
    if (limit && limit > 0) {
      trades = trades.slice(0, limit);
    }
    
    return trades;
  }
}