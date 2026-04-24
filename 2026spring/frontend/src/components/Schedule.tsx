export default function Schedule() {
  const scheduleItems = [
    {
      title: "作品投稿期間",
      date: "2026年4月22日(水) 17:00 〜 4月25日(土) 04:00",
      description: "本祭の楽曲投稿期間。指定タグをロックして投稿してください。",
      color: "step-primary", // mint
    },
    {
      title: "予選(Disc)",
      date: "2026年4月25日(土) 〜 5月10日(日)",
      description: "各Discの上位5作品はスコア公開、準決勝進出",
      color: "step-accent", // cherry
    },
    {
      title: "準決勝(Selection)",
      date: "2026年5月11日(月) 〜 5月17日(日)",
      description:
        "各Discの予選順位に基づいて振り分け。各Selection上位2作品決勝進出",
      color: "step-accent", // cherry
    },
    {
      title: "決勝(Best)",
      date: "2026年5月18日(月) 〜",
      description: "各Selectionの上位作品による最終決戦！",
      color: "step-accent", // cherry
    },
    {
      title: "結果発表",
      date: "2026年5月30日(土) 予定",
      description: "本サイトおよび公式Xにて最終結果を発表します。",
      color: "step-secondary", // skyblue
    },
  ];

  return (
    <section
      id="schedule"
      className="w-full py-24 bg-white relative overflow-hidden"
    >
      {/* うっすらとした背景装飾 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mint/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-skyblue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-mint uppercase mb-2">
            Schedule
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            スケジュール
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            ※投票状況を見て日程が前後する場合があります
          </p>
        </div>

        <div className="flex justify-center w-full">
          <ul className="steps steps-vertical lg:steps-horizontal w-full font-medium text-slate-600">
            {scheduleItems.map((item, index) => (
              <li key={index} className={`step ${item.color} leading-relaxed`}>
                <div className="mt-4 lg:mt-6 text-left lg:text-center p-4">
                  <h4 className="text-lg font-bold text-slate-800 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-mint font-semibold tracking-wide mb-3">
                    {item.date}
                  </p>
                  <p className="text-xs text-slate-500 max-w-[200px] mx-auto">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* opステージ・exステージの付記 */}
        <div className="mt-16 p-6 md:p-8 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm max-w-3xl mx-auto">
          <h4 className="text-lg font-extrabold text-slate-700 mb-6 text-center">
            併催ステージ
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-5 rounded-xl border border-mint/10 shadow-sm">
              <h5 className="font-bold text-mint text-xl tracking-wide mb-2">
                opステージ
              </h5>
              <p className="text-xs text-slate-400 font-semibold mb-3">
                2026年4月18日(土) 0:00 〜 4月22日(水) 16:59
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                人気投票に参加したくない作品はop期間に投稿してください。純粋に楽曲を聴き合うための事前投稿期間です。
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-cherry/10 shadow-sm">
              <h5 className="font-bold text-cherry text-xl tracking-wide mb-2">
                exステージ
              </h5>
              <p className="text-xs text-slate-400 font-semibold mb-3">
                2026年5月18日(月) 〜 (決勝と同時開催)
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                二次創作参加作品が対象となる特別なステージです。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
