"use client";

export default function Page() {
  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">
      {/* ヘッダー */}

      <div className="text-center mb-8 w-full max-w-[760px]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">二次創作 提出フォーム</h1>

        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          「本当のルーキー祭り2026秋」の二次創作作品の提出はこちらから行えます。
        </p>
        {/* 区切り線 */}

        <div className="mt-4 border-b border-gray-200 w-full" />
      </div>
      {/* 説明 */}

      <div className="w-full max-w-[760px] mb-8 text-sm text-gray-700 leading-relaxed">
        <p>本当のルーキー祭りでは、歌ってみたやファンアートなどの二次創作を歓迎しています。</p>

        <p className="mt-2">
          本サイトに掲載する二次創作作品の情報を収集するため、作品情報の提供をお願いしております（投稿者以外の回答も可能です）。
          <br />
          本サイトへの掲載を希望する場合は、このページ下部のフォーム、または
          <a
            href="https://forms.gle/fQF2vcVvWARJzvFx6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link underline mx-1"
          >
            こちらのフォーム
          </a>
          から作品情報をご提出ください。
        </p>

        <p className="mt-2 text-xs text-gray-500">
          ※ note記事はフォームへの回答は不要です。
          <br />
          フォームにて提出された内容は、本サイトに掲載されます。
          <br />
          運営にて内容を確認するため、掲載までにお時間をいただく場合がございます。あらかじめご了承ください。
        </p>
      </div>
      {/* 注意事項 */}

      <div className="w-full max-w-[760px] mb-8 text-sm text-gray-700 space-y-5">
        {/* 投稿方法 */}

        <div>
          <p className="font-semibold mb-1">■ 二次創作投稿方法</p>

          <ul className="list-disc pl-5 space-y-1">
            <li>
              ニコニコ動画に投稿する場合は、「本当のルーキー祭り2026秋二次創作」のタグをロックしてください。
            </li>

            <li>
              noteに投稿する場合は、「本当のルーキー祭り2026秋二次創作」のタグを付けてください。
            </li>
          </ul>
        </div>
      </div>
      {/* フォーム */}

      <div className="w-full max-w-[760px]">
        <iframe
          src="https://forms.gle/fQF2vcVvWARJzvFx6"
          className="w-full h-[900px] border rounded-lg"
        />
      </div>
    </div>
  );
}
