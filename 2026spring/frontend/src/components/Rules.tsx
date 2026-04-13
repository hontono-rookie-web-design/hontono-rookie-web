import { AlertCircle } from "lucide-react";

export default function Rules() {
  const ruleItems = [
    {
      title: "参加資格について",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>ニコニコ動画にアカウントをお持ちの方</li>
          <li>以下のどちらかを満たす方：<br/>・いいね数上位3曲のいいね数の平均が概ね50以下<br/>・再生数上位3曲の再生数の平均が概ね500以下</li>
          <li>開催期間が重複する「植物ソング投稿祭2026」との同時参加OKです。<br/>（同時参加する場合は本当のルーキー祭りの投稿期間に合わせて4月22日以降に投稿してください）</li>
        </ul>
      )
    },
    {
      title: "投稿方法",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>投稿期間内に楽曲をニコニコ動画へ投稿し、<strong>「本当のルーキー祭り2026春」</strong>のタグを設定してタグロックしてください。（投稿が期間内でも、タグ設定が期間外の場合は参加できません）</li>
          <li>MVは1枚絵または紙芝居形式など、シンプルなものを推奨します。</li>
          <li>二次創作での利用を想定し、投票開始までにダウンロード可能なオフボーカル音源を公開してください。（ピアプロ・Dropboxなどの外部サービス利用可）</li>
        </ul>
      )
    },
    {
      title: "人気投票について",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li>“みんなで作品を聴き合う”ことを何より大切にしています。投票は匿名で行われます。</li>
          <li>投稿楽曲は約10曲ずつの「Disc」にグループ分けされ、各Disc内で全曲を「好きな順」に並べて投票していただきます（1曲だけ選ぶことはできません）。</li>
          <li>自分の楽曲が含まれるDiscには投票できませんが、是非とも同じDiscの皆さんで楽曲の感想を語り合ってみてください。</li>
          <li>各Discの上位曲が「Selection Disc」に進出し再投票、さらに上位曲から構成される「Best Disc」の最終投票により順位を決定します。</li>
          <li>投票期間中は運営公認のニコ生配信者による楽曲紹介配信も行われます。</li>
        </ul>
      )
    },
    {
      title: "OPステージ・EXステージ",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li><strong>OPステージ:</strong> 人気投票に参加したくない作品の投稿期間です。人気投票の対象から除外されます。参加タグは通常と同じ「本当のルーキー祭り2026春」です。</li>
          <li><strong>EXステージ:</strong> 二次創作に参加した方が参加できるステージです。参加タグは「本当のルーキー祭り2026春ex」となります。</li>
        </ul>
      )
    },
    {
      title: "セレクションCD企画・二次創作",
      content: (
        <ul className="list-disc list-inside space-y-2">
          <li><strong>セレクションCD企画:</strong> 本投稿祭は「本当のNEXTAGE祭2026」のセレクションCD企画に参加しており、セレクションCDに収録される場合があります。「セレクションCD企画参加曲」をタグロックすることで参加となり、有償販売に同意したものとみなします。</li>
          <li><strong>二次創作:</strong> 歌ってみた、ファンアートなどの二次創作を強く歓迎します。「本当のルーキー祭り2026春二次創作」をタグロックしてください。</li>
          <li>商業目的の利用（無許可での販売・グッズ化）は禁止ですが、YouTube等の収益化済み配信での利用は可能です。</li>
          <li>楽曲投稿者は、参加時点で二次創作利用に同意したものとみなします。</li>
        </ul>
      )
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
                <div>{item.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
