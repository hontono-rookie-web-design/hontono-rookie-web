import { MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <section className="w-full py-12 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
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
    </section>
  );
}
