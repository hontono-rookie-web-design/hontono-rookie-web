import { CONFIG } from "@/config/config";
import { EVENT_PHASES, getCurrentPhase } from "@/config/phase";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const phase = getCurrentPhase();

  const renderCTA = () => {
    switch (phase) {
      case EVENT_PHASES.BEFORE:
        return (
          <Link
            href="#rules"
            prefetch={false}
            className="btn btn-primary btn-lg rounded-full shadow-lg shadow-primary/30 border-none"
          >
            参加ルールを読む
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        );
      case EVENT_PHASES.EXTRA:
        return (
          <Link
            href="/submissions/songs/extra"
            prefetch={false}
            className="btn btn-accent btn-lg rounded-full shadow-lg shadow-accent/30"
          >
            参加楽曲ページへ
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        );
      case EVENT_PHASES.ROOKIE:
      case EVENT_PHASES.PRELIM_COUNTING:
      case EVENT_PHASES.FINAL_COUNTING:
        return (
          <Link
            href="/submissions/songs/rookie"
            prefetch={false}
            className="btn btn-accent btn-lg rounded-full shadow-lg shadow-accent/30"
          >
            参加楽曲ページへ
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        );
      case EVENT_PHASES.PRELIM:
        return (
          <Link
            href="/submissions/vote/preliminaries"
            prefetch={false}
            className="btn btn-accent btn-lg rounded-full shadow-lg shadow-accent/30"
          >
            人気投票ページへ
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        );
      case EVENT_PHASES.SEMIFINAL:
        return (
          <Link
            href="/submissions/vote/semifinals"
            prefetch={false}
            className="btn btn-accent btn-lg rounded-full shadow-lg shadow-accent/30"
          >
            人気投票ページへ
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        );
      case EVENT_PHASES.FINAL:
        return (
          <Link
            href="/submissions/vote/finals"
            prefetch={false}
            className="btn btn-accent btn-lg rounded-full shadow-lg shadow-accent/30"
          >
            人気投票ページへ
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        );
      case EVENT_PHASES.AFTER:
        return (
          <Link
            href="/submissions/vote/finals"
            prefetch={false}
            className="btn btn-secondary btn-lg rounded-full shadow-lg shadow-secondary/30"
          >
            人気投票結果を見る
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-base-100 to-secondary/10">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="10%"
            y1="20%"
            x2="30%"
            y2="40%"
            stroke="var(--color-primary)"
            strokeWidth="1"
            className="animate-[pulse_4s_ease-in-out_infinite]"
          />

          <line
            x1="30%"
            y1="40%"
            x2="60%"
            y2="15%"
            stroke="var(--color-secondary)"
            strokeWidth="1"
            className="animate-[pulse_5s_ease-in-out_infinite]"
          />

          <line
            x1="60%"
            y1="15%"
            x2="85%"
            y2="35%"
            stroke="var(--color-primary)"
            strokeWidth="1"
            className="animate-[pulse_3s_ease-in-out_infinite]"
          />

          <line
            x1="30%"
            y1="40%"
            x2="45%"
            y2="70%"
            stroke="var(--color-accent)"
            strokeWidth="1"
            className="animate-[pulse_4.5s_ease-in-out_infinite]"
          />

          <line
            x1="45%"
            y1="70%"
            x2="75%"
            y2="80%"
            stroke="var(--color-secondary)"
            strokeWidth="1"
            className="animate-[pulse_3.5s_ease-in-out_infinite]"
          />

          <line
            x1="60%"
            y1="15%"
            x2="75%"
            y2="80%"
            stroke="var(--color-primary)"
            strokeWidth="0.5"
            strokeDasharray="4 4"
            className="animate-[pulse_6s_ease-in-out_infinite]"
          />

          <circle cx="10%" cy="20%" r="4" fill="var(--color-primary)" className="animate-ping" />

          <circle cx="10%" cy="20%" r="6" fill="var(--color-primary)" />

          <circle cx="30%" cy="40%" r="4" fill="var(--color-secondary)" className="animate-pulse" />

          <circle cx="30%" cy="40%" r="8" fill="var(--color-secondary)" opacity="0.8" />

          <circle cx="60%" cy="15%" r="3" fill="var(--color-primary)" className="animate-ping" />

          <circle cx="60%" cy="15%" r="5" fill="var(--color-primary)" />

          <circle cx="85%" cy="35%" r="4" fill="var(--color-accent)" className="animate-pulse" />

          <circle cx="85%" cy="35%" r="7" fill="var(--color-accent)" opacity="0.9" />

          <circle cx="45%" cy="70%" r="5" fill="var(--color-accent)" className="animate-ping" />

          <circle cx="45%" cy="70%" r="8" fill="var(--color-accent)" />

          <circle cx="75%" cy="80%" r="4" fill="var(--color-secondary)" className="animate-pulse" />

          <circle cx="75%" cy="80%" r="6" fill="var(--color-secondary)" opacity="0.8" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto mt-[-10vh]">
        <Image
          src="/images/2026autumn_logo.png"
          alt={CONFIG.event.name}
          width={2000}
          height={1300}
          priority
          sizes="(max-width: 768px) 357px, (max-width: 1024px) 535px, 663px"
          className="w-[357px] md:w-[535px] lg:w-[663px] h-auto mt-20 mb-6 drop-shadow-sm"
        />

        <p className="text-xl md:text-2xl text-slate-600 mb-10 font-medium">
          ボカロP等の新人クリエイター向け楽曲投稿イベント
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          {renderCTA()}
        </div>

        <p className="mt-8 text-sm text-slate-500 max-w-md mx-auto">
          投稿祭の進行は
          <a
            href="https://x.com/SynNightPsub?s=20"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link font-medium hover:underline"
          >
            公式Xアカウント
          </a>
          で随時連絡します。
          <br className="hidden sm:block" />
          フォローすると人気投票しやすくなります。
        </p>
      </div>
    </section>
  );
}
