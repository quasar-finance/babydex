import { LRUCache } from 'lru-cache';

export interface CacheOptions {
  ttl?: number;
}

export class CacheService {
  private cache: LRUCache<string, any>;
  private defaultTTL: number;

  constructor(maxSize: number = 1000, defaultTTL: number = 60000) {
    this.cache = new LRUCache<string, any>({ 
      max: maxSize,
      ttl: defaultTTL
    });
    this.defaultTTL = defaultTTL;
  }

  async get<T>(key: string): Promise<T | null> {
    const value = this.cache.get(key);
    return value as T || null;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = options?.ttl || this.defaultTTL;
    this.cache.set(key, value, { ttl });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  generateKey(...parts: string[]): string {
    return parts.join(':');
  }
}