import type { Context, Next } from 'hono';

const TTL_SECONDS = 86400; // 24時間

function createRateLimiter(prefix: string, dailyLimit: number) {
  return async function (c: Context<{ Bindings: { RATE_LIMIT: KVNamespace; ENVIRONMENT?: string } }>, next: Next) {
    // 開発環境ではレートリミットをスキップ
    if (c.env.ENVIRONMENT === 'development') {
      await next();
      return;
    }

    const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
    const key = `rate:${prefix}:${ip}`;

    try {
      const current = await c.env.RATE_LIMIT.get(key);
      const count = current ? parseInt(current, 10) : 0;

      if (count >= dailyLimit) {
        return c.json(
          { error: '本日の利用上限に達しました。明日またお試しください。' },
          429,
        );
      }

      await c.env.RATE_LIMIT.put(key, String(count + 1), {
        expirationTtl: TTL_SECONDS,
      });
    } catch (e) {
      // KVエラー時はrate limitをスキップ（サービス継続を優先）
      console.error('Rate limit KV error:', e);
    }

    await next();
  };
}

// generate: 10回/日/IP
export const rateLimitMiddleware = createRateLimiter('generate', 10);

// photo-analyze: 5回/日/IP（Visionコスト高）
export const photoRateLimitMiddleware = createRateLimiter('photo', 5);
