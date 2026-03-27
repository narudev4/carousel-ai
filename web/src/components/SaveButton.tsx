import { useState } from 'react';
import { toPng } from 'html-to-image';

interface Props {
  slideCount: number;
}

// フォントをbase64化してキャッシュ
let fontCSSCache: string | null = null;

async function getFontCSS(): Promise<string> {
  if (fontCSSCache) return fontCSSCache;

  try {
    const res = await fetch('https://fonts.gstatic.com/s/notosansjp/v56/-F62fjtqLzI2JPCgQBnw7HFowwII2lc.woff2');
    const blob = await res.blob();
    const dataUrl: string = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    fontCSSCache = `
      @font-face {
        font-family: 'Noto Sans JP';
        font-style: normal;
        font-weight: 100 900;
        src: url(${dataUrl}) format('woff2');
      }
    `;
  } catch {
    // フォントfetch失敗時は空文字（ブラウザのフォントを使う）
    fontCSSCache = '';
  }
  return fontCSSCache;
}

export function SaveButton({ slideCount }: Props) {
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [pngUrls, setPngUrls] = useState<string[]>([]);
  const [showImages, setShowImages] = useState(false);

  const handleConvert = async () => {
    setSaving(true);
    setStatus('フォント読み込み中...');
    setPngUrls([]);
    setShowImages(false);

    try {
      await document.fonts.ready;
      const fontCSS = await getFontCSS();
      const dataUrls: string[] = [];

      for (let i = 0; i < slideCount; i++) {
        setStatus(`変換中... (${i + 1}/${slideCount})`);
        const el = document.getElementById(`slide-full-${i}`);
        if (!el) {
          console.error(`slide-full-${i} not found`);
          continue;
        }

        // リトライ付き
        let success = false;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const dataUrl = await toPng(el, {
              width: 1080,
              height: 1350,
              pixelRatio: 1,
              cacheBust: false,
              fontEmbedCSS: fontCSS || undefined,
            });

            const base64 = dataUrl.split(',')[1];
            const sizeKB = Math.round(base64.length * 0.75 / 1024);

            if (sizeKB >= 10) {
              dataUrls.push(dataUrl);
              success = true;
              break;
            }
            console.warn(`Slide ${i + 1} attempt ${attempt + 1}: too small (${sizeKB}KB)`);
          } catch (e) {
            console.warn(`Slide ${i + 1} attempt ${attempt + 1} error:`, e);
          }
          await new Promise((r) => setTimeout(r, 500));
        }

        if (!success) {
          setStatus(`スライド ${i + 1} の変換に失敗しました`);
        }
      }

      if (dataUrls.length === 0) {
        setStatus('画像の変換に失敗しました');
        setSaving(false);
        return;
      }

      setPngUrls(dataUrls);

      // モバイル判定（タッチデバイス + 画面幅768px未満）
      const isMobile = 'ontouchstart' in window && window.innerWidth < 768;

      if (isMobile) {
        // モバイル: Web Share API
        try {
          const files = dataUrls.map((url, idx) => {
            const [header, base64] = url.split(',');
            const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
            const binary = atob(base64);
            const array = new Uint8Array(binary.length);
            for (let j = 0; j < binary.length; j++) array[j] = binary.charCodeAt(j);
            return new File([new Blob([array], { type: mime })], `carousel-${idx + 1}.png`, { type: 'image/png' });
          });

          if (navigator.canShare?.({ files })) {
            await navigator.share({ files, title: 'カルーセル投稿画像' });
            setStatus('共有完了');
            setSaving(false);
            return;
          }
        } catch (e) {
          if (e instanceof DOMException && e.name === 'AbortError') {
            setStatus('');
            setSaving(false);
            return;
          }
        }
      }

      // デスクトップ or フォールバック: 画像を画面に表示
      setShowImages(true);
      setStatus('');
    } catch (err) {
      console.error('Conversion error:', err);
      setStatus(`エラー: ${err instanceof Error ? err.message : '不明'}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleConvert}
        disabled={saving}
        className="w-full py-4 bg-pink-500 text-white font-bold text-lg rounded-xl disabled:opacity-50 hover:bg-pink-600 transition-colors"
      >
        {saving ? status : '画像を保存'}
      </button>

      {!saving && status && (
        <p className="text-sm text-center text-gray-500 mt-2">{status}</p>
      )}

      {/* 変換結果の画像表示 */}
      {showImages && pngUrls.length > 0 && (
        <div className="mt-4 space-y-4">
          <p className="text-sm font-bold text-gray-700">
            生成された画像（長押しまたは右クリックで保存）
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {pngUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                download={`carousel-${i + 1}.png`}
                className="block"
              >
                <img
                  src={url}
                  alt={`スライド ${i + 1}`}
                  className="w-full rounded-lg border border-gray-200 shadow-sm"
                />
                <p className="text-xs text-center text-gray-400 mt-1">
                  スライド {i + 1}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
