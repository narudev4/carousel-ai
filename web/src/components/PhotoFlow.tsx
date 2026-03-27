import { useState, useCallback, useRef, useEffect } from 'react';
import { PhotoUpload } from './PhotoUpload';
import { SlidePreview } from './SlidePreview';
import { ResultPanel } from './ResultPanel';
import { SaveButton } from './SaveButton';
import { StyleSwitcher } from './StyleSwitcher';
import type { PhotoAnalyzeResponse } from 'shared/types';

const API_URL = import.meta.env.DEV ? 'http://localhost:8793' : 'https://carousel-ai-api.n4n44x.workers.dev';
const MAX_RETRIES = 3;

type Phase = 'upload' | 'loading' | 'result';

const PROGRESS_LABELS = ['写真解析中', 'テキスト生成中', 'スライド描画中', '完了'];

interface Props {
  onBack: () => void;
}

export function PhotoFlow({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>('upload');
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [result, setResult] = useState<PhotoAnalyzeResponse | null>(null);
  const [styleId, setStyleId] = useState('minimal-clean');
  const [error, setError] = useState('');
  const [errorStep, setErrorStep] = useState<string | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handlePhotoUpload = useCallback((base64: string, dataUri: string) => {
    setPhotoBase64(base64);
    setPhotoDataUri(dataUri);
    setError('');
    setErrorStep(null);
  }, []);

  const generate = useCallback(async () => {
    if (!photoBase64) return;
    if (retryCount >= MAX_RETRIES) {
      setError('リトライ上限に達しました。しばらく時間をおいてお試しください。');
      return;
    }

    setPhase('loading');
    setError('');
    setErrorStep(null);
    setProgressStep(0);

    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort(), 90000);

    try {
      setProgressStep(1); // 写真解析中
      const res = await fetch(`${API_URL}/api/photo-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: photoBase64,
          mimeType: 'image/jpeg',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        if (err.step === 'vision') {
          setError('写真の解析に失敗しました。再試行してください。');
          setErrorStep('vision');
        } else if (err.step === 'textgen') {
          setError('テキスト生成に失敗しました。再試行してください。');
          setErrorStep('textgen');
          if (err.vision) {
            console.log('Vision result:', err.vision);
          }
        } else {
          setError(err.error || `HTTP ${res.status}`);
        }
        setPhase('upload');
        setRetryCount((c) => c + 1);
        return;
      }

      setProgressStep(2); // テキスト生成完了

      const data: PhotoAnalyzeResponse = await res.json();
      console.log('Generated:', data);

      setProgressStep(3); // スライド描画中
      setResult(data);
      setStyleId(data.recommendedStyleId || 'minimal-clean');

      setProgressStep(4); // 完了
      setPhase('result');
      setRetryCount(0);
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('生成に時間がかかっています。もう一度お試しください。');
      } else {
        setError(err instanceof Error ? err.message : '生成に失敗しました');
      }
      setPhase('upload');
      setRetryCount((c) => c + 1);
    }
  }, [photoBase64, retryCount]);

  return (
    <>
      {/* アップロードフェーズ */}
      {phase === 'upload' && (
        <>
          <PhotoUpload onUpload={handlePhotoUpload} onBack={onBack} />

          {/* エラー表示 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <p>{error}</p>
              {errorStep && (
                <p className="text-xs text-red-400 mt-1">
                  {errorStep === 'vision' ? '写真解析ステップでエラー' : 'テキスト生成ステップでエラー'}
                </p>
              )}
            </div>
          )}

          {/* 生成ボタン */}
          {photoBase64 && (
            <button
              onClick={generate}
              disabled={!photoBase64}
              className="mt-6 w-full py-4 bg-pink-500 text-white font-bold text-lg rounded-xl hover:bg-pink-600 disabled:bg-gray-300 transition-colors"
            >
              カルーセルを生成
            </button>
          )}
        </>
      )}

      {/* ローディングフェーズ */}
      {phase === 'loading' && (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-6" />

          {/* 4段階プログレス */}
          <div className="flex justify-center gap-2 mb-6">
            {PROGRESS_LABELS.map((label, i) => (
              <div
                key={i}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all
                  ${i + 1 < progressStep ? 'bg-green-100 text-green-700' : ''}
                  ${i + 1 === progressStep ? 'bg-pink-500 text-white' : ''}
                  ${i + 1 > progressStep ? 'bg-gray-100 text-gray-400' : ''}
                `}
              >
                {label}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-400">しばらくお待ちください</p>
        </div>
      )}

      {/* 結果フェーズ */}
      {phase === 'result' && result && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">生成完了</h2>

          {/* スタイル切り替え */}
          <StyleSwitcher
            styles={result.availableStyles || ['minimal-clean', 'soft-natural', 'promo-bold']}
            activeId={styleId}
            recommendedId={result.recommendedStyleId || 'minimal-clean'}
            onChange={setStyleId}
          />

          <SlidePreview
            slides={result.slides}
            brandColor="#E91E63"
            accentColor="#FFC107"
            slideRefs={slideRefs}
            styleId={styleId}
            photoDataUri={photoDataUri || undefined}
          />

          <SaveButton slideCount={result.slides.length} />

          <ResultPanel
            caption={result.caption}
            hashtags={result.hashtags}
          />

          <div className="flex gap-3">
            <button
              onClick={() => {
                setResult(null);
                setPhase('upload');
              }}
              className="flex-1 py-3 border-2 border-pink-500 text-pink-500 font-bold rounded-xl hover:bg-pink-50 transition-colors"
            >
              別の写真で生成
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              モード選択に戻る
            </button>
          </div>
        </div>
      )}
    </>
  );
}
