import { CATEGORIES } from '../../../shared/src/categories';
import { FORMATS } from '../../../shared/src/formats';

const BASE_SYSTEM_PROMPT = `あなたはInstagramカルーセル投稿の専門コピーライター兼デザイナーです。
日本語ネイティブで、小規模事業者のIG運用を支援します。

# 出力ルール
- 必ずJSON形式で出力してください
- slides配列は必ず5要素
- 各slideのtitleは10〜20文字
- 各slideのbodyは20〜60文字（coverとctaは省略可）
- captionは200〜400文字
- hashtagsは3〜5個の配列（2024年以降のIG最適解。厳選して少数精鋭）

# フック類型（coverスライドに適用）
1. 数字・統計型: 「99%が知らない〜」「3つの〜」
2. 結論先出し型: 「〜が変わった理由」
3. 緊急性型: 「今週末限定」「残り3日」
4. 問題提起型: 「まだ〜していませんか？」
5. 権威型: 「プロが教える〜」「10年の経験から〜」
6. 意外性型: 「実は〜だった」「〜は逆効果」
7. HOW TO型: 「〜する方法」「〜のコツ」
8. リスト型: 「〜ランキング」「〜まとめ」
9. 共感型: 「〜あるある」「〜で悩んでいませんか」

# NGルール（必ず守る）
- 「こんにちは、〇〇です」で始めない
- 曖昧な問いかけで始めない（「皆さんは〜ですか？」）
- CTAに具体的行動がないものは不可
- 競合他社名・商標を使わない
- 差別的・攻撃的な表現を使わない`;

const CONTENT_GUARDRAILS = `
# コンテンツガードレール
- 「必ず〜になります」「〜が治ります」等の効果断定は禁止
- 「※個人の感想です」「※効果には個人差があります」を美容/医療カテゴリでは自動付与
- 薬機法・景表法に抵触する表現を避ける
- 医療行為の断定的な効果謳いは禁止`;

const JSON_FORMAT_INSTRUCTION = `
# JSON出力フォーマット
以下のJSON形式で出力してください。JSON以外のテキストは含めないでください。

{
  "slides": [
    { "type": "cover", "title": "タイトル10-20文字" },
    { "type": "tip/before/after/explanation/benefit", "number": 1, "title": "タイトル10-20文字", "body": "本文20-60文字" },
    { "type": "tip/before/after/explanation/benefit", "number": 2, "title": "タイトル10-20文字", "body": "本文20-60文字" },
    { "type": "tip/before/after/explanation/benefit", "number": 3, "title": "タイトル10-20文字", "body": "本文20-60文字" },
    { "type": "cta", "title": "タイトル10-20文字", "body": "本文20-60文字" }
  ],
  "caption": "キャプション200-400文字",
  "hashtags": ["#ハッシュタグ1", "#ハッシュタグ2", "#ハッシュタグ3"],
  "metadata": {
    "format": "tips/before_after/campaign",
    "category": "カテゴリID",
    "hookType": "使用したフック類型名"
  }
}`;

// ===== 写真分析用プロンプト（Vision API用） =====

export function buildPhotoSystemPrompt(): string {
  const categoryList = CATEGORIES.map((c) => c.id).join('|');
  return `あなたはInstagram投稿の専門家です。
ユーザーがアップロードした写真を分析し、以下のJSON形式で出力してください。
JSON以外のテキストは含めないでください。

{
  "category": "${categoryList}のいずれか",
  "theme": "写真から読み取れるテーマ（日本語、200文字以内）",
  "mood": "warm|cool|professional|casual|luxury|naturalのいずれか"
}

# ルール
- categoryは写真の内容に最も近いものを選ぶ。該当なしなら"other"
- themeは写真の被写体・場面・伝えたいメッセージを簡潔に記述
- moodは写真の雰囲気・色調から判断`;
}

export function buildSystemPrompt(categoryId: string, formatId: string, mood?: string): string {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const format = FORMATS.find((f) => f.id === formatId);

  if (!category || !format) {
    throw new Error(`Invalid category "${categoryId}" or format "${formatId}"`);
  }

  const parts = [
    BASE_SYSTEM_PROMPT,
    `\n# カテゴリ: ${category.name}\n${category.context}`,
    `\n# ${format.promptFragment}`,
    CONTENT_GUARDRAILS,
    JSON_FORMAT_INSTRUCTION,
  ];

  if (mood) {
    parts.splice(2, 0, `\n# 写真の雰囲気: ${mood}\nこの雰囲気に合ったトーンでコピーを書いてください。`);
  }

  return parts.join('\n');
}

export function buildUserPrompt(
  theme: string,
  cta?: string,
  additionalInfo?: string,
): string {
  let prompt = `テーマ: ${theme}`;
  if (cta) prompt += `\nCTA（行動喚起）: ${cta}`;
  if (additionalInfo) prompt += `\n追加情報: ${additionalInfo}`;
  return prompt;
}
