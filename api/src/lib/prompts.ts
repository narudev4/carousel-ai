import { CATEGORIES } from '../../../shared/src/categories';
import { FORMATS } from '../../../shared/src/formats';
import type { AccountProfile } from '../../../shared/src/accountProfile';
import { GOAL_LABELS, TONE_LABELS } from '../../../shared/src/accountProfile';
import { matchIndustryPattern } from '../../../shared/src/industryPatterns';

const BASE_SYSTEM_PROMPT = `あなたはInstagramカルーセル投稿の専門コピーライター兼デザイナーです。
日本語ネイティブで、小規模事業者のIG運用を支援します。

# 出力ルール
- 必ずJSON形式で出力してください
- slides配列は必ず5要素
- 各slideのtitleは15〜25文字（coverスライドは特に25文字以内でフックを凝縮する）
- 各slideのbodyは20〜60文字（coverとctaは省略可）
- captionは200〜400文字
- hashtagsは3〜5個の配列（2024年以降のIG最適解。厳選して少数精鋭）

# フック類型（coverスライドに適用）
1. 数字・統計型 [number]: 「99%が知らない〜」「3つの〜」
2. 結論先出し型 [conclusion_first]: 「〜が変わった理由」
3. 緊急性型 [urgency]: 「今週末限定」「残り3日」
4. 問題提起型 [problem]: 「まだ〜していませんか？」
5. 権威型 [authority]: 「プロが教える〜」「10年の経験から〜」
6. 意外性型 [surprise]: 「実は〜だった」「〜は逆効果」
7. HOW TO型 [how_to]: 「〜する方法」「〜のコツ」
8. リスト型 [list]: 「〜ランキング」「〜まとめ」
9. 共感型 [empathy]: 「〜あるある」「〜で悩んでいませんか」
10. Before/After型 [before_after]: 「たった1ヶ月で〜が変わった」

# NGルール（必ず守る）
- 「こんにちは、〇〇です」で始めない
- 曖昧な問いかけで始めない（「皆さんは〜ですか？」）
- CTAに具体的行動がないものは不可
- 競合他社名・商標を使わない
- 差別的・攻撃的な表現を使わない
- 「なんと」「驚くべき」「衝撃の」等の過剰な煽り表現を多用しない
- 断定的な成果保証（「必ず〜になります」「〜が治ります」）は使わない
- 読点・句点を使い、読みやすい日本語にする`;

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
    { "type": "cover", "title": "タイトル15-25文字" },
    { "type": "tip/before/after/explanation/benefit", "number": 1, "title": "タイトル15-25文字", "body": "本文20-60文字" },
    { "type": "tip/before/after/explanation/benefit", "number": 2, "title": "タイトル15-25文字", "body": "本文20-60文字" },
    { "type": "tip/before/after/explanation/benefit", "number": 3, "title": "タイトル15-25文字", "body": "本文20-60文字" },
    { "type": "cta", "title": "タイトル15-25文字", "body": "本文20-60文字" }
  ],
  "caption": "キャプション200-400文字",
  "hashtags": ["#ハッシュタグ1", "#ハッシュタグ2", "#ハッシュタグ3"],
  "metadata": {
    "format": "tips/before_after/campaign",
    "category": "カテゴリID",
    "hookType": "使用したフック類型名"
  }
}`;

// ===== AccountProfile 文脈プロンプト =====

/** Strip prompt-injection characters and limit string length */
function sanitizeProfileField(value: string, maxLen = 100): string {
  return value
    .replace(/[`#\[\]{}\\]/g, '')  // remove markdown/prompt-special chars
    .slice(0, maxLen)
    .trim();
}

