"use client";

import { EVENT_PHASES, getCurrentPhase } from "@/config/phase";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const phase = mounted ? getCurrentPhase() : EVENT_PHASES.BEFORE;

  const renderCTA = () => {
    switch (phase) {
      case EVENT_PHASES.BEFORE:
        return (
          <a href="#rules" className="btn btn-primary btn-lg rounded-full text-white shadow-lg shadow-mint/30">
            参加ルールを読む <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        );
      case EVENT_PHASES.OPENING:
        return (
          <a
            href="/submissions/songs/opening"
            className="btn btn-accent btn-lg rounded-full text-white shadow-lg shadow-cherry/30"
          >
            参加楽曲ページへ <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        );
      case EVENT_PHASES.ROOKIE:
        return (
          <a
            href="/submissions/songs/rookie"
            className="btn btn-accent btn-lg rounded-full text-white shadow-lg shadow-cherry/30"
          >
            参加楽曲ページへ <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        );
      case EVENT_PHASES.PRELIM:
        return (
          <a
            href="/submissions/vote/preliminaries"
            className="btn btn-accent btn-lg rounded-full text-white shadow-lg shadow-cherry/30"
          >
            人気投票ページへ <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        );
      case EVENT_PHASES.SEMIFINAL:
        return (
          <a
            href="/submissions/vote/semifinals"
            className="btn btn-accent btn-lg rounded-full text-white shadow-lg shadow-cherry/30"
          >
            人気投票ページへ <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        );
      case EVENT_PHASES.FINAL:
        return (
          <a
            href="/submissions/vote/finals"
            className="btn btn-accent btn-lg rounded-full text-white shadow-lg shadow-cherry/30"
          >
            人気投票ページへ <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        );
      case EVENT_PHASES.AFTER:
        return (
          <a
            href="/submissions/vote/finals"
            className="btn btn-secondary btn-lg rounded-full text-white shadow-lg shadow-skyblue/30"
          >
            結果発表を見る <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-base-100 to-mint/10">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="#2DD4BF" strokeWidth="1" className="animate-[pulse_4s_ease-in-out_infinite]" />
          <line x1="30%" y1="40%" x2="60%" y2="15%" stroke="#38BDF8" strokeWidth="1" className="animate-[pulse_5s_ease-in-out_infinite]" />
          <line x1="60%" y1="15%" x2="85%" y2="35%" stroke="#2DD4BF" strokeWidth="1" className="animate-[pulse_3s_ease-in-out_infinite]" />
          <line x1="30%" y1="40%" x2="45%" y2="70%" stroke="#FB7185" strokeWidth="1" className="animate-[pulse_4.5s_ease-in-out_infinite]" />
          <line x1="45%" y1="70%" x2="75%" y2="80%" stroke="#38BDF8" strokeWidth="1" className="animate-[pulse_3.5s_ease-in-out_infinite]" />
          <line x1="60%" y1="15%" x2="75%" y2="80%" stroke="#2DD4BF" strokeWidth="0.5" strokeDasharray="4 4" className="animate-[pulse_6s_ease-in-out_infinite]" />

          <circle cx="10%" cy="20%" r="4" fill="#2DD4BF" className="animate-ping" />
          <circle cx="10%" cy="20%" r="6" fill="#2DD4BF" />

          <circle cx="30%" cy="40%" r="4" fill="#38BDF8" className="animate-pulse" />
          <circle cx="30%" cy="40%" r="8" fill="#38BDF8" opacity="0.8" />

          <circle cx="60%" cy="15%" r="3" fill="#2DD4BF" className="animate-ping" />
          <circle cx="60%" cy="15%" r="5" fill="#2DD4BF" />

          <circle cx="85%" cy="35%" r="4" fill="#FB7185" className="animate-pulse" />
          <circle cx="85%" cy="35%" r="7" fill="#FB7185" opacity="0.9" />

          <circle cx="45%" cy="70%" r="5" fill="#FB7185" className="animate-ping" />
          <circle cx="45%" cy="70%" r="8" fill="#FB7185" />

          <circle cx="75%" cy="80%" r="4" fill="#38BDF8" className="animate-pulse" />
          <circle cx="75%" cy="80%" r="6" fill="#38BDF8" opacity="0.8" />
        </svg>
      </div>

     <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-[-10vh]">

  <Image
    src="/2026spring_logo.png"
    alt="本当のルーキー祭り2026春"
    width={1200}
    height={600}
    className="w-[280px] md:w-[420px] lg:w-[520px] h-auto mb-6 drop-shadow-sm"
  />

  <p className="text-xl md:text-2xl text-slate-600 mb-10 font-medium">
    ボカロP等の新人クリエイター向け楽曲投稿イベント
  </p>

  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
    {renderCTA()}
  </div>

  <div className="mt-8 flex flex-wrap gap-4 justify-center">
    <a href="https://www.nicovideo.jp/watch/sm46006887" target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400">
      説明会動画を見る
    </a>
  </div>

  <p className="mt-8 text-sm text-slate-500 max-w-md mx-auto">
    投稿祭の進行は
    <a href="https://x.com/SynNightPsub?s=20" target="_blank" rel="noopener noreferrer" className="text-skyblue font-medium text-fg-brand hover:underline">
      公式Xアカウント
    </a>
    で随時連絡します。<br className="hidden sm:block" />
    フォローすると人気投票しやすくなります。
  </p>

</div>
    </section>
  );
}
