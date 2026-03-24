import { Info } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-mint/10 flex items-center justify-center text-mint">
          <Info size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">イベントについて</h1>
      </div>
      
      <div className="prose prose-slate prose-lg max-w-none">
        <p className="lead text-slate-600">
          「本当のルーキー祭り2026春」は、新しい才能の発掘とクリエイター同士の交流を目的とした楽曲投稿イベントです。
        </p>
        <p>ここに詳細なイベント概要、理念、およびメッセージを追加します。</p>
      </div>
    </div>
  );
}
