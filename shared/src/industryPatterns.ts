/** Industry-specific carousel patterns for carousel-ai */

export interface IndustryPattern {
  categoryId: string;
  name: string;
  /** Keywords used for genre-based fallback matching */
  keywords: string[];
  /** Preferred hook types (by name) in priority order */
  preferredHooks: string[];
  /** Preferred format IDs */
  preferredFormats: string[];
  /** How to write CTA for this industry */
  ctaStyle: string;
  /** Legal/style constraints specific to this industry */
  copyConstraints: string[];
  /** Additional tone note for this industry */
  toneNote?: string;
}

export const INDUSTRY_PATTERNS: Record<string, IndustryPattern> = {
  beauty: {
    categoryId: 'beauty',
    name: '美容・サロン',
    keywords: ['美容室', 'サロン', 'エステ', 'ネイル', 'まつ毛', 'アイラッシュ', '脱毛', 'フェイシャル', 'ヘア', '美容師'],
    preferredHooks: ['before_after', 'authority', 'number'],
    preferredFormats: ['before_after', 'tips'],
    ctaStyle: 'プロフのリンクから予約 / DMで空き確認 / 「詳しくはプロフへ」',
    copyConstraints: [
      '「必ず〜になります」等の効果断定は禁止（薬機法）',
      '「※効果には個人差があります」を施術効果を述べる場合に自動付与',
      '「〜が治ります」等の医療的効果謳いは禁止',
      '比較広告（「他店より〇%安い」等）は根拠なしで使わない',
    ],
    toneNote: '施術の専門性と安心感を伝えつつ、親しみやすさを維持する',
  },
  food: {
    categoryId: 'food',
    name: '飲食・カフェ',
    keywords: ['カフェ', '飲食', 'レストラン', '居酒屋', 'ベーカリー', 'パン屋', 'ラーメン', '和食', 'イタリアン', 'フレンチ', '焼肉', 'バー', 'スイーツ', 'ケーキ'],
    preferredHooks: ['list', 'number', 'surprise'],
    preferredFormats: ['tips', 'campaign'],
    ctaStyle: '「プロフのリンクから予約」「来店をお待ちしています」「毎週〇曜日更新」',
    copyConstraints: [
      '食材の産地・無添加等の表示は根拠がある場合のみ',
      '「限定〇食」等の数字表現は実態と合わせる',
      'アレルギー情報が必要な場合はキャプションに誘導',
    ],
    toneNote: '食欲をそそる感覚的・情緒的な言葉を優先。「こだわり」「丁寧」「季節」などキーワードが効く',
  },
  fitness: {
    categoryId: 'fitness',
    name: 'フィットネス・ヨガ',
    keywords: ['フィットネス', 'ヨガ', 'ピラティス', 'ジム', 'パーソナルトレーナー', 'トレーニング', 'ダイエット', 'ボディメイク', '筋トレ'],
    preferredHooks: ['before_after', 'how_to', 'number'],
    preferredFormats: ['before_after', 'tips'],
    ctaStyle: '「体験レッスンはプロフへ」「DMで無料相談」「まずは1回試してみて」',
    copyConstraints: [
      '「〇kg痩せる」等の断定的数値は禁止（景表法）',
      '「効果には個人差があります」を効果訴求時に付与',
      '医療行為と混同されるような表現は禁止',
    ],
    toneNote: 'エネルギッシュかつポジティブなトーン。「一緒に」「できる」「変わる」を前向きに使う',
  },
  consulting: {
    categoryId: 'consulting',
    name: 'コンサル・士業',
    keywords: ['コンサル', '税理士', '弁護士', '社労士', '行政書士', 'FP', 'ファイナンシャル', 'コーチ', 'コーチング', 'キャリア', 'マーケター', 'コンサルタント'],
    preferredHooks: ['authority', 'problem', 'conclusion_first'],
    preferredFormats: ['tips', 'before_after'],
    ctaStyle: '「無料相談はDMで」「プロフのリンクから問い合わせ」「まずは話を聞かせてください」',
    copyConstraints: [
      '具体的な法律・税制のアドバイスは「詳しくは専門家に相談を」と添える',
      '「絶対に節税できます」等の成果保証表現は禁止',
      '守秘義務のある事例紹介は匿名化・一般化する',
      '弁護士・税理士等は資格表示を適切に',
    ],
    toneNote: '信頼性・専門性を前面に。実績数字・経験年数・受講者数は積極的に活用',
  },
  retail: {
    categoryId: 'retail',
    name: '小売・EC',
    keywords: ['アパレル', '雑貨', 'EC', 'セレクトショップ', 'ファッション', 'コーディネート', 'ハンドメイド', '手作り', 'ブランド'],
    preferredHooks: ['urgency', 'list', 'surprise'],
    preferredFormats: ['campaign', 'tips'],
    ctaStyle: '「プロフのリンクから購入」「ストーリーのリンクをチェック」「DMで在庫確認」',
    copyConstraints: [
      '「残り〇点」等の在庫表示は実態と合わせる',
      '「定価〇〇円→セール価格」の表示は二重価格規制に注意（景表法）',
      '素材・品質の誇大表現は禁止',
    ],
    toneNote: '商品の世界観・ライフスタイル提案を重視。「憧れ」「日常に溶け込む」等の感性訴求が効く',
  },
  education: {
    categoryId: 'education',
    name: 'スクール・教育',
    keywords: ['スクール', '塾', '教室', 'レッスン', 'オンライン講座', 'セミナー', '習い事', '英会話', 'プログラミング', '料理教室'],
    preferredHooks: ['before_after', 'authority', 'how_to'],
    preferredFormats: ['before_after', 'tips'],
    ctaStyle: '「無料体験はプロフへ」「まずは説明会に参加して」「DMで資料請求」',
    copyConstraints: [
      '「〇ヶ月で〜になれる」等の成果保証は禁止（景表法）',
      '卒業生・受講生の声は実在に基づく（捏造不可）',
      '資格取得の合格率表示は根拠データが必要',
    ],
    toneNote: '成長・変化のストーリーを重視。「できなかった→できた」の変容体験が響く',
  },
  realestate: {
    categoryId: 'realestate',
    name: '不動産',
    keywords: ['不動産', '賃貸', '売買', 'マンション', '一戸建て', 'リフォーム', 'リノベ', '住まい', '物件'],
    preferredHooks: ['number', 'problem', 'how_to'],
    preferredFormats: ['tips', 'before_after'],
    ctaStyle: '「詳しくはプロフへ」「LINEで無料相談」「まずは話だけでも」',
    copyConstraints: [
      '物件価格・賃料は変動するため「詳しくはお問い合わせください」と添える',
      '宅建業法の広告規制に従い、取引態様・免許番号の表示が必要な場合がある',
      '「必ず値上がります」等の断定的価格予測は禁止',
    ],
    toneNote: '「安心」「信頼」「暮らし」のキーワードを使い、ライフスタイル提案型が響く',
  },
  medical: {
    categoryId: 'medical',
    name: 'クリニック・医療',
    keywords: ['クリニック', '病院', '歯科', '整骨院', '接骨院', 'カイロ', '鍼灸', 'メンタルヘルス', '漢方'],
    preferredHooks: ['problem', 'authority', 'number'],
    preferredFormats: ['tips', 'before_after'],
    ctaStyle: '「ご予約はプロフのリンクから」「オンライン予約受付中」「LINEでお問い合わせ」',
    copyConstraints: [
      '医療広告ガイドライン準拠必須',
      '「〜が治ります」「〜に効きます」等の効果断定は禁止',
      '「※効果には個人差があります」を必ず付与',
      '症例写真・ビフォーアフター使用は患者同意と事前届出が必要',
      '他院との比較広告は原則禁止',
    ],
    toneNote: '安心感・専門性・患者への共感を最優先。「あなたのお悩みに寄り添います」スタンスで',
  },
};

/**
 * Lookup an industry pattern.
 * Priority: exact category match → genre keyword match → null (use generic fallback)
 */
export function matchIndustryPattern(
  categoryId: string,
  genre: string,
): IndustryPattern | null {
  // 1. Exact category match
  const byCategory = INDUSTRY_PATTERNS[categoryId];
  if (byCategory) return byCategory;

  // 2. Genre keyword match (partial)
  for (const pattern of Object.values(INDUSTRY_PATTERNS)) {
    if (
      genre.includes(pattern.name) ||
      pattern.keywords.some((k) => genre.includes(k))
    ) {
      return pattern;
    }
  }

  return null;
}
