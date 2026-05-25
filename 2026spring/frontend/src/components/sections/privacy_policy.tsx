export default function PrivacyPolicy() {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
        プライバシーポリシー
      </h1>
      <p className="text-slate-500 font-medium leading-relaxed">
        当サイトでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
        この機能はCookieを無効にすることで収集を拒否することが出来ますので、お使いのブラウザの設定をご確認ください。この規約に関しての詳細はGoogleアナリティクスサービス利用規約のページやGoogleポリシーと規約ページをご覧ください。
      </p>
    </div>
  );
}
