import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ヒーロー */}
      <section className="bg-gradient-to-br from-pink-500 to-pink-700 text-white">
        <div className="max-w-4xl mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            あなた専用のIG投稿を<br />AIが30秒で生成
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            アカウント情報を登録するだけ。ジャンル・ターゲット・口調を覚えたAIが、毎回あなたらしい5枚カルーセル投稿＋キャプション＋ハッシュタグを自動生成します。
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

      {/* パーソナライズ訴求 */}
      <section className="py-16 md:py-20 bg-pink-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            「あなたらしさ」を覚えて生成するAI
          </h2>
          <p className="text-gray-600 mb-10 max-w-xl mx-auto">
            初回1分でアカウント情報を登録。以降はテーマを入力するだけで、あなたのジャンル・ターゲット層・目標・口調に合わせた投稿が完成します。
          </p>
          <div className="grid md:grid-cols-4 gap-6 text-left">
            {[
              { icon: '🎯', label: 'ジャンル', desc: 'カフェ・美容師・税理士など業種に特化したコピー' },
              { icon: '👥', label: 'ターゲット', desc: '30代女性・個人事業主など読者像に刺さる表現' },
              { icon: '🗣️', label: '口調', desc: 'フレンドリー・専門的・カジュアルなど4種から選択' },
              { icon: '📈', label: '目標', desc: 'フォロワー増・予約獲得・認知拡大に最適なフック' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="font-bold text-pink-600 mb-1">{item.label}</div>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
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
              { icon: '🤷', title: '汎用AIの投稿は自分らしくない', desc: 'ChatGPTに頼んでも、自分のアカウントの雰囲気と合わない。' },
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

      {/* 4ステップ */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-12">
            4ステップで完成
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'アカウント登録（初回1分）', desc: 'ジャンル・ターゲット・目標・口調を入力。2回目以降はスキップ。' },
              { step: '2', title: 'カテゴリを選ぶ', desc: '美容・飲食・フィットネスなど9カテゴリから選択' },
              { step: '3', title: 'テーマを入力', desc: '「秋の新メニュー紹介」など、投稿したい内容を一言で' },
              { step: '4', title: 'AIが自動生成', desc: '5枚スライド＋キャプション＋ハッシュタグが30秒で完成' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-pink-500 text-white rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
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
              { q: '何が生成されますか？', a: 'IGカルーセル投稿用の5枚スライド、キャプション、ハッシュタグが生成されます。アカウント情報に合わせてパーソナライズされます。' },
              { q: '本当に無料ですか？', a: 'はい、現在は完全無料でご利用いただけます。1日10回まで生成できます。' },
              { q: 'ChatGPT・Canvaと何が違いますか？', a: 'Canvaはデザインツール、ChatGPTは汎用AIです。carousel-aiはInstagram専用で、あなたのアカウント情報を覚えて毎回パーソナライズされた投稿を生成します。' },
              { q: 'アカウント情報はどこに保存されますか？', a: 'アカウント情報はお使いのブラウザのローカルストレージにのみ保存されます。サーバーには送信されません。' },
              { q: '生成されたコンテンツの著作権は？', a: '生成されたコンテンツの著作権はユーザーに帰属します。自由にご利用ください。' },
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
            あなた専用のIG投稿を作ろう
          </h2>
          <p className="text-lg opacity-90 mb-8">初回登録1分。2回目以降はテーマを入力するだけです。</p>
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