/** Tone-specific writing style instructions */
function buildToneInstruction(tone: AccountProfile['style']['tone']): string {
  const instructions: Record<string, string> = {
    friendly: `口調ルール（フレンドリー）:
- 語尾: 「〜だよ」「〜しよう」「〜だね」など親しみやすい語尾を使う
- 文の長さ: 1文20〜35文字程度の短い文を並べる。長文は分割する
- 数字・箇条書き: 箇条書きより「まず〜、次に〜」の流れ文を好む
- 絵文字: 1スライドに1つまで使ってよい（使いすぎない）
- その他: 読者を「あなた」と呼びかけ、堅い専門用語は平易に言い換える`,

    trustworthy: `口調ルール（信頼感・誠実）:
- 語尾: 「〜です」「〜ます」の丁寧語を基本とする。断定は根拠付きで
- 文の長さ: 1文30〜45文字程度。しっかり情報を伝える文量を保つ
- 数字・箇条書き: 実績・数字を積極的に使い信頼性を示す。箇条書きで整理
- 絵文字: 原則使わない。使うとしても最後のCTAに1つまで
- その他: 誇大表現は避け、事実と実績で説得する`,

    expert: `口調ルール（専門家・権威）:
- 語尾: 「〜です」「〜します」基調。専門解説は「〜となります」「〜と言えます」
- 文の長さ: 1文30〜50文字。論理を展開するため少し長めでよい
- 数字・箇条書き: データ・数字を引用し、箇条書きで要点を整理する
- 絵文字: 使わない
- その他: 「〜によると」「〜の観点から」等のエビデンス表現を活用。キャプションで分析・見解を一歩深く`,

    casual: `口調ルール（カジュアル）:
- 語尾: タメ口・体言止めを積極的に使う。「〜じゃん」「〜だよね」可
- 文の長さ: 1文15〜25文字の短文を好む。リズム重視で刻む
- 数字・箇条書き: 箇条書きより体言止めのリズム感を優先
- 絵文字: スライドごとに使ってよい（TPOに応じて）
- その他: 「まじで」「ほんとに」等の口語OK。SNS感のある自然な話し言葉で`,
  };

  return instructions[tone] ?? '';
}

/** Goal-weighted hook type recommendation */
function buildGoalHookInstruction(goal: AccountProfile['strategy']['primaryGoal']): string {
  const weights: Record<string, string> = {
    growth: `フォロワー獲得を目標とする場合の推奨フック順:
1位: 共感型（「〜あるある」「〜で悩んでいませんか」）→ 共感による保存・シェアが伸びる
2位: 意外性型（「実は〜だった」）→ 「え、そうなの？」からのフォロー率が高い
3位: リスト型（「〜ランキング」）→ 保存率が高くアルゴリズムに有利`,

    sales: `購買・予約獲得を目標とする場合の推奨フック順:
1位: 緊急性型（「今週末限定」「先着〇名」）→ 今すぐ行動を促す
2位: 権威型（「プロが教える〜」「〇〇実績のある〜」）→ 信頼から購買へ
3位: 数字・統計型（「〇〇人が選んだ」）→ 社会的証明で背中を押す`,

    awareness: `認知・ブランド拡散を目標とする場合の推奨フック順:
1位: 数字・統計型（「99%が知らない〜」「3つの〜」）→ 保存・シェアされやすい
2位: HOW TO型（「〜する方法」）→ 実用情報は拡散しやすい
3位: 意外性型（「〜は逆効果」）→ 常識を覆す切り口は話題になる`,

    inquiries: `問い合わせ・相談獲得を目標とする場合の推奨フック順:
1位: 問題提起型（「まだ〜していませんか？」）→ 悩みに刺さりDMへ誘導
2位: 結論先出し型（「〜が変わった理由」）→ 「自分も変えたい」からの問い合わせ
3位: 権威型（「〇年の経験から〜」）→ 専門家への相談意欲を高める`,
  };

  return weights[goal] ?? '';
}

/** Goal-specific CTA instruction (1 primary + 1 alternative per goal) */
function buildCtaInstruction(goal: AccountProfile['strategy']['primaryGoal']): string {
  const ctas: Record<string, string> = {
    growth: `CTA推奨（フォロワー増目標）:
- 優先CTA: 「フォローして毎週更新をチェックしてね」（フォロー誘導を最優先）
- 代替CTA: 「保存していつでも読み返してください」（保存 → アルゴリズム評価向上）`,

    sales: `CTA推奨（売上・予約目標）:
- 優先CTA: 「プロフのリンクからご予約ください」（リンク誘導でコンバージョン直結）
- 代替CTA: 「DMで空き日程をお問い合わせください」（DM誘導、会話から購買へ）`,

    awareness: `CTA推奨（認知・拡散目標）:
- 優先CTA: 「役に立ったら保存してシェアしてもらえると嬉しいです」（保存＋拡散を同時）
- 代替CTA: 「フォローで最新情報をキャッチしてください」（フォロー誘導）`,

    inquiries: `CTA推奨（問い合わせ目標）:
- 優先CTA: 「まずはDMで気軽にご相談ください」（心理的ハードルの低いDM誘導）
- 代替CTA: 「プロフのリンクから無料相談を予約できます」（リンク誘導で即予約）`,
  };

  return ctas[goal] ?? '';
}

