import { AlertCircle } from "lucide-react";

export default function Rules() {
  const ruleItems = [
    {
      title: "参加資格について",
      content:
        "初めて〜数回程度の楽曲投稿となる「ルーキー」であることが条件です。過去に一定数（例: 3曲など）以上のオリジナル楽曲を投稿していないことが基準となります。コラボレーションの場合は主宰者が基準を満たしている必要があります。",
    },
    {
      title: "楽曲の規定",
      content:
        "ボーカロイド、CeVIO、Synthesizer Vなどの音声合成ソフトウェアを使用したオリジナル楽曲に限ります。カバー曲やアレンジ曲、Remixでの参加はできません。楽曲の長さはフル尺（概ね1分半以上）を推奨します。",
    },
    {
      title: "動画の投稿方法・タグ",
      content:
        "YouTubeまたはニコニコ動画に期間内に動画を投稿してください。必ず指定のタグ（#本当のルーキー祭り2026春 など）をロックして投稿してください。指定期間外の投稿は選考・投票の対象外となります。",
    },
    {
      title: "禁止事項",
      content:
        "他者の権利を侵害する作品の投稿、AIによる完全自動生成楽曲での参加、過度な性的・暴力的表現を含む作品、特定の個人・団体を誹謗中傷する作品の投稿は固く禁じます。違反が確認された場合は参加を取り消します。",
    },
  ];

  return (
    <section id="rules" className="w-full py-24 bg-base-100/50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-mint uppercase mb-2">Rules</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800">参加ルール・要項</h3>
          <p className="text-slate-500 mt-4 text-sm mt-6 flex items-center justify-center gap-2">
            <AlertCircle size={16} className="text-cherry" />
            エントリー前に必ずすべての項目をご確認ください
          </p>
        </div>

        <div className="space-y-4">
          {ruleItems.map((item, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-white border border-slate-100 shadow-sm"
            >
              <input type="checkbox" name="rules-accordion" />
              <div className="collapse-title text-lg font-bold text-slate-700">
                {item.title}
              </div>
              <div className="collapse-content text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                <p>{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
