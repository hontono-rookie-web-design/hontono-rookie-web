import { HeartHandshake, Link as LinkIcon, MessageCircle } from "lucide-react";

export default function LinksAndSponsors() {
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
    <section id="links" className="w-full py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* 関連リンク */}
        <div className="mb-20">
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

        {/* お問い合わせ */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <MessageCircle className="text-cherry w-8 h-8" />
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
              お問い合わせ
            </h3>
          </div>
          <div className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 text-center">
            <p className="text-slate-600 mb-6">
              ご不明点は、公式X（旧Twitter）へDMいただくか、公式Discordにてお問い合わせください。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://x.com/SynNightPsub?s=20"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700"
              >
                公式XへDMを送る
              </a>
              <a
                href="https://discord.gg/XfM6KqZbPT"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline border-slate-300 hover:bg-slate-50 hover:border-slate-400 text-slate-700"
              >
                公式Discordに参加
              </a>
            </div>
          </div>
        </div>

        {/* 後援 */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <HeartHandshake className="text-slate-500 w-8 h-8" />
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
              後援
            </h3>
          </div>
          <div className="p-8 bg-gradient-to-br from-white to-slate-100 rounded-3xl shadow-sm border border-slate-200">
            <h4 className="text-xl font-bold text-slate-800 mb-2">
              楽曲収益化サービス
            </h4>
            <p className="text-slate-600 text-sm mb-6">
              この投稿祭は「楽曲収益化サービス」が後援しています。
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://site.nrc-form.jp/?transit_from=userfes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-mint hover:underline"
              >
                公式サイト
              </a>
              <a
                href="https://x.com/dwango_nrc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-skyblue hover:underline"
              >
                公式X
              </a>
              <a
                href="https://discord.gg/WtWVvVzwpj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-cherry hover:underline"
              >
                公式Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
