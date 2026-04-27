"use client";

export default function Page() {
  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">
      {/* ヘッダー */}
      <div className="text-center mb-8 w-full max-w-[760px]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          二次創作投票フォーム
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          二次創作作品の投票はこちらから行えます。
        </p>

        <div className="mt-4 border-b border-gray-200 w-full" />
      </div>

      {/* 注意事項 */}
      <div className="w-full max-w-[760px] mb-8">
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          <li>歌ってみた、ファンアートなどの二次創作を歓迎します。</li>
          <li>ニコニコ動画投稿時は「本当のルーキー祭り2026春二次創作」をタグロックしてください。</li>
          <li>note投稿時は同タグをつけてください。</li>
          <li>投稿内容はGoogleフォームから入力してください。</li>
          <li>※ note投稿者はフォーム回答不要です。</li>
          <li>商用利用は禁止（収益化済み配信は可）です。</li>
        </ul>
      </div>

      {/* フォーム */}
      <div className="w-full max-w-[760px]">
        <iframe
          src="https://docs.google.com/forms/d/e/あなたのフォームURL/viewform"
          className="w-full h-[900px] border rounded-lg"
        />
      </div>
    </div>
  );
}
