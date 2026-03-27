import type { GenerateResponse } from '../../../shared/src/types';

/**
 * AI出力テキストからGenerateResponseをパースする
 * - マークダウンコードブロック除去
 * - JSON.parse試行
 * - 失敗時: 正規表現で {...} を抽出して再試行
 */
export function parseAIResponse(text: string): GenerateResponse {
  let cleaned = text.trim();

  // マークダウンコードブロック除去
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  cleaned = cleaned.trim();

  // 1回目: そのままparse
  try {
    return validateResponse(JSON.parse(cleaned));
  } catch {
    // 2回目: {...} を正規表現で抽出
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return validateResponse(JSON.parse(match[0]));
      } catch {
        // fall through
      }
    }
    throw new Error('Failed to parse AI response as JSON');
  }
}

function validateResponse(data: unknown): GenerateResponse {
  const obj = data as Record<string, unknown>;

  if (!Array.isArray(obj.slides) || obj.slides.length !== 5) {
    throw new Error(`Expected 5 slides, got ${Array.isArray(obj.slides) ? obj.slides.length : 'none'}`);
  }

  if (typeof obj.caption !== 'string' || obj.caption.length === 0) {
    throw new Error('Missing or empty caption');
  }

  if (!Array.isArray(obj.hashtags) || obj.hashtags.length === 0) {
    throw new Error('Missing or empty hashtags');
  }

  return obj as unknown as GenerateResponse;
}
