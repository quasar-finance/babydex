export type Cache = {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T, options?: CacheSetOptions): Promise<void>;
  removeItem(key: string): void | Promise<void>;
};

export type CacheSetOptions = {
  ttl: number;
};
