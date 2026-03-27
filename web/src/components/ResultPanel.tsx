import { useState } from 'react';

interface Props {
  caption: string;
  hashtags: string[];
}

export function ResultPanel({ caption, hashtags }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyText = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* キャプション */}
      <div className="bg-white p-4 rounded-xl border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">キャプション</h3>
          <button
            onClick={() => copyText(caption, 'caption')}
            className="text-sm text-pink-500 font-bold hover:text-pink-600"
          >
            {copied === 'caption' ? '✓ コピーしました' : 'コピー'}
          </button>
        </div>
        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{caption}</p>
      </div>

      {/* ハッシュタグ */}
      <div className="bg-white p-4 rounded-xl border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold">ハッシュタグ</h3>
          <button
            onClick={() => copyText(hashtags.join(' '), 'hashtags')}
            className="text-sm text-pink-500 font-bold hover:text-pink-600"
          >
            {copied === 'hashtags' ? '✓ コピーしました' : '全コピー'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {hashtags.map((tag, i) => (
            <span key={i} className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400">AI（DeepSeek）が生成したコンテンツです</p>
    </div>
  );
}
