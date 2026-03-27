import { describe, it, expect } from 'vitest';
import { renderSlide } from '../render';
import type { Slide, SlideType } from 'shared/types';

const BRAND_COLOR = '#E91E63';
const ACCENT_COLOR = '#FFC107';

const TEST_SLIDES: Record<SlideType, Slide> = {
  cover: { type: 'cover', title: 'テストタイトル\nサブタイトル' },
  tip: { type: 'tip', number: 1, title: 'ポイント1', body: '説明テキスト' },
  before: { type: 'before', title: '改善前の状態', body: 'こんな問題がありました' },
  after: { type: 'after', title: '改善後の状態', body: 'こう変わりました' },
  explanation: { type: 'explanation', title: 'なぜ大切なのか', body: 'その理由はこちら' },
  benefit: { type: 'benefit', number: 1, title: 'メリット1', body: '具体的な利点' },
  cta: { type: 'cta', title: 'お問い合わせ', body: '初回無料カウンセリング' },
};

describe('renderSlide snapshot tests', () => {
  const slideTypes: SlideType[] = ['cover', 'tip', 'before', 'after', 'explanation', 'benefit', 'cta'];

  for (const type of slideTypes) {
    it(`${type} スライドのHTML出力が一致する`, () => {
      const slide = TEST_SLIDES[type];
      const index = type === 'cta' ? 4 : type === 'cover' ? 0 : 1;
      const result = renderSlide(slide, index, BRAND_COLOR, ACCENT_COLOR);

      expect(result.style).toMatchSnapshot();
      expect(result.innerHTML).toMatchSnapshot();
    });
  }
});
