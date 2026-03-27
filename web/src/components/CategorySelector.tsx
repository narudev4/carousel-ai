import { CATEGORIES } from 'shared/categories';

interface Props {
  selected: string | null;
  onSelect: (id: string) => void;
  onNext: () => void;
}

export function CategorySelector({ selected, onSelect, onNext }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">カテゴリを選択</h2>
      <p className="text-sm text-gray-500 mb-6">あなたの業種に近いものを選んでください</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
              ${selected === cat.id
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
          >
            <span className="text-2xl">{cat.icon}</span>
            <span className="font-bold">{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
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
