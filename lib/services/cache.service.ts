// lib/services/cache.service.ts

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

class CacheService {
  private cache = new Map<string, CacheEntry<any>>();

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttl: number = 3600000): void { // Default TTL: 1 hour
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  public del(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const cacheService = new CacheService();