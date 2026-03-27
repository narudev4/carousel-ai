import type { Slide } from 'shared/types';
import type { StyleTokens, RenderResult } from 'shared/templates';
import { lightenHex, renderDots, getTitleFontSize, esc, DOTS_STYLE, BODY_CLAMP_STYLE, SLIDE_W, SLIDE_H } from './utils';

interface LabelConfig {
  label: string;
  labelBg: string;
  labelColor: string;
  slideBg: string;
}

const LABEL_CONFIGS: Record<string, LabelConfig> = {
  before: { label: 'BEFORE', labelBg: '#EF4444', labelColor: '#fff', slideBg: '#FFF5F5' },
  after: { label: 'AFTER', labelBg: '#22C55E', labelColor: '#fff', slideBg: '#F0FDF4' },
  explanation: { label: 'WHY?', labelBg: '', labelColor: '#fff', slideBg: '' }, // brandColorで上書き
};

/**
 * ラベル付きコンテンツスライド（before, after, explanation）
 */
export function renderLabeled(
  slide: Slide,
  index: number,
  tokens: StyleTokens,
  brandColor: string,
  accentColor: string,
  photoDataUri?: string,
): RenderResult {
  const config = LABEL_CONFIGS[slide.type] ?? LABEL_CONFIGS.explanation;
  const titleSize = getTitleFontSize(slide.title, slide.type === 'explanation' ? 60 : 64);
  const title = esc(slide.title);
  const body = esc(slide.body);

  const labelBg = config.labelBg || brandColor;
  const slideBg = config.slideBg || `linear-gradient(180deg,#FAFAFA 0%,${lightenHex(brandColor, 0.95)} 100%)`;
  const bgStyle = config.slideBg ? `background:${config.slideBg}` : `background:${slideBg}`;

  const photoHtml = photoDataUri
    ? `<img src="${photoDataUri}" style="width:100%;height:${tokens.contentPhotoHeight};object-fit:cover;display:block;border-radius:${tokens.contentPhotoRadius}" />`
    : '';

  return {
    style: `width:${SLIDE_W}px;height:${SLIDE_H}px;font-family:${tokens.fontFamily};position:relative;overflow:hidden;${bgStyle};display:flex;flex-direction:column;align-items:center;${photoDataUri ? '' : 'justify-content:center;'}text-align:center;padding:${photoDataUri ? '0' : '80px'}`,
    innerHTML: `
      ${photoHtml}
      <div style="${photoDataUri ? 'flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 80px;' : ''}">
        <div style="display:inline-block;background:${labelBg};color:${config.labelColor};font-size:${slide.type === 'explanation' ? 24 : 28}px;font-weight:700;letter-spacing:${slide.type === 'explanation' ? '0.15em' : '0.2em'};padding:${slide.type === 'explanation' ? '10px 40px' : '12px 48px'};border-radius:100px;margin-bottom:${slide.type === 'explanation' ? 50 : 60}px">${config.label}</div>
        <h2 style="font-size:${titleSize}px;font-weight:${tokens.titleWeight};color:${tokens.onSurface};line-height:1.3;margin-bottom:40px;white-space:pre-line">${title}</h2>
        <div style="width:60px;height:4px;background:${accentColor};margin:0 auto 40px;border-radius:2px"></div>
        <p style="font-size:${slide.type === 'explanation' ? 38 : 40}px;color:${tokens.onSurfaceSecondary};line-height:1.8;white-space:pre-line;${BODY_CLAMP_STYLE}">${body}</p>
      </div>
      <div style="${DOTS_STYLE}">${renderDots(index, false, brandColor)}</div>
    `,
  };
}
