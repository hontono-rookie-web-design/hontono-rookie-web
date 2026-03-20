import { Layout } from "lucide-react";

export default function DerivativePage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
          <Layout size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">二次創作参加方法</h1>
      </div>
      
      <div className="prose prose-slate prose-lg max-w-none">
        <p className="lead text-slate-600">
          参加楽曲に対するイラスト、Remix、歌ってみたなどの二次創作による参加方法です。
        </p>
        <p>ここに参加資格、応募手順、タグ等のルールを追加します。</p>
      </div>
    </div>
  );
}
