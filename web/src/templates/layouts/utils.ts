import { escapeHtml } from 'shared/sanitize';
import type { StyleTokens } from 'shared/templates';

// ===== カラーユーティリティ =====

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function darkenHex(hex: string, amount = 0.2): string {
  const r = Math.max(0, Math.round(parseInt(hex.slice(1, 3), 16) * (1 - amount)));
  const g = Math.max(0, Math.round(parseInt(hex.slice(3, 5), 16) * (1 - amount)));
  const b = Math.max(0, Math.round(parseInt(hex.slice(5, 7), 16) * (1 - amount)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function lightenHex(hex: string, amount = 0.9): string {
  const r = Math.min(255, Math.round(parseInt(hex.slice(1, 3), 16) + (255 - parseInt(hex.slice(1, 3), 16)) * amount));
  const g = Math.min(255, Math.round(parseInt(hex.slice(3, 5), 16) + (255 - parseInt(hex.slice(3, 5), 16)) * amount));
  const b = Math.min(255, Math.round(parseInt(hex.slice(5, 7), 16) + (255 - parseInt(hex.slice(5, 7), 16)) * amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ===== ドットインジケーター =====

export const DOTS_STYLE = 'position:absolute;bottom:60px;left:50%;transform:translateX(-50%);display:flex;gap:12px;z-index:2;';

export function renderDots(activeIndex: number, isDark: boolean, brandColor: string): string {
  return Array.from({ length: 5 }, (_, i) => {
    if (i === activeIndex) {
      return `<div style="width:36px;height:12px;border-radius:6px;background:${isDark ? '#fff' : brandColor}"></div>`;
    }
    return `<div style="width:12px;height:12px;border-radius:50%;background:${isDark ? 'rgba(255,255,255,0.3)' : '#ccc'}"></div>`;
  }).join('');
}

// ===== テキストサイズ自動調整 =====

export function getTitleFontSize(title: string, baseSize: number): number {
  const len = title.length;
  if (len <= 12) return baseSize;
  if (len <= 18) return Math.round(baseSize * 0.85);
  if (len <= 25) return Math.round(baseSize * 0.7);
  return Math.round(baseSize * 0.6);
}

// ===== body line-clamp CSS =====

export const BODY_CLAMP_STYLE = 'display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;';

// ===== 安全なテキスト埋め込み =====

export const esc = escapeHtml;

// ===== 共通定数 =====

export const SLIDE_W = 1080;
export const SLIDE_H = 1350;
