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
              初心者の方のための投稿祭です
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
              全ての作品が必ず聞いてもらえます
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              <span className="font-bold">全投稿作品を紹介配信</span>
              します。また、投稿期間終了後、
              <span className="font-bold">人気投票</span>を行います。
            </p>
            <p className="text-xs text-slate-500 mt-2">
              ※ 投票は、投稿者以外の方も参加できます。
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-base-100 rounded-3xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-cherry/10 flex items-center justify-center mb-6 text-cherry">
              <Star size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-4">
              二次創作を強く歓迎しています
            </h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              <span className="font-bold">
                歌ってみた、弾いてみた、踊ってみた、ファンアート、紹介配信など
              </span>
              、自由な形で作品を盛り上げてください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
