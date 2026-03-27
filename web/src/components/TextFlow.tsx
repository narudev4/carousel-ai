import { useState, useCallback, useRef, useEffect } from 'react';
import { CategorySelector } from './CategorySelector';
import { FormatSelector } from './FormatSelector';
import { DetailForm } from './DetailForm';
import { SlidePreview } from './SlidePreview';
import { ResultPanel } from './ResultPanel';
import { SaveButton } from './SaveButton';
import type { GenerateResponse } from 'shared/types';

type Step = 1 | 2 | 3 | 'loading' | 'result';

const API_URL = import.meta.env.DEV ? 'http://localhost:8787' : 'https://carousel-ai-api.n4n44x.workers.dev';

const STEP_LABELS = ['カテゴリ', 'フォーマット', '詳細入力'];

interface Props {
  onBack: () => void;
}

export function TextFlow({ onBack }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState<string | null>(null);
  const [format, setFormat] = useState<string | null>(null);
  const [brandColor, setBrandColor] = useState('#E91E63');
  const [accentColor, setAccentColor] = useState('#FFC107');
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleGenerate = useCallback(async (formData: {
    theme: string;
    brandColor: string;
    accentColor: string;
    cta: string;
    additionalInfo: string;
  }) => {
    setIsLoading(true);
    setError('');
    setStep('loading');
    setBrandColor(formData.brandColor);
    setAccentColor(formData.accentColor);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          format,
          theme: formData.theme,
          brandColor: formData.brandColor,
          accentColor: formData.accentColor,
          cta: formData.cta || undefined,
          additionalInfo: formData.additionalInfo || undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data: GenerateResponse = await res.json();
      setResult(data);
      setStep('result');
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('生成に時間がかかっています。回数は消費されていません。もう一度お試しください。');
      } else {
        setError(err instanceof Error ? err.message : '生成に失敗しました');
      }
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  }, [category, format]);

  const currentStepNum = typeof step === 'number' ? step : step === 'loading' ? 3 : 3;

  return (
    <>
      {/* ステップインジケーター */}
      {typeof step === 'number' && (
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${i + 1 <= currentStepNum ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i + 1}
              </div>
              <span className={`text-sm hidden sm:inline ${i + 1 <= currentStepNum ? 'text-pink-500 font-bold' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < STEP_LABELS.length - 1 && (
                <div className={`w-8 h-0.5 ${i + 1 < currentStepNum ? 'bg-pink-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* ステップ内容 */}
      {step === 1 && (
        <CategorySelector
          selected={category}
          onSelect={setCategory}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <FormatSelector
          selected={format}
          onSelect={setFormat}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <DetailForm
          onSubmit={handleGenerate}
          onBack={() => setStep(2)}
          isLoading={isLoading}
        />
      )}

      {step === 'loading' && (
        <LoadingView />
      )}

      {step === 'result' && result && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">生成完了</h2>

          <SlidePreview
            slides={result.slides}
            brandColor={brandColor}
            accentColor={accentColor}
            slideRefs={slideRefs}
          />

          <SaveButton slideCount={result.slides.length} />

          <ResultPanel
            caption={result.caption}
            hashtags={result.hashtags}
          />

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="flex-1 py-3 border-2 border-pink-500 text-pink-500 font-bold rounded-xl hover:bg-pink-50 transition-colors"
            >
              設定を変えて生成
            </button>
            <button
              onClick={() => {
                setResult(null);
                setStep(1);
              }}
              className="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
            >
              最初から
            </button>
          </div>
        </div>
      )}

      {/* モード選択に戻る */}
      {step === 1 && (
        <button
          onClick={onBack}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600"
        >
          ← モード選択に戻る
        </button>
      )}
    </>
  );
}

// ===== ローディング =====

function LoadingView() {
  const [stepText, setStepText] = useState('テーマ分析中...');

  useEffect(() => {
    const timers = [
      setTimeout(() => setStepText('構成作成中...'), 5000),
      setTimeout(() => setStepText('テキスト生成中...'), 15000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="text-center py-20">
      <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mx-auto mb-6" />
      <p className="text-lg font-bold text-gray-700">{stepText}</p>
      <p className="text-sm text-gray-400 mt-2">30秒ほどお待ちください</p>
    </div>
  );
}
