import { Hono } from 'hono';
import OpenAI from 'openai';
import { buildPhotoSystemPrompt, buildSystemPrompt, buildUserPrompt } from '../lib/prompts';
import { parseAIResponse } from '../lib/json-utils';
import type { PhotoAnalyzeRequest, PhotoVisionResult, PhotoAnalyzeResponse } from '../../../shared/src/types';
import { recommendStyle, getAvailableStyles } from '../../../shared/src/styleRecommend';

type Bindings = {
  ANTHROPIC_API_KEY: string;
  DEEPSEEK_API_KEY: string;
  RATE_LIMIT: KVNamespace;
};

// ===== バリデーション =====

const MAGIC_BYTES: Record<string, string> = {
  'image/jpeg': '/9j/',
  'image/png': 'iVBOR',
  'image/webp': 'UklGR',
};

function validateImagePayload(body: PhotoAnalyzeRequest): string | null {
  if (!body.image || typeof body.image !== 'string') {
    return '画像データが必要です';
  }
  if (!body.mimeType || !MAGIC_BYTES[body.mimeType]) {
    return '対応形式: JPEG, PNG, WebP';
  }

  // base64サイズチェック（2MB）
  const sizeBytes = Math.round(body.image.length * 0.75);
  if (sizeBytes > 2 * 1024 * 1024) {
    return '画像サイズが大きすぎます（2MB以下にしてください）';
  }

  // マジックバイト検証
  const expectedPrefix = MAGIC_BYTES[body.mimeType];
  if (!body.image.startsWith(expectedPrefix)) {
    return '画像データとMIMEタイプが一致しません';
  }

  return null;
}

// ===== Step 1: Vision構造化抽出（Anthropic REST API直叩き） =====

async function callVision(
  apiKey: string,
  image: string,
  mimeType: string,
): Promise<PhotoVisionResult> {
  const systemPrompt = buildPhotoSystemPrompt();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: image,
                },
              },
              {
                type: 'text',
                text: 'この写真を分析してJSON形式で出力してください。',
              },
            ],
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error: ${res.status} ${err.slice(0, 200)}`);
    }

    const data = await res.json() as {
      content: Array<{ type: string; text?: string }>;
    };

    const text = data.content?.find((b) => b.type === 'text')?.text;
    if (!text) throw new Error('Empty vision response');

    // JSONパース
    let cleaned = text.trim()
      .replace(/^```(?:json)?\s*\n?/i, '')
      .replace(/\n?```\s*$/i, '')
      .trim();

    let parsed: PhotoVisionResult;
    try {
      parsed = JSON.parse(cleaned) as PhotoVisionResult;
    } catch {
      throw new Error('写真の解析結果を読み取れませんでした');
    }

    // enum値のバリデーション + フォールバック
    const validCategories = ['beauty', 'food', 'fitness', 'consulting', 'retail', 'education', 'realestate', 'medical', 'other'];
    const validMoods = ['warm', 'cool', 'professional', 'casual', 'luxury', 'natural'];

    return {
      category: validCategories.includes(parsed.category) ? parsed.category : 'other',
      theme: typeof parsed.theme === 'string' ? parsed.theme.slice(0, 200) : '写真の内容',
      mood: validMoods.includes(parsed.mood) ? parsed.mood : 'casual',
    };
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Vision API timeout (20s)');
    }
    throw err;
  }
}

// ===== Step 2: テキスト生成（DeepSeek） =====

async function generateText(
  apiKey: string,
  vision: PhotoVisionResult,
): Promise<ReturnType<typeof parseAIResponse>> {
  const systemPrompt = buildSystemPrompt(vision.category, 'tips', vision.mood);
  const userPrompt = buildUserPrompt(vision.theme);

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com',
  });

  const completion = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('Empty DeepSeek response');

  return parseAIResponse(content);
}

// ===== リトライヘルパー =====

async function withRetry<T>(fn: () => Promise<T>, maxRetries: number, label: string): Promise<T> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // imageフィールドをログに出さない（プライバシー保護）
      console.error(`${label} attempt ${attempt + 1} failed:`, lastError.message);
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }
  throw lastError!;
}

// ===== ルート =====

export const photoRoute = new Hono<{ Bindings: Bindings }>();

photoRoute.post('/photo-analyze', async (c) => {
  let body: PhotoAnalyzeRequest;
  try {
    body = await c.req.json<PhotoAnalyzeRequest>();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  // バリデーション
  const validationError = validateImagePayload(body);
  if (validationError) {
    return c.json({ error: validationError }, 400);
  }

  const anthropicKey = c.env.ANTHROPIC_API_KEY;
  const deepseekKey = c.env.DEEPSEEK_API_KEY;

  if (!anthropicKey || !deepseekKey) {
    return c.json({ error: 'API keys not configured' }, 500);
  }

  // Step 1: Vision構造化抽出（リトライ最大2回）
  let visionResult: PhotoVisionResult;
  try {
    visionResult = await withRetry(
      () => callVision(anthropicKey, body.image, body.mimeType),
      2,
      'Vision',
    );
  } catch (err) {
    return c.json({
      error: '写真の解析に失敗しました。再試行してください。',
      step: 'vision',
    }, 500);
  }

  // Step 2: テキスト生成（リトライ最大2回、Step1結果を再利用）
  try {
    const response = await withRetry(
      () => generateText(deepseekKey, visionResult),
      2,
      'TextGen',
    );

    const recommendedStyleId = recommendStyle(visionResult.category);
    const availableStyles = getAvailableStyles(recommendedStyleId);

    return c.json({
      ...response,
      vision: visionResult,
      recommendedStyleId,
      availableStyles,
    });
  } catch (err) {
    return c.json({
      error: 'テキスト生成に失敗しました。再試行してください。',
      step: 'textgen',
      vision: visionResult, // Step1結果は返す
    }, 500);
  }
});
