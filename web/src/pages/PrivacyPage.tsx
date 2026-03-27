import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link to="/" className="text-pink-500 text-sm mb-4 inline-block">← トップに戻る</Link>
        <h1 className="text-2xl font-black mb-8">プライバシーポリシー</h1>
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-6 text-sm text-gray-700 leading-relaxed">
          <h2 className="font-bold text-base">収集する情報</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>アクセスログ（IPアドレス、ブラウザ情報）— Cloudflareにより自動収集</li>
            <li>利用回数管理のためのIPアドレス一時保存（24時間で自動削除）</li>
          </ul>

          <h2 className="font-bold text-base">収集しない情報</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>生成されたコンテンツ（テキスト・画像）はサーバーに保存しません</li>
            <li>個人を特定する情報（氏名、メールアドレス等）は収集しません</li>
            <li>Cookie による追跡は行いません</li>
          </ul>

          <h2 className="font-bold text-base">利用目的</h2>
          <p>収集した情報は以下の目的でのみ利用します。</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>サービスの提供・運用</li>
            <li>不正利用の防止（Rate Limiting）</li>
            <li>サービス改善のためのアクセス分析</li>
          </ul>

          <h2 className="font-bold text-base">第三者提供</h2>
          <p>法令に基づく場合を除き、収集した情報を第三者に提供することはありません。</p>

          <h2 className="font-bold text-base">お問い合わせ</h2>
          <p>プライバシーに関するお問い合わせは特定商取引法表記に記載のメールアドレスまでご連絡ください。</p>

          <p className="text-gray-400 text-xs">制定日: 2026年3月27日</p>
        </div>
      </div>
    </div>
  );
}
