export default function Schedule() {
  const scheduleItems = [
    {
      title: "募集期間（開催前）",
      date: "2026年3月1日 〜 3月31日 23:59",
      description: "楽曲をニコニコ動画・YouTubeに投稿。指定タグをロックしてください。",
      color: "step-primary", // mint
    },
    {
      title: "投票期間（開催中）",
      date: "2026年4月5日 〜 4月19日 23:59",
      description: "特設サイトにてリスナーからの投票を受け付けます。ぜひ多くの楽曲を聴いてください。",
      color: "step-accent", // cherry
    },
    {
      title: "結果発表（終了後）",
      date: "2026年4月下旬",
      description: "本サイトおよび公式X（旧Twitter）にて受賞作品を発表します。",
      color: "step-secondary", // skyblue
    },
  ];

  return (
    <section id="schedule" className="w-full py-24 bg-white relative overflow-hidden">
      {/* うっすらとした背景装飾 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mint/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-skyblue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-mint uppercase mb-2">Schedule</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800">スケジュール</h3>
        </div>

        <div className="flex justify-center w-full">
          <ul className="steps steps-vertical lg:steps-horizontal w-full font-medium text-slate-600">
            {scheduleItems.map((item, index) => (
              <li key={index} className={`step ${item.color} leading-relaxed`}>
                <div className="mt-4 lg:mt-6 text-left lg:text-center p-4">
                  <h4 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-mint font-semibold tracking-wide mb-3">{item.date}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
