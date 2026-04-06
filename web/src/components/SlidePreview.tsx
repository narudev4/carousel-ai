import { useRef, useMemo } from 'react';
import type { Slide } from 'shared/types';
import { renderSlide, renderSlideWithStyle } from '../templates/render';

interface Props {
  slides: Slide[];
  brandColor: string;
  accentColor: string;
  slideRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  styleId?: string;
  photoDataUri?: string;
}

export function SlidePreview({ slides, brandColor, accentColor, slideRefs, styleId, photoDataUri }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // スライドHTML生成をメモ化（同じ入力なら再計算しない）
  const renderedSlides = useMemo(() => {
    return slides.map((slide, i) => {
      if (styleId) {
        return renderSlideWithStyle(slide, i, styleId, brandColor, accentColor, photoDataUri);
      }
      return renderSlide(slide, i, brandColor, accentColor);
    });
  }, [slides, brandColor, accentColor, styleId, photoDataUri]);

  return (
    <div>
      <h3 className="font-bold text-lg mb-3">プレビュー</h3>

      {/* 横スクロールコンテナ */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {renderedSlides.map(({ style, innerHTML }, i) => (
          <div key={`${styleId || 'default'}-${i}`} className="snap-center flex-shrink-0">
            <div className="text-xs text-gray-400 mb-1 text-center">
              {i + 1} / {slides.length}
            </div>
            <div
              className="rounded-xl overflow-hidden border border-gray-200 bg-white"
              style={{ width: 270, height: 337.5 }}
            >
              <div
                style={{ ...parseStyle(style), transform: 'scale(0.25)', transformOrigin: 'top left' }}
                dangerouslySetInnerHTML={{ __html: innerHTML }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ドットインジケーター（モバイル用） */}
      <div className="flex justify-center gap-2 mt-2 md:hidden">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`${i + 1}枚目へ移動`}
            onClick={() => {
              const container = scrollRef.current;
              if (container) {
                const card = container.children[i] as HTMLElement;
                card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              }
            }}
            className="w-2 h-2 rounded-full bg-gray-300 hover:bg-pink-400 transition-colors"
          />
        ))}
      </div>

      {/* オフスクリーン: フルサイズレンダリング用（PNG変換に使用） */}
      <div style={{ position: 'absolute', left: -9999, top: 0 }}>
        {renderedSlides.map(({ style, innerHTML }, i) => (
          <div
            key={`full-${styleId || 'default'}-${i}`}
            id={`slide-full-${i}`}
            ref={(el) => { slideRefs.current[i] = el; }}
            style={parseStyle(style)}
            dangerouslySetInnerHTML={{ __html: innerHTML }}
          />
        ))}
      </div>
    </div>
  );
}

// CSSテキストをReact styleオブジェクトに変換
// data URI内の ; や : で誤分割しないよう、プロパティ境界を正規表現で検出
function parseStyle(cssText: string): React.CSSProperties {
  const style: Record<string, string> = {};
  const regex = /([a-zA-Z-]+)\s*:\s*((?:[^;]|;(?=[^a-zA-Z-]))*)/g;
  let match;
  while ((match = regex.exec(cssText)) !== null) {
    const prop = match[1].trim();
    const value = match[2].trim();
    if (prop && value) {
      const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      style[camelProp] = value;
    }
  }
  return style as React.CSSProperties;
}
