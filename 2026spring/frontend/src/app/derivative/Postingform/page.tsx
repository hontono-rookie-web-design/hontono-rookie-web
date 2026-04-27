export default function DerivativeVotePage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        二次創作投票フォーム
      </h1>

      <p className="mb-6">
        ・歌ってみた、ファンアートなどの二次創作を強く歓迎します。
        ・ニコニコ動画にアップロードする場合、「本当のルーキー祭り2026春二次創作」をタグロックしてください。
        ・noteに投稿する場合、「本当のルーキー祭り2026春二次創作」のタグをつけてください。
        ・指定のGoogleフォームに投稿内容を入力してください。本サイトに反映されます。投稿者以外が入力しても構いません。
        　※ note投稿者はGoogleフォームへの回答は不要です。
        ・商業目的の利用（無許可での販売・グッズ化）は禁止ですが、YouTube等の収益化済み配信での利用は可能です。
        ・ルーキー歌い手は開催期間内に、ニコニコ動画へ新規投稿する必要があります。
        　つまり、期間前にニコニコ動画へ投稿してしまうと、その動画では参加できなくなります。
        ・楽曲投稿者は、参加時点で二次創作利用に同意したものとみなします。
        ・詳しいルールについては本当のルーキー祭り2026春二次創作者募集要項をご確認ください。
      </p>

      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSczlIrsD3P3AEpbpKirIp8ZZFF6MWlLU2uSPXNTPHw3oicgBA/viewform"
        width="100%"
        height="800"
        className="border rounded-lg"
      />
    </main>
  );
}