/** User-specified NG expressions injection */
function buildNgInstruction(ngExpressions: string[]): string {
  if (ngExpressions.length === 0) return '';
  const sanitized = ngExpressions.map((s) => sanitizeProfileField(s, 50)).filter(Boolean);
  if (sanitized.length === 0) return '';
  return `\n# 使用禁止ワード（ユーザー指定）\n以下の表現・言葉は絶対に使わないでください: ${sanitized.join(' / ')}`;
}

export function buildAccountContextPrompt(
  profile: AccountProfile,
  categoryId?: string,
): string {
  const goal = GOAL_LABELS[profile.strategy.primaryGoal] ?? profile.strategy.primaryGoal;
  const tone = TONE_LABELS[profile.style.tone] ?? profile.style.tone;
  const refs = profile.strategy.referenceAccounts.length > 0
    ? profile.strategy.referenceAccounts.map((s) => sanitizeProfileField(s, 50)).join(' / ')
    : 'なし';
  const specificGoal = sanitizeProfileField(profile.strategy.specificGoal, 100) || '未設定';

  const industryPattern = matchIndustryPattern(
    categoryId ?? '',
    sanitizeProfileField(profile.identity.genre, 50),
  );

  const industrySection = industryPattern
    ? `\n# 業種別ガイドライン（${industryPattern.name}）
- 推奨フック順: ${industryPattern.preferredHooks.join(' → ')}（この順で検討し、テーマに最も合うものを選ぶ）
- 相性の良いフォーマット: ${industryPattern.preferredFormats.join(' / ')}
- CTAスタイル: ${industryPattern.ctaStyle}
- 法務・コピー制約:
${industryPattern.copyConstraints.map((c) => `  - ${c}`).join('\n')}${industryPattern.toneNote ? `\n- 表現のポイント: ${industryPattern.toneNote}` : ''}`
    : '';

  const toneInstruction = buildToneInstruction(profile.style.tone);
  const hookInstruction = buildGoalHookInstruction(profile.strategy.primaryGoal);
  const ctaInstruction = buildCtaInstruction(profile.strategy.primaryGoal);
  const ngInstruction = buildNgInstruction(profile.style.ngExpressions);

  return `
# アカウント情報
- ジャンル: ${sanitizeProfileField(profile.identity.genre) || '未設定'}
- ターゲット層: ${sanitizeProfileField(profile.identity.targetAudience) || '未設定'}
- 提供価値・商品: ${sanitizeProfileField(profile.identity.sellWhat) || '未設定'}
- 主目標: ${goal}（具体目標: ${specificGoal}）
- 口調・トーン: ${tone}
- 参考アカウント: ${refs}
${industrySection}
# 口調・文体の指示
${toneInstruction || `語尾・文体はターゲット層に合わせて自然な日本語で書く`}

# フック選定の優先度
${hookInstruction || `9つのフック類型から最も効果的なものを選ぶ`}

# CTA（行動喚起）の指示
${ctaInstruction || `具体的なアクションを促すCTAを入れる`}
${ngInstruction}
このアカウントらしさを最優先し、ターゲット層（${sanitizeProfileField(profile.identity.targetAudience) || '対象ユーザー'}）に刺さる表現を選んでください。`;
}

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

export function buildSystemPrompt(
  categoryId: string,
  formatId: string,
  mood?: string,
  accountProfile?: AccountProfile,
): string {
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

  if (accountProfile) {
    parts.splice(1, 0, buildAccountContextPrompt(accountProfile, categoryId));
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
