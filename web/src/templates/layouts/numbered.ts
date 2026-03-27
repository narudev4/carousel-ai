import type { Slide } from 'shared/types';
import type { StyleTokens, RenderResult } from 'shared/templates';
import { darkenHex, lightenHex, hexToRgba, renderDots, getTitleFontSize, esc, DOTS_STYLE, BODY_CLAMP_STYLE, SLIDE_W, SLIDE_H } from './utils';

/**
 * 番号付きコンテンツスライド（tip, benefit）
 * ラベル: "POINT N" or "MERIT N"
 */
export function renderNumbered(
  slide: Slide,
  index: number,
  tokens: StyleTokens,
  brandColor: string,
  accentColor: string,
  label: string,
  photoDataUri?: string,
): RenderResult {
  const brandDark = darkenHex(brandColor);
  const brandLight = lightenHex(brandColor);
  const titleSize = getTitleFontSize(slide.title, 64);
  const title = esc(slide.title);
  const body = esc(slide.body);
  const num = slide.number ?? '';

  const photoHtml = photoDataUri
    ? `<img src="${photoDataUri}" style="width:100%;height:${tokens.contentPhotoHeight};object-fit:cover;display:block;border-radius:${tokens.contentPhotoRadius}" />`
    : '';

  return {
    style: `width:${SLIDE_W}px;height:${SLIDE_H}px;font-family:${tokens.fontFamily};position:relative;overflow:hidden;background:${tokens.surface};display:flex;flex-direction:column`,
    innerHTML: `
      ${photoHtml}
      <div style="width:100%;height:12px;background:linear-gradient(90deg,${brandColor},${accentColor})"></div>
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:${photoDataUri ? '40px 80px' : '80px 100px'};text-align:center">
        <div style="width:120px;height:120px;border-radius:${tokens.borderRadius};background:linear-gradient(135deg,${brandColor},${brandDark});display:flex;align-items:center;justify-content:center;margin-bottom:${photoDataUri ? '30px' : '50px'};box-shadow:0 20px 60px ${hexToRgba(brandColor, 0.3)}">
          <span style="font-size:56px;font-weight:900;color:${tokens.onBadge}">${num}</span>
        </div>
        <p style="font-size:24px;font-weight:700;color:${brandColor};letter-spacing:0.15em;margin-bottom:24px">${label} ${num}</p>
        <h2 style="font-size:${titleSize}px;font-weight:${tokens.titleWeight};color:${tokens.onSurface};line-height:1.3;margin-bottom:40px;white-space:pre-line">${title}</h2>
        <div style="width:60px;height:4px;background:${accentColor};margin:0 auto 40px;border-radius:2px"></div>
        <p style="font-size:40px;color:${tokens.onSurfaceSecondary};line-height:1.8;white-space:pre-line;${BODY_CLAMP_STYLE}">${body}</p>
      </div>
      <div style="position:absolute;bottom:0;left:0;right:0;height:200px;background:linear-gradient(to top,${brandLight},transparent);opacity:0.5"></div>
      <div style="${DOTS_STYLE}">${renderDots(index, false, brandColor)}</div>
    `,
  };
}
