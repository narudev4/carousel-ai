interface Props {
  onSelect: (mode: 'text' | 'photo') => void;
}

export function ModeSelector({ onSelect }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">カルーセルを作る</h2>
      <p className="text-center text-gray-500 text-sm mb-8">作成方法を選んでください</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* テキストモード */}
        <button
          onClick={() => onSelect('text')}
          className="p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-pink-400 hover:shadow-lg transition-all text-left group"
        >
          <div className="text-3xl mb-3">✏️</div>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-pink-500 transition-colors">テキストで作る</h3>
          <p className="text-sm text-gray-500 mt-2">カテゴリとテーマを入力して、AIがテキストとデザインを生成します</p>
        </button>

        {/* 写真モード */}
        <button
          onClick={() => onSelect('photo')}
          className="p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-pink-400 hover:shadow-lg transition-all text-left group relative"
        >
          <div className="absolute top-3 right-3 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</div>
          <div className="text-3xl mb-3">📷</div>
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-pink-500 transition-colors">写真から作る</h3>
          <p className="text-sm text-gray-500 mt-2">写真を1枚アップするだけ。AIが内容を分析して自動生成します</p>
        </button>
      </div>
    </div>
  );
}
