interface Props {
  styles: string[];
  activeId: string;
  recommendedId: string;
  onChange: (styleId: string) => void;
}

const STYLE_NAMES: Record<string, string> = {
  'minimal-clean': 'ミニマル',
  'soft-natural': 'ナチュラル',
  'promo-bold': 'ボールド',
};

export function StyleSwitcher({ styles, activeId, recommendedId, onChange }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      <span className="text-sm text-gray-500 self-center mr-1">スタイル:</span>
      {styles.map((id) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all relative
            ${id === activeId
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-300'
            }`}
        >
          {STYLE_NAMES[id] || id}
          {id === recommendedId && (
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              AI
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
