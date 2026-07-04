import { Link as LinkIcon } from "lucide-react";

export default function RelatedLinks() {
  const guidelineLinks = [
    {
      title: "本当のルーキー祭り2026春投稿者募集要項",
      desc: "投稿者向け募集要項です。",
      url: "https://note.com/syn523/n/n5ee5e731c3d6?sub_rt=share_pw",
    },
    {
      title: "本当のルーキー祭り2026春二次創作者募集要項",
      desc: "二次創作者向け募集要項です。",
      url: "https://note.com/syn523/n/n8c309f89031e?sub_rt=share_pw",
    },
    {
      title: "本当のルーキーイラスト投稿祭募集要項",
      desc: "絵師の二次創作者向け投稿祭です。",
      url: "https://note.com/syn523/n/nabf1e9f2e437?sub_rt=share_pw",
    },
    {
      title: "本当のルーキー祭り2026春人気投票募集要項",
      desc: "リスナー向け人気投票募集要項です。",
      url: "https://note.com/syn523/n/n3269782e9e16?sub_rt=share_pw",
    },
  ];

  const resourceLinks = [
    {
      title: "本当のルーキー祭り公式X",
      desc: "最新情報やQ&Aを発信しています。",
      url: "https://x.com/SynNightPsub?s=20",
    },
    {
      title: "本当のルーキー祭り公式Discord",
      desc: "質問や交流はこちらでどうぞ。",
      url: "https://discord.gg/XfM6KqZbPT",
    },
    {
      title: "本当のルーキー祭り2026春TwiPla",
      desc: "イベントの詳細やスケジュールを掲載しています。",
      url: "https://twipla.jp/events/705065",
    },
    {
      title: "本当のルーキー祭り2026春 - 初音ミク Wiki",
      desc: "イベントの概要や関連情報が掲載されています。",
      url: "https://w.atwiki.jp/hmiku/pages/72938.html",
    },
    {
      title: "ボカロ15秒投稿祭",
      desc: "告知動画はこちらを活用できます。",
      url: "https://twipla.jp/events/722107",
    },
    {
      title: "認定活動者",
      desc: "作品制作に活用してください。",
      url: "https://note.com/syn523/n/n9150f6246aef?sub_rt=share_pw",
    },
    {
      title: "ボカロPルーキー図鑑",
      desc: "申請だけで掲載されます。参加記念としてどうぞ。",
      url: "https://www.vocalop-rookie.com/",
    },
  ];

  return (
    <section id="links" className="w-full py-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <LinkIcon className="text-mint w-8 h-8" />
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
            関連リンク
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 border-b border-white pb-2">
              各種募集要項
            </h4>

            {guidelineLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-mint/50 hover:shadow-md transition-all"
              >
                <div className="font-bold text-mint text-sm mb-1">
                  {link.title}
                </div>

                <div className="text-xs text-slate-500">{link.desc}</div>
              </a>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 border-b border-white pb-2">
              参加者向けリソース
            </h4>

            {resourceLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-skyblue/50 hover:shadow-md transition-all"
              >
                <div className="font-bold text-skyblue text-sm mb-1">
                  {link.title}
                </div>

                <div className="text-xs text-slate-500">{link.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
