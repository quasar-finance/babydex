export interface CacheOptions {
  ttl?: number;
}

export interface CloudflareKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

export class CacheService {
  private kv?: CloudflareKV;
  private defaultTTL: number;
  private keyPrefix: string;

  constructor(maxSize: number = 1000, defaultTTL: number = 60000, kv?: CloudflareKV) {
    this.kv = kv;
    this.defaultTTL = defaultTTL;
    this.keyPrefix = 'astrofork:';
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.kv) return null;
    
    try {
      const value = await this.kv.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      console.warn(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    if (!this.kv) return;
    
    try {
      const ttl = options?.ttl || this.defaultTTL;
      const serialized = JSON.stringify(value);
      const kvOptions: { expirationTtl?: number } = {};
      
      // Convert milliseconds to seconds for KV
      if (ttl) {
        kvOptions.expirationTtl = Math.ceil(ttl / 1000);
      }
      
      await this.kv.put(key, serialized, kvOptions);
    } catch (error) {
      console.warn(`Cache set error for key ${key}:`, error);
      // Don't throw - cache failures shouldn't break the API
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.kv) return;
    
    try {
      // KV doesn't have explicit delete, set with immediate expiration
      await this.kv.put(key, '', { expirationTtl: 1 });
    } catch (error) {
      console.warn(`Cache delete error for key ${key}:`, error);
    }
  }

  async has(key: string): Promise<boolean> {
    if (!this.kv) return false;
    
    try {
      const value = await this.kv.get(key);
      return value !== null;
    } catch (error) {
      console.warn(`Cache has error for key ${key}:`, error);
      return false;
    }
  }

  clear(): void {
    console.warn('Cache clear not supported with Cloudflare KV');
  }

  generateKey(...parts: string[]): string {
    const cleanParts = parts.filter(Boolean).map(part => 
      part.replace(/[^a-zA-Z0-9_-]/g, '_')
    );
    return `${this.keyPrefix}${cleanParts.join(':')}`;
  }
}