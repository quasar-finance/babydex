/**
 * Cloudflare KV-based cache service for Workers
 */
export interface CloudflareKVCache {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export interface CacheOptions {
  ttl?: number; // TTL in milliseconds (converted to seconds for KV)
}

export class CloudflareCacheService {
  private kv: CloudflareKVCache;
  private keyPrefix: string;

  constructor(kv: CloudflareKVCache, keyPrefix: string = 'astrofork:') {
    this.kv = kv;
    this.keyPrefix = keyPrefix;
  }

  /**
   * Generate a cache key with prefix
   */
  generateKey(...parts: string[]): string {
    const cleanParts = parts.filter(Boolean).map(part => 
      part.replace(/[^a-zA-Z0-9_-]/g, '_')
    );
    return `${this.keyPrefix}${cleanParts.join(':')}`;
  }

  /**
   * Get value from KV cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.kv.get(key);
      if (!value) return null;
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.warn(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in KV cache with TTL
   */
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const kvOptions: { expirationTtl?: number } = {};
      
      // Convert milliseconds to seconds for KV
      if (options.ttl) {
        kvOptions.expirationTtl = Math.ceil(options.ttl / 1000);
      }
      
      await this.kv.put(key, serialized, kvOptions);
    } catch (error) {
      console.warn(`Cache set error for key ${key}:`, error);
      // Don't throw - cache failures shouldn't break the API
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      // KV doesn't have explicit delete in this interface
      // We'll set with immediate expiration
      await this.kv.put(key, '', { expirationTtl: 1 });
    } catch (error) {
      console.warn(`Cache delete error for key ${key}:`, error);
    }
  }

  /**
   * Clear all cache (not directly supported by KV)
   * This is a no-op since KV doesn't support bulk operations
   */
  async clear(): Promise<void> {
    console.warn('Cache clear not supported with Cloudflare KV');
  }
}