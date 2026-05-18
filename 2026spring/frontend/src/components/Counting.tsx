import { Anchor } from "lucide-react";

export default function TBA({ title }: { title: string }) {
  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-mint/10 rounded-full flex items-center justify-center mb-8 text-mint shadow-inner">
        <Anchor size={48} className="animate-pulse" />
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">{title}</h1>
      <p className="text-slate-500 font-medium leading-relaxed">
        こちらのコンテンツは現在準備中です。<br className="hidden sm:block" />
        公開まで今しばらくお待ちください。
      </p>
    </div>
  );
}
