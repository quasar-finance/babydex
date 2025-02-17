import { SetOptions } from 'redis';
import { redis } from '~/loaders';

export default class RedisService {
  async get<T>(key: string): Promise<T | null> {
    const e = await redis.get(key);
    return e ? (JSON.parse(e) as T) : null;
  }

  async set(key: string, data: unknown, options?: SetOptions): Promise<void> {
    const serializeData = JSON.stringify(data);
    await redis.set(key, serializeData, options);
  }

  async getCoin(coin: string): Promise<{ usd: number; eur: number } | null> {
    return await this.get<{ usd: number; eur: number }>(`cg_${coin}`);
  }

  async setCoin(coin: string, data: unknown): Promise<void> {
    return await this.set(`cg_${coin}`, data, { EX: 60 });
  }
}
