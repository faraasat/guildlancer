// lib/cache/index.ts
// Simple in-memory caching layer (can be replaced with Redis in production)

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>>;

  constructor() {
    this.store = new Map();
  }

  /**
   * Set a cache entry with TTL (time to live) in seconds
   */
  set<T>(key: string, value: T, ttl: number): void {
    const expiresAt = Date.now() + ttl * 1000;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Get a cache entry if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  /**
   * Delete a cache entry
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Get or set with a factory function
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, ttl);
    return value;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get cache statistics
   */
  stats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      total: this.store.size,
      valid: validEntries,
      expired: expiredEntries,
    };
  }
}

// Singleton instance
const cache = new Cache();

// Auto-cleanup expired entries every 5 minutes
if (typeof window === "undefined") {
  setInterval(() => {
    cache.clearExpired();
  }, 5 * 60 * 1000);
}

export default cache;

/**
 * Cache key generators
 */
export const CacheKeys = {
  aiInsights: (userId: string) => `ai:insights:${userId}`,
  trendingCategories: () => `ai:trending:categories`,
  userProfile: (userId: string) => `user:profile:${userId}`,
  guildProfile: (guildId: string) => `guild:profile:${guildId}`,
  bountyList: (filters: string) => `bounty:list:${filters}`,
  disputeList: (filters: string) => `dispute:list:${filters}`,
  leaderboard: (type: string) => `leaderboard:${type}`,
} as const;

/**
 * Cache TTLs in seconds
 */
export const CacheTTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 60 * 60, // 1 hour
  DAY: 24 * 60 * 60, // 24 hours
} as const;
