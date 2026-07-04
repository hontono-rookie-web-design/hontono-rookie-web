import { HeartHandshake } from "lucide-react";

export default function Sponsors() {
  return (
    <section className="w-full py-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <HeartHandshake className="text-slate-500 w-8 h-8" />

          <h3 className="text-2xl md:text-3xl font-bold text-slate-800">
            後援
          </h3>
        </div>

        <div className="p-8 bg-gradient-to-br from-white to-slate-100 rounded-3xl shadow-sm border border-slate-200 mb-6">
          <h4 className="text-xl font-bold text-slate-800 mb-2">ヴォエ</h4>

          <p className="text-slate-600 text-sm mb-6">
            この投稿祭は「ヴォエ」が後援しています。
          </p>

          <a
            href="https://x.com/vliverofepic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-mint hover:underline"
          >
            公式X
          </a>
        </div>

        <div className="p-8 bg-gradient-to-br from-white to-slate-100 rounded-3xl shadow-sm border border-slate-200 mb-6">
          <h4 className="text-xl font-bold text-slate-800 mb-2">NFRSラジオ</h4>

          <p className="text-slate-600 text-sm mb-6">
            この投稿祭は「NFRSラジオ」が後援しています。
          </p>

          <a
            href="https://x.com/nfrs_radio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-mint hover:underline"
          >
            公式X
          </a>
        </div>

        <div className="p-8 bg-gradient-to-br from-white to-slate-100 rounded-3xl shadow-sm border border-slate-200 mb-6">
          <h4 className="text-xl font-bold text-slate-800 mb-2">
            山梨大学DTM(作曲)サークルWineRed
          </h4>

          <p className="text-slate-600 text-sm mb-6">
            この投稿祭は「山梨大学DTM(作曲)サークルWineRed」が後援しています。
          </p>

          <a
            href="https://x.com/YU_WineRed"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-mint hover:underline"
          >
            公式X
          </a>
        </div>

        <div className="p-8 bg-gradient-to-br from-white to-slate-100 rounded-3xl shadow-sm border border-slate-200 mb-6">
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
    </section>
  );
}
