import type { Slide } from 'shared/types';
import type { RenderResult } from 'shared/templates';
import { renderWithStyle } from './registry';

// Re-export for backwards compatibility
export type { RenderResult };

/**
 * 互換API: 既存コードからの呼び出しをそのまま維持。
 * 内部ではregistry経由でminimal-cleanスタイルを使用。
 */
export function renderSlide(
  slide: Slide,
  index: number,
  brandColor: string,
  accentColor: string,
): RenderResult {
  return renderWithStyle(slide, index, 'minimal-clean', brandColor, accentColor);
}

/**
 * スタイル指定版API（新規）。写真対応。
 */
export function renderSlideWithStyle(
  slide: Slide,
  index: number,
  styleId: string,
  brandColor: string,
  accentColor: string,
  photoDataUri?: string,
): RenderResult {
  return renderWithStyle(slide, index, styleId, brandColor, accentColor, photoDataUri);
}
