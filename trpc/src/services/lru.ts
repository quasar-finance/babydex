import { LRUCache } from "lru-cache";
import { deserialize, serialize } from "./superjson.js";

import type { Cache, CacheSetOptions } from "@towerfi/types";

export function createLruService(): Cache {
  const lruInstance = new LRUCache<string, string>({ max: 1000 });

  async function getItem<T>(key: string): Promise<T | null> {
    const e = lruInstance.get(key);
    return e ? (deserialize(e) as T) : null;
  }

  async function setItem<T>(
    key: string,
    value: T,
    options?: CacheSetOptions
  ): Promise<void> {
    lruInstance.set(key, serialize(value), { ttl: options?.ttl });
  }

  async function removeItem(key: string): Promise<void> {
    lruInstance.delete(key);
  }

  return {
    getItem,
    setItem,
    removeItem,
  };
}
