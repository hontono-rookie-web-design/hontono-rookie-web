export default function Schedule() {
  const scheduleItems = [
    {
      title: "エキシビジョンステージ(ex)",
      date: "2026年9月4日(金) 17:00 〜 9月6日(日) 16:00",
      description: "人気投票に参加しない作品の投稿期間",
      color: "step-primary",
    },
    {
      title: "作品投稿期間",
      date: "2026年9月6日(日) 17:00 〜 9月12日(土) 04:00",
      description: "本祭の楽曲投稿期間。指定タグをロックして投稿してください。",
      color: "step-primary",
    },
    {
      title: "予選(Disc)",
      date: "2026年9月14日(月) 〜 9月27日(日)",
      description: "各Discの上位作品はスコア公開、決勝進出",
      color: "step-accent",
    },
    {
      title: "決勝(Best)",
      date: "2026年10月5日(月) 〜 10月18日(日)",
      description: "各Discの上位作品による最終決戦！",
      color: "step-accent",
    },
    {
      title: "結果発表",
      date: "2026年10月19日(月) 以降",
      description: "本サイトおよび公式Xにて最終結果を発表します。",
      color: "step-secondary",
    },
  ];

  return (
    <section id="schedule" className="w-full py-24 bg-white relative overflow-hidden">
      {/* うっすらとした背景装飾 */}

      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-secondary uppercase mb-2">
            Schedule
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">スケジュール</h3>
          <p className="text-slate-500 text-sm font-medium">
            ※投票状況を見て日程が前後する場合があります
          </p>
        </div>

        <div className="flex justify-center w-full">
          <ul className="steps steps-vertical lg:steps-horizontal w-full font-medium text-slate-600">
            {scheduleItems.map((item, index) => (
              <li key={index} className={`step ${item.color} leading-relaxed`}>
                <div className="mt-4 lg:mt-6 text-left lg:text-center p-4">
                  <h4 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-secondary font-semibold tracking-wide mb-3">
                    {item.date}
                  </p>
                  <p className="text-xs text-slate-500 max-w-[200px] mx-auto">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* exステージ・SPステージの付記 */}

        <div className="mt-16 p-6 md:p-8 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm max-w-3xl mx-auto">
          <h4 className="text-lg font-extrabold text-slate-700 mb-6 text-center">併催ステージ</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-5 rounded-xl border border-primary/10 shadow-sm">
              <h5 className="font-bold text-secondary text-xl tracking-wide mb-2">exステージ</h5>
              <p className="text-xs text-slate-400 font-semibold mb-3">
                2026年9月4日(金) 17:00 〜 9月6日(日) 16:00
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                人気投票に参加したくない作品はex期間に投稿してください。純粋に楽曲を聴き合うための事前投稿期間です。
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-accent/10 shadow-sm">
              <h5 className="font-bold text-primary text-xl tracking-wide mb-2">SPステージ</h5>
              <p className="text-xs text-slate-400 font-semibold mb-3">
                2026年10月5日(月) 〜 2026年10月18日(日) 24:00
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                二次創作参加作品が対象となる特別なステージです。
                <span className="text-red-500 font-bold">投稿締切：5/30(土) 24:00</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
