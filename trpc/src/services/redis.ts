import { redis } from "../config/redis.js";

import type { Cache, CacheSetOptions } from "@towerfi/types";
import { deserialize, serialize } from "./superjson.js";

export function createRedisService(): Cache {
  async function getItem<T>(key: string): Promise<T | null> {
    const e = await redis.get(key);
    return e ? (deserialize(e) as T) : null;
  }

  async function setItem<T>(
    key: string,
    value: T,
    options?: CacheSetOptions
  ): Promise<void> {
    await redis.set(key, serialize(value), { EX: options?.ttl });
  }

  async function removeItem(key: string): Promise<void> {
    await redis.del(key);
  }

  return {
    getItem,
    setItem,
    removeItem,
  };
}
