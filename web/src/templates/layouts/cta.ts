import type { Slide } from 'shared/types';
import type { StyleTokens, RenderResult } from 'shared/templates';
import { darkenHex, renderDots, getTitleFontSize, esc, DOTS_STYLE, BODY_CLAMP_STYLE, SLIDE_W, SLIDE_H } from './utils';

export function renderCta(
  slide: Slide,
  tokens: StyleTokens,
  brandColor: string,
  accentColor: string,
  photoDataUri?: string,
): RenderResult {
  const brandDark = darkenHex(brandColor);
  const titleSize = getTitleFontSize(slide.title, 72);
  const title = esc(slide.title);
  const body = esc(slide.body);

  const bg = photoDataUri
    ? `background-image:${tokens.ctaOverlay},url(${photoDataUri});background-size:cover;background-position:center`
    : `background:linear-gradient(135deg,${brandColor} 0%,${brandDark} 100%)`;

  return {
    style: `width:${SLIDE_W}px;height:${SLIDE_H}px;font-family:${tokens.fontFamily};position:relative;overflow:hidden;${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:80px`,
    innerHTML: `
      <div style="position:absolute;top:-150px;left:-150px;width:500px;height:500px;border-radius:50%;background:rgba(255,255,255,0.06)"></div>
      <div style="position:absolute;bottom:-100px;right:-100px;width:400px;height:400px;border-radius:50%;background:rgba(255,255,255,0.04)"></div>
      <div style="position:relative;z-index:1">
        <p style="font-size:28px;opacity:0.8;letter-spacing:0.2em;margin-bottom:40px">最後までご覧いただきありがとうございます</p>
        <h2 style="font-size:${titleSize}px;font-weight:${tokens.titleWeight};line-height:1.4;margin-bottom:50px;white-space:pre-line;${photoDataUri ? 'text-shadow:0 2px 12px rgba(0,0,0,0.5)' : ''}">${title}</h2>
        <div style="width:80px;height:4px;background:${accentColor};margin:0 auto 50px;border-radius:2px"></div>
        <p style="font-size:36px;opacity:0.9;line-height:1.8;margin-bottom:60px;white-space:pre-line;${BODY_CLAMP_STYLE}">${body}</p>
        <div style="display:inline-block;background:${accentColor};color:${brandDark};font-size:32px;font-weight:700;padding:24px 64px;border-radius:100px;box-shadow:0 12px 40px rgba(0,0,0,0.2)">プロフィールをチェック →</div>
        <p style="margin-top:50px;font-size:24px;opacity:0.7;letter-spacing:0.1em">フォローして最新情報をチェック</p>
      </div>
      <div style="${DOTS_STYLE}">${renderDots(4, true, brandColor)}</div>
    `,
  };
}
