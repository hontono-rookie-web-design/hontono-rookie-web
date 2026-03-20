import { Users, Music, Star } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="w-full py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-mint uppercase mb-2">About</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800">本当のルーキー祭りとは？</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center p-6 bg-base-100 rounded-3xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-mint/10 flex items-center justify-center mb-6 text-mint">
              <Users size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-4">新人クリエイターの登竜門</h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              「初めて～数回レベル」の投稿を行うボカロPなど、新しい才能を持つクリエイターが主役のイベントです。参加のハードルを下げ、次世代の才能を発掘します。
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-base-100 rounded-3xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-skyblue/10 flex items-center justify-center mb-6 text-skyblue">
              <Music size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-4">オリジナル楽曲による祭典</h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              音声合成ソフト等を利用した完全オリジナル楽曲のみが対象。クリエイター同士の交流や、新たなリスナーとの「繋がり」を生み出す場を提供します。
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-base-100 rounded-3xl shadow-sm border border-slate-100 transition-transform hover:-translate-y-1 duration-300">
            <div className="w-16 h-16 rounded-full bg-cherry/10 flex items-center justify-center mb-6 text-cherry">
              <Star size={32} />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-4">リスナーの応援が力に</h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              リスナー一人ひとりの視聴や投票が、ルーキーたちにとっての大きなステップアップのきっかけになります。あなたの「推し」を見つけよう！
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
