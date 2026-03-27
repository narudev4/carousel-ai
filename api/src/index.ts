import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { generateRoute } from './routes/generate';
import { photoRoute } from './routes/photo';
import { rateLimitMiddleware, photoRateLimitMiddleware } from './middleware/rateLimit';

type Bindings = {
  ANTHROPIC_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  RATE_LIMIT: KVNamespace;
  ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS: 完全一致ホワイトリスト
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:8787',
  'https://carousel-ai.pages.dev',
];

app.use('/*', cors({
  origin: (origin) => {
    if (!origin) return '*';
    return ALLOWED_ORIGINS.includes(origin) ? origin : undefined;
  },
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

app.get('/', (c) => c.json({ status: 'ok', service: 'carousel-ai-api' }));

// Rate limits
app.use('/api/generate', rateLimitMiddleware);
app.use('/api/photo-analyze', photoRateLimitMiddleware);

// Routes
app.route('/api', generateRoute);
app.route('/api', photoRoute);

export default app;
