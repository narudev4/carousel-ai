import { Link } from 'react-router-dom';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/" className="text-pink-500 text-sm mb-4 inline-block">← トップに戻る</Link>
        <h1 className="text-2xl font-black mb-8">利用規約</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <p>この利用規約（以下「本規約」）は、carousel-ai（以下「本サービス」）の利用条件を定めるものです。</p>

          <h2 className="font-bold text-base">第1条（生成コンテンツの権利）</h2>
          <p>本サービスで生成されたコンテンツ（テキスト、画像デザイン）の著作権はユーザーに帰属します。商用利用を含め、自由にご利用いただけます。</p>

          <h2 className="font-bold text-base">第2条（AI生成物の免責）</h2>
          <p>本サービスはAI（人工知能）によりコンテンツを生成しています。生成されたコンテンツの正確性、適法性、適切性について保証するものではありません。生成コンテンツの利用に起因する損害について、運営者は一切の責任を負いません。</p>

          <h2 className="font-bold text-base">第3条（法令遵守）</h2>
          <p>薬機法、景品表示法、医療広告ガイドラインその他の関連法令の遵守はユーザーの責任とします。生成されたコンテンツを投稿・公開する前に、各自で適法性をご確認ください。</p>

          <h2 className="font-bold text-base">第4条（禁止事項）</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>APIへの不正アクセスまたは過度な負荷をかける行為</li>
            <li>本サービスを利用した違法行為</li>
            <li>他者の権利を侵害するコンテンツの生成</li>
            <li>本サービスのリバースエンジニアリング</li>
          </ul>

          <h2 className="font-bold text-base">第5条（サービスの変更・停止）</h2>
          <p>運営者は、事前の通知なく本サービスの内容を変更、または提供を停止・終了する権利を留保します。</p>

          <p className="text-gray-400 text-xs">制定日: 2026年3月27日</p>
        </div>
      </div>
    </div>
  );
}
