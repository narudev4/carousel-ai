import { FORMATS } from 'shared/formats';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function FormatSelector({ selected, onSelect, onNext, onBack }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">フォーマットを選択</h2>
      <p className="text-sm text-gray-500 mb-6">投稿の構成を選んでください</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FORMATS.map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => onSelect(fmt.id)}
            className={`p-5 rounded-xl border-2 text-left transition-all
              ${selected === fmt.id
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <h3 className="font-bold text-lg mb-2">{fmt.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{fmt.description}</p>
            <div className="flex gap-1">
              {fmt.slides.map((s, i) => (
                <div
                  key={i}
                  className={`h-8 rounded text-xs flex items-center justify-center font-medium
                    ${s.type === 'cover' || s.type === 'cta'
                      ? 'bg-pink-100 text-pink-700 flex-1'
                      : 'bg-gray-100 text-gray-600 flex-1'
                    }`}
                >
                  {s.type === 'cover' ? '表紙' : s.type === 'cta' ? 'CTA' : s.number ?? i}
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
        >
          ← 戻る
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="px-8 py-3 bg-pink-500 text-white font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-pink-600 transition-colors"
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
