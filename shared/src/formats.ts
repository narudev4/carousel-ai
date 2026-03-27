import type { Format } from './types';

export const FORMATS: Format[] = [
  {
    id: 'tips',
    name: 'Tips型',
    description: '3つのポイントを紹介する定番フォーマット',
    slides: [
      { type: 'cover', instruction: '興味を引くタイトル（フック類型適用）' },
      { type: 'tip', number: 1, instruction: '最も重要なTip' },
      { type: 'tip', number: 2, instruction: '2番目のTip' },
      { type: 'tip', number: 3, instruction: '3番目のTip' },
      { type: 'cta', instruction: 'アクション喚起' },
    ],
    promptFragment: `フォーマット: Tips型（5枚構成）
- スライド1（cover）: 数字・統計型フックを使ったタイトル（例:「99%が知らない3つの〜」「プロが教える〜」）
- スライド2-4（tip）: 各Tipのタイトルは10-20文字、本文は20-60文字。具体的で実行可能なアドバイス
- スライド5（cta）: 行動を促す具体的な一言+フォロー誘導`,
  },
  {
    id: 'before_after',
    name: 'Before/After型',
    description: '変化を見せるストーリーフォーマット',
    slides: [
      { type: 'cover', instruction: '変化を予感させるタイトル' },
      { type: 'before', instruction: '改善前の状態' },
      { type: 'after', instruction: '改善後の状態' },
      { type: 'explanation', instruction: '方法/理由の説明' },
      { type: 'cta', instruction: '同じ変化を得るためのアクション' },
    ],
    promptFragment: `フォーマット: Before/After型（5枚構成）
- スライド1（cover）: 結論先出し型フック（例:「たった1ヶ月で〜が変わった」）
- スライド2（before）: 改善前の具体的な悩み・状態をリアルに描写
- スライド3（after）: 改善後の状態を具体的に。数字があれば入れる
- スライド4（explanation）: なぜ変わったのか、方法を簡潔に
- スライド5（cta）: 同じ変化を体験するための具体的アクション`,
  },
  {
    id: 'campaign',
    name: 'キャンペーン型',
    description: 'セール・イベント告知に最適',
    slides: [
      { type: 'cover', instruction: 'キャンペーンタイトル（緊急性フック）' },
      { type: 'benefit', number: 1, instruction: 'メリット1' },
      { type: 'benefit', number: 2, instruction: 'メリット2' },
      { type: 'benefit', number: 3, instruction: 'メリット3' },
      { type: 'cta', instruction: '期間・条件+申込みアクション' },
    ],
    promptFragment: `フォーマット: キャンペーン型（5枚構成）
- スライド1（cover）: 緊急性フック（例:「今週末限定」「先着30名」「残り3日」）
- スライド2-4（benefit）: キャンペーンのメリットを具体的に。割引率、特典内容、限定感
- スライド5（cta）: 期間と条件を明記+申込み方法（DM、予約リンク等）`,
  },
];
