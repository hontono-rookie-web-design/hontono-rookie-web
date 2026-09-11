const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf5w0e6qlsbV0iGWcnimnXk34MW68gPdYKK3-Qii388px2y1w/viewform";

export default function Page() {
  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">
      {/* ヘッダー */}

      <div className="text-center mb-8 w-full max-w-[760px]">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">ボカナイト音源 提出フォーム</h1>

        <p className="text-xs sm:text-sm text-gray-600 mt-2">
	  SOUND UP STATION -NFRS- | ネットラジオ
	</p>
	<p>
　こちらのラジオで放送していただくための楽曲・コメント提出フォームはこちらです。
        </p>
        {/* 区切り線 */}

        <div className="mt-4 border-b border-gray-200 w-full" />
      </div>
      {/* 説明 */}

      <div className="w-full max-w-[760px] mb-8 text-sm text-gray-700 leading-relaxed">

        <p className="mt-2">
          ラジオでの紹介を希望する場合は、このページ下部のフォーム、または
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link underline mx-1"
          >
            こちらのフォーム
          </a>
          から作品情報をご提出ください。
        </p>

      </div>
      {/* フォーム */}

      <div className="w-full max-w-[760px]">
        <iframe
          src={'${FORM_URL}?embedded=true'}
          className="w-full h-[900px] border rounded-lg"
        />
      </div>
    </div>
  );
}
