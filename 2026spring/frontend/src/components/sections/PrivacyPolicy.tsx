export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6">
      <p className="w-full py-6 text-slate-400 text-center text-sm bg-white">
        当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
        この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関しての詳細は
        <a
          href="https://marketingplatform.google.com/about/analytics/terms/jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mint hover:underline"
        >
          Googleアナリティクスサービス利用規約
        </a>
        のページや
        <a
          href="https://policies.google.com/technologies/ads?hl=ja"
          target="_blank"
          rel="noopener noreferrer"
          className="text-mint hover:underline"
        >
          Googleポリシーと規約
        </a>
        ページをご覧ください。
      </p>
    </div>
  );
}
