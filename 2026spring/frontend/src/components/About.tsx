import { Music, Star, Users } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="w-full py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-mint uppercase mb-2">
            About
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800">
            本当のルーキー祭りとは？
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center p-6 bg-base-100 rounded-3xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-mint/10 flex items-center justify-center mb-6 text-mint">
              <Users size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-4">
              一歩を踏み出すきっかけ
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              このイベントは、
              <span className="font-bold">
                “これからのボカロP”が新しい一歩を踏み出すきっかけ
              </span>
              になることを大切にしています。
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-base-100 rounded-3xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-skyblue/10 flex items-center justify-center mb-6 text-skyblue">
              <Music size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-4">
              交流が広がる場
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              投票の仕組みはありますが、決して「順位を競う場」だけではありません。
              <span className="font-bold">
                作品をきっかけにクリエイターやリスナー同士の交流が広がること
              </span>
              を目指しています。
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-base-100 rounded-3xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-cherry/10 flex items-center justify-center mb-6 text-cherry">
              <Star size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-4">
              自分の好きを見つける場
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              すべての参加作品をみんなで聴き合うことを大切にしています。順位だけに一喜一憂せず、是非ともあなただけの「好き」を見つけて楽しんでください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
