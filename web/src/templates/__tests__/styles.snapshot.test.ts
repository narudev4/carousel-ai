import { describe, it, expect } from 'vitest';
import { renderSlideWithStyle } from '../render';
import type { Slide, SlideType } from 'shared/types';

const BRAND_COLOR = '#E91E63';
const ACCENT_COLOR = '#FFC107';

const STYLES = ['minimal-clean', 'soft-natural', 'promo-bold'] as const;

const SLIDE_CASES: { type: SlideType; slide: Slide; index: number }[] = [
  { type: 'cover', slide: { type: 'cover', title: 'テストカバー' }, index: 0 },
  { type: 'tip', slide: { type: 'tip', number: 1, title: 'ポイント', body: '説明' }, index: 1 },
  { type: 'cta', slide: { type: 'cta', title: 'CTA', body: 'アクション' }, index: 4 },
];

for (const styleId of STYLES) {
  describe(`${styleId} スタイル`, () => {
    for (const { type, slide, index } of SLIDE_CASES) {
      it(`${type} スライド`, () => {
        const result = renderSlideWithStyle(slide, index, styleId, BRAND_COLOR, ACCENT_COLOR);
        expect(result.style).toMatchSnapshot();
        expect(result.innerHTML).toMatchSnapshot();
      });
    }
  });
}
