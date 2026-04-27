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
          <li>歌ってみた、ファンアートなどの二次創作を強く歓迎します。</li>
          <li>ニコニコ動画にアップロードする場合、「本当のルーキー祭り2026春二次創作」をタグロックしてください。</li>
          <li>noteに投稿する場合、「本当のルーキー祭り2026春二次創作」のタグをつけてください。</li>
          <li>指定のGoogleフォームに投稿内容を入力してください。本サイトに反映されます。投稿者以外が入力しても構いません。</li>
          <li>※ note投稿者はGoogleフォームへの回答は不要です。</li>
          <li>商業目的の利用（無許可での販売・グッズ化）は禁止ですが、YouTube等の収益化済み配信での利用は可能です。</li>
          <li>ルーキー歌い手は開催期間内に、ニコニコ動画へ新規投稿する必要があります。</li>
          <li>つまり、期間前にニコニコ動画へ投稿してしまうと、その動画では参加できなくなります。</li>
          <li>楽曲投稿者は、参加時点で二次創作利用に同意したものとみなします。</li>
          <li>詳しいルールについては本当のルーキー祭り2026春二次創作者募集要項をご確認ください。</li>
        </ul>
      </div>

      {/* フォーム */}
      <div className="w-full max-w-[760px]">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSczlIrsD3P3AEpbpKirIp8ZZFF6MWlLU2uSPXNTPHw3oicgBA/viewform"
          className="w-full h-[900px] border rounded-lg"
        />
      </div>
    </div>
  );
}
