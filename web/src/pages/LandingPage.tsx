import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ヒーロー */}
      <section className="bg-gradient-to-br from-pink-500 to-pink-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            30秒でプロ品質の<br />IG投稿が完成
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            カテゴリとテーマを選ぶだけ。AIが5枚のカルーセル投稿+キャプション+ハッシュタグを自動生成。
          </p>
          <Link
            to="/generate"
            className="inline-block bg-white text-pink-600 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            無料で試す →
          </Link>
          <p className="text-sm opacity-70 mt-4">登録不要・完全無料</p>
        </div>
      </section>

      {/* ペインポイント */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-12">
            こんな悩みありませんか？
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '⏰', title: '投稿作成に2時間', desc: '毎回デザインとコピーに時間がかかる。本業に集中できない。' },
              { icon: '🌍', title: '海外ツールは日本語が不自然', desc: '英語UIで使いづらい。生成される日本語が翻訳っぽい。' },
              { icon: '🤷', title: '何を投稿すべきかわからない', desc: 'Canvaはデザインは作れるけど、内容は自分で考える必要がある。' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3ステップ */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-12">
            3ステップで完成
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'カテゴリを選ぶ', desc: '美容、飲食、フィットネスなど9つのカテゴリから選択' },
              { step: '2', title: 'テーマを入力', desc: '「秋の新メニュー紹介」など、投稿したい内容を一言で' },
              { step: '3', title: 'AIが自動生成', desc: '5枚のスライド+キャプション+ハッシュタグが30秒で完成' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-12">
            よくある質問
          </h2>
          <div className="space-y-4">
            {[
              { q: '何が生成されますか？', a: 'IGカルーセル投稿用の5枚のスライド画像、キャプション、ハッシュタグが生成されます。' },
              { q: '本当に無料ですか？', a: 'はい、現在は完全無料でご利用いただけます。1日10回まで生成できます。' },
              { q: 'Canvaと何が違いますか？', a: 'Canvaはデザインツールですが、carousel-aiはテーマを入力するだけでデザイン+コピー+ハッシュタグまで全て自動生成します。' },
              { q: '生成されたコンテンツの著作権は？', a: '生成されたコンテンツの著作権はユーザーに帰属します。自由にご利用ください。' },
              { q: 'データは保存されますか？', a: '生成データはサーバーに保存されません。ブラウザ上で処理が完結します。' },
            ].map((item, i) => (
              <details key={i} className="bg-white rounded-xl p-4 shadow-sm group">
                <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                  {item.q}
                  <span className="text-pink-500 group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="text-sm text-gray-600 mt-3">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* フッターCTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-pink-500 to-pink-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            今すぐ試してみよう
          </h2>
          <p className="text-lg opacity-90 mb-8">登録不要。30秒で最初の投稿が完成します。</p>
          <Link
            to="/generate"
            className="inline-block bg-white text-pink-600 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            無料で生成する →
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-sm text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <div className="flex justify-center gap-6">
            <Link to="/terms" className="hover:text-white">利用規約</Link>
            <Link to="/privacy" className="hover:text-white">プライバシーポリシー</Link>
            <Link to="/tokusho" className="hover:text-white">特定商取引法表記</Link>
          </div>
          <p>&copy; 2026 carousel-ai</p>
        </div>
      </footer>
    </div>
  );
}
