import { Link as LinkIcon } from "lucide-react";

export default function PastEventLink() {
  const events = [
    {
      title: "本当のルーキー祭り2025秋",
      image: "/images/eventThird.jpg",
      url: "https://hontono-rookie2025autum.onrender.com/index.html",
    },
    {
      title: "本当のルーキー祭り2025",
      image: "/images/eventSecond.jpg",
      url: "https://huyu5masora.wixsite.com/my-site-2",
    },
    {
      title: "本当のルーキー祭り2024",
      image: "/images/eventFirst.jpg",
      url: "https://twipla.jp/events/604493",
    },
  ];

  return (
    <section className="w-full py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* タイトル */}
        <div className="flex items-center gap-3 mb-8">
          <LinkIcon className="text-skyblue w-8 h-8" />
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
            過去イベント
          </h3>
        </div>

        {/* グリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {events.map((event, idx) => (
            <a
              key={idx}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />

                {/* ホバー演出 */}
                <div className="absolute inset-0 flex items-center justify-center">

                {/* 背景 */}
                  <div className="absolute inset-0 bg-black/40 transition-all duration-300 group-hover:bg-black/60" />

                {/* テキストまとめて中央固定 */}
                  <div className="relative flex flex-col items-center justify-center text-center">

                {/* タイトル */}
                  <span className="text-white text-lg md:text-xl font-bold transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-2">
                    {event.title}
                  </span>

               {/* 詳細 */}
                <span className="absolute text-white text-lg md:text-xl font-bold opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                 詳細を見る
                </span>

                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
