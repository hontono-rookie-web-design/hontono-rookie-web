"use client";

import { useEffect, useState } from "react";
import { EVENT_PHASES, EventPhase, getCurrentPhase } from "@/config/phase";
import { Sparkles, PlayCircle, Trophy } from "lucide-react";

export default function BottomCTA() {
  const [phase, setPhase] = useState<EventPhase>(EVENT_PHASES.BEFORE);

  useEffect(() => {
    setPhase(getCurrentPhase());
  }, []);

  const renderContent = () => {
    switch (phase) {
      case EVENT_PHASES.BEFORE:
        return (
          <>
            <h3 className="text-3xl font-bold text-slate-800 mb-4">エントリー受付中！</h3>
            <p className="text-slate-600 mb-10 max-w-lg mx-auto">
              ルールをご確認の上、あなたの渾身の1曲でぜひご参加ください。新しい才能の原石をお待ちしています。
            </p>
            <a href="#" className="btn btn-primary btn-wide btn-lg rounded-full text-white shadow-xl shadow-mint/20 hover:scale-105 transition-transform">
              <Sparkles className="mr-2" /> エントリーフォームへ
            </a>
          </>
        );
      case EVENT_PHASES.DURING:
        return (
          <>
            <h3 className="text-3xl font-bold text-slate-800 mb-4">ただいま投票受付中！</h3>
            <p className="text-slate-600 mb-10 max-w-lg mx-auto">
              すべての参加楽曲が視聴可能です。お気に入りの楽曲を見つけて推しクリエイターを応援しましょう。
            </p>
            <a href="#" className="btn btn-accent btn-wide btn-lg rounded-full text-white shadow-xl shadow-cherry/20 hover:scale-105 transition-transform">
              <PlayCircle className="mr-2" /> 楽曲一覧・投票へ
            </a>
          </>
        );
      case EVENT_PHASES.AFTER:
        return (
          <>
            <h3 className="text-3xl font-bold text-slate-800 mb-4">結果発表</h3>
            <p className="text-slate-600 mb-10 max-w-lg mx-auto">
              すべての審査・集計が完了しました。数多くの素晴らしい楽曲と応援を本当にありがとうございました。
            </p>
            <a href="#" className="btn btn-secondary btn-wide btn-lg rounded-full text-white shadow-xl shadow-skyblue/20 hover:scale-105 transition-transform">
              <Trophy className="mr-2" /> 最終結果を見る
            </a>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full py-32 bg-gradient-to-t from-base-200 to-white text-center">
      <div className="max-w-3xl mx-auto px-6">
        {renderContent()}
      </div>
    </section>
  );
}
