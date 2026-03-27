import type { Slide, SlideType } from 'shared/types';
import type { StyleTokens, RenderResult, DesignStyle } from 'shared/templates';
import { renderCover } from './layouts/cover';
import { renderNumbered } from './layouts/numbered';
import { renderLabeled } from './layouts/labeled';
import { renderCta } from './layouts/cta';
import { minimalCleanTokens } from './tokens/minimal-clean';
import { softNaturalTokens } from './tokens/soft-natural';
import { promoBoldTokens } from './tokens/promo-bold';

// ===== スタイルレジストリ =====

const styles = new Map<string, DesignStyle>();

function registerStyle(style: DesignStyle) {
  styles.set(style.id, style);
}

export function getStyle(id: string): DesignStyle | undefined {
  return styles.get(id);
}

export function getAllStyles(): DesignStyle[] {
  return Array.from(styles.values());
}

// ===== Layer 3: SlideType → Layout Adapter =====

export function renderWithStyle(
  slide: Slide,
  index: number,
  styleId: string,
  brandColor: string,
  accentColor: string,
  photoDataUri?: string,
): RenderResult {
  const style = styles.get(styleId);
  const tokens = style ? applyBrandColors(style.tokens, brandColor, accentColor) : applyBrandColors(minimalCleanTokens, brandColor, accentColor);

  switch (slide.type) {
    case 'cover':
      return renderCover(slide, tokens, brandColor, accentColor, photoDataUri);

    case 'tip':
      return renderNumbered(slide, index, tokens, brandColor, accentColor, 'POINT', photoDataUri);

    case 'benefit':
      return renderNumbered(slide, index, tokens, brandColor, accentColor, 'MERIT', photoDataUri);

    case 'before':
    case 'after':
    case 'explanation':
      return renderLabeled(slide, index, tokens, brandColor, accentColor, photoDataUri);

    case 'cta':
      return renderCta(slide, tokens, brandColor, accentColor, photoDataUri);

    default:
      return renderNumbered(slide, index, tokens, brandColor, accentColor, 'POINT', photoDataUri);
  }
}

// ===== ブランドカラーでtokens上書き =====

function applyBrandColors(tokens: StyleTokens, brandColor: string, accentColor: string): StyleTokens {
  return {
    ...tokens,
    primary: brandColor,
    secondary: accentColor,
    badge: brandColor,
    dividerColor: accentColor,
  };
}

// ===== 初期登録 =====

registerStyle({
  id: 'minimal-clean',
  name: 'ミニマルクリーン',
  tokens: minimalCleanTokens,
  categoryMatch: ['consulting', 'education', 'realestate', 'medical', 'other'],
});

registerStyle({
  id: 'soft-natural',
  name: 'ソフトナチュラル',
  tokens: softNaturalTokens,
  categoryMatch: ['beauty', 'food'],
});

registerStyle({
  id: 'promo-bold',
  name: 'プロモボールド',
  tokens: promoBoldTokens,
  categoryMatch: ['fitness', 'retail'],
});

export { registerStyle };
