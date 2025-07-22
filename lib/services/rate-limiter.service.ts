 import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

class RateLimiterService {
  private ratelimit: Ratelimit;

  constructor() {
    // In a real application, you would use a Redis instance for this.
    // For demonstration, we'll use a mock or a simple in-memory store.
    // This setup assumes Upstash Redis, but can be adapted.
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });

        this.ratelimit = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
            analytics: true
        });
    } else {
        console.warn('Upstash Redis environment variables not set. Rate limiting will not be enforced.');
        // Fallback to a mock limiter that does nothing
        this.ratelimit = {
            limit: async () => ({ success: true, pending: Promise.resolve(), remaining: 10, reset: Date.now() + 10000 }),
        } as any;
    }
  }

  public async limit(identifier: string): Promise<{ success: boolean }> {
    return this.ratelimit.limit(identifier);
  }
}

export const rateLimiterService = new RateLimiterService();