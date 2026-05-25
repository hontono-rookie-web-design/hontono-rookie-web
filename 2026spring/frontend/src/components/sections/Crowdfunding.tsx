import { HeartHandshake } from "lucide-react";
import Image from "next/image";

export default function Crowdfunding() {
  return (
    <section className="w-full py-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <HeartHandshake className="text-slate-500 w-8 h-8" />

          <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
            本当の投稿祭運営委員会
          </h3>
        </div>

        <div className="p-8 bg-gradient-to-br from-white to-slate-100 rounded-3xl shadow-sm border border-slate-200">
          <h4 className="text-xl font-bold text-slate-800 mb-2">
            本当の祭プロジェクトCD制作クラウドファンディング
          </h4>

          <p className="text-slate-600 text-sm mb-6">
            大阪新世界の音楽フェスにて披露する楽曲を収録した「公式コンピレーションCD」を制作するためのクラウドファンディングを実施中です。
          </p>

          <a
            href="https://camp-fire.jp/projects/916894/view"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-mint hover:underline"
          >
            ボカロが街を熱くした日を、永遠に― 本当の投稿祭セレクションCD制作PJー
          </a>

          <div className="mt-6 flex justify-center">
            <Image
              src="/honto-crowdfunding.png"
              alt="クラウドファンディング紹介画像"
              width={800}
              height={450}
              sizes="(max-width: 768px) 100vw, 768px"
              className="w-full max-w-xl h-auto rounded-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
