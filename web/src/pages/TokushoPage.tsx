import { Link } from 'react-router-dom';

export function TokushoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/" className="text-pink-500 text-sm mb-4 inline-block">← トップに戻る</Link>
        <h1 className="text-2xl font-black mb-8">特定商取引法に基づく表記</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm text-sm text-gray-700 leading-relaxed">
          <table className="w-full">
            <tbody className="divide-y">
              {[
                ['事業者名', '（公開前に記入）'],
                ['代表者', '（公開前に記入）'],
                ['所在地', '（公開前に記入）'],
                ['連絡先', '（公開前に記入）'],
                ['販売価格', '現在無料'],
                ['支払方法', '—'],
                ['返品・キャンセル', 'デジタルコンテンツのため返品不可'],
                ['返信目安', 'お問い合わせから3営業日以内'],
              ].map(([label, value], i) => (
                <tr key={i}>
                  <th className="py-3 pr-4 text-left font-bold w-1/3">{label}</th>
                  <td className="py-3">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-gray-400 text-xs mt-6">制定日: 2026年3月27日</p>
        </div>
      </div>
    </div>
  );
}
