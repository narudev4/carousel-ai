import { Hono } from 'hono';
import OpenAI from 'openai';
import { buildSystemPrompt, buildUserPrompt } from '../lib/prompts';
import { parseAIResponse } from '../lib/json-utils';
import { sanitizeInput, sanitizeHexColor } from '../../../shared/src/sanitize';
import { CATEGORIES } from '../../../shared/src/categories';
import { FORMATS } from '../../../shared/src/formats';
import type { GenerateRequest, GenerateResponse } from '../../../shared/src/types';

type Bindings = {
  DEEPSEEK_API_KEY: string;
  RATE_LIMIT: KVNamespace;
};

// デモモード用サンプルデータ
const DEMO_RESPONSE: GenerateResponse = {
  slides: [
    { type: 'cover', title: 'プロが教える\n美髪ケアの秘訣' },
    { type: 'tip', number: 1, title: 'シャンプーは\n夜に1回だけ', body: '朝シャンは頭皮の\n必要な油分まで落とします' },
    { type: 'tip', number: 2, title: 'ドライヤーは\n根元から', body: '毛先から乾かすと\nダメージの原因に' },
    { type: 'tip', number: 3, title: 'トリートメントは\n毛先中心に', body: '根元につけると\nベタつきの原因になります' },
    { type: 'cta', title: 'あなたの髪を\n変えませんか？', body: '初回カウンセリング\n無料実施中' },
  ],
  caption: '美容のプロが教える、今日から実践できる美髪ケアの3つのポイント✨\n\nシャンプーのタイミング、ドライヤーの使い方、トリートメントの塗り方。\n基本を見直すだけで、髪の質感が変わります。\n\n初回カウンセリング無料で受付中！\nプロフィールのリンクからご予約ください💕',
  hashtags: ['#美容', '#ヘアケア', '#美髪', '#髪質改善', '#サロン', '#美容室', '#トリートメント', '#シャンプー', '#ドライヤー', '#ヘアスタイル', '#美容師', '#プロが教える'],
  metadata: { format: 'tips', category: 'beauty', hookType: '権威型' },
};

export const generateRoute = new Hono<{ Bindings: Bindings }>();

generateRoute.post('/generate', async (c) => {
  // リクエストボディのパース
  let body: GenerateRequest;
  try {
    body = await c.req.json<GenerateRequest>();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  // バリデーション
  const errors: string[] = [];

  if (!body.category || !CATEGORIES.find((cat) => cat.id === body.category)) {
    errors.push('category: 有効なカテゴリを選択してください');
  }
  if (!body.format || !FORMATS.find((f) => f.id === body.format)) {
    errors.push('format: 有効なフォーマットを選択してください');
  }
  if (!body.theme) {
    errors.push('theme: テーマを入力してください');
  }

  if (errors.length > 0) {
    return c.json({ error: 'Validation failed', details: errors }, 400);
  }

  // サニタイズ
  const theme = sanitizeInput(body.theme, 200);
  if (theme.length < 5) {
    return c.json({ error: 'テーマを5文字以上入力してください' }, 400);
  }

  const cta = body.cta ? sanitizeInput(body.cta, 100) : undefined;
  const additionalInfo = body.additionalInfo ? sanitizeInput(body.additionalInfo, 500) : undefined;
  const brandColor = sanitizeHexColor(body.brandColor, '#E91E63');
  const accentColor = sanitizeHexColor(body.accentColor, '#FFC107');

  // デモモード（API_KEY未設定時）
  const apiKey = c.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return c.json({
      ...DEMO_RESPONSE,
      _demo: true,
      _brandColor: brandColor,
      _accentColor: accentColor,
    });
  }

  // DeepSeek V3 API呼び出し
  const systemPrompt = buildSystemPrompt(body.category, body.format, undefined, body.accountProfile ?? undefined);
  const userPrompt = buildUserPrompt(theme, cta, additionalInfo);

  const client = new OpenAI({
    apiKey,
    baseURL: 'https://api.deepseek.com',
  });

  const MAX_RETRIES = 2;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
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
      if (!content) {
        throw new Error('Empty response from AI');
      }

      const response = parseAIResponse(content);

      return c.json(response);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`Attempt ${attempt + 1} failed:`, lastError.message);

      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
  }

  // 全リトライ失敗
  console.error('All retries exhausted:', lastError?.message);
  return c.json(
    { error: '生成に失敗しました。回数は消費されていません。もう一度お試しください。' },
    500,
  );
});
