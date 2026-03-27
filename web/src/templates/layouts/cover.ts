import type { Slide } from 'shared/types';
import type { StyleTokens, RenderResult } from 'shared/templates';
import { darkenHex, renderDots, getTitleFontSize, esc, DOTS_STYLE, SLIDE_W, SLIDE_H } from './utils';

export function renderCover(
  slide: Slide,
  tokens: StyleTokens,
  brandColor: string,
  accentColor: string,
  photoDataUri?: string,
): RenderResult {
  const brandDark = darkenHex(brandColor);
  const titleSize = getTitleFontSize(slide.title, 80);
  const title = esc(slide.title);

  // 写真あり: background-image + overlay
  const bg = photoDataUri
    ? `background-image:${tokens.coverOverlay},url(${photoDataUri});background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,${brandColor} 0%,${brandDark} 100%)`;

  return {
    style: `width:${SLIDE_W}px;height:${SLIDE_H}px;font-family:${tokens.fontFamily};position:relative;overflow:hidden;${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:80px`,
    innerHTML: `
      <div style="position:absolute;top:-120px;right:-120px;width:400px;height:400px;border-radius:50%;background:rgba(255,255,255,0.08)"></div>
      <div style="position:absolute;bottom:-80px;left:-80px;width:300px;height:300px;border-radius:50%;background:rgba(255,255,255,0.05)"></div>
      <div style="position:relative;z-index:1;text-align:center">
        <h1 style="font-size:${titleSize}px;font-weight:${tokens.titleWeight};line-height:1.4;letter-spacing:-0.02em;margin-bottom:40px;white-space:pre-line;${photoDataUri ? 'text-shadow:0 2px 12px rgba(0,0,0,0.5)' : ''}">${title}</h1>
        <div style="width:80px;height:4px;background:${accentColor};margin:0 auto 40px;border-radius:2px"></div>
        <p style="font-size:28px;opacity:0.7">swipe for more →</p>
      </div>
      <div style="${DOTS_STYLE}">${renderDots(0, true, brandColor)}</div>
    `,
  };
}
