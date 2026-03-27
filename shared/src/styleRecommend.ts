/**
 * カテゴリ → 推薦スタイルID のテーブルルックアップ。
 * データ駆動: 行追加だけでスタイル拡張可能。
 */

const STYLE_TABLE: Record<string, string> = {
  beauty: 'soft-natural',
  food: 'soft-natural',
  fitness: 'promo-bold',
  retail: 'promo-bold',
  consulting: 'minimal-clean',
  education: 'minimal-clean',
  realestate: 'minimal-clean',
  medical: 'minimal-clean',
  other: 'minimal-clean',
};

const DEFAULT_STYLE = 'minimal-clean';

const AVAILABLE_STYLES = ['minimal-clean', 'soft-natural', 'promo-bold'] as const;

export type StyleId = (typeof AVAILABLE_STYLES)[number];

/**
 * カテゴリから推薦スタイルを返す。
 * moodはコピーのトーンのみに使用し、スタイル選択には使わない。
 */
export function recommendStyle(category: string): StyleId {
  const id = STYLE_TABLE[category] ?? DEFAULT_STYLE;
  return id as StyleId;
}

/**
 * 利用可能な全スタイルIDを返す（UI切り替え用）。
 * 推薦スタイルを先頭に置く。
 */
export function getAvailableStyles(recommendedId: StyleId): StyleId[] {
  return [
    recommendedId,
    ...AVAILABLE_STYLES.filter((s) => s !== recommendedId),
  ];
}
