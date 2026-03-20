import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-mint/10 flex items-center justify-center text-mint">
          <Mail size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">お問い合わせ</h1>
      </div>
      
      <div className="prose prose-slate prose-lg max-w-none">
        <p className="lead text-slate-600">
          イベントに関するお問い合わせは、公式X（旧Twitter）のDMまたは以下のフォームからお願いいたします。
        </p>
        <p>※現在フォームは準備中です。</p>
      </div>
    </div>
  );
}
