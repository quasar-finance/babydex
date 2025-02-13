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
}
