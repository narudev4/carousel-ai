import { useState } from 'react';

interface FormData {
  theme: string;
  brandColor: string;
  accentColor: string;
  cta: string;
  additionalInfo: string;
}

interface Props {
  onSubmit: (data: FormData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function DetailForm({ onSubmit, onBack, isLoading }: Props) {
  const [theme, setTheme] = useState('');
  const [brandColor, setBrandColor] = useState('#E91E63');
  const [accentColor, setAccentColor] = useState('#FFC107');
  const [cta, setCta] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = theme.trim();
    if (trimmed.length < 5) {
      setError('テーマを5文字以上入力してください');
      return;
    }
    setError('');
    onSubmit({ theme: trimmed, brandColor, accentColor, cta, additionalInfo });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">詳細を入力</h2>
      <p className="text-sm text-gray-500 mb-6">テーマを入力して生成しましょう</p>

      <div className="space-y-5">
        {/* テーマ */}
        <div>
          <label className="block text-sm font-bold mb-1">
            テーマ <span className="text-pink-500">*</span>
          </label>
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            maxLength={200}
            placeholder="例: 秋の新メニュー紹介"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
          />
          <div className="flex justify-between mt-1">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <p className="text-xs text-gray-400 ml-auto">{theme.length}/200</p>
          </div>
        </div>

        {/* カラー */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">ブランドカラー</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{brandColor}</span>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-bold mb-1">アクセントカラー</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-10 h-10 rounded border-0 cursor-pointer"
              />
              <span className="text-sm text-gray-500">{accentColor}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div>
          <label className="block text-sm font-bold mb-1">CTA（任意）</label>
          <input
            type="text"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            maxLength={100}
            placeholder="例: プロフィールのリンクから予約"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none"
          />
        </div>

        {/* 追加情報 */}
        <div>
          <label className="block text-sm font-bold mb-1">追加情報（任意）</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="店舗名、キャンペーン詳細など"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none resize-none"
          />
          <p className="text-xs text-gray-400 text-right mt-1">{additionalInfo.length}/500</p>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-3 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-40"
        >
          ← 戻る
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-8 py-3 bg-pink-500 text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
        >
          {isLoading ? '生成中...' : '生成する ✨'}
        </button>
      </div>
    </div>
  );
}
