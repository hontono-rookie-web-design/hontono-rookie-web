import { AlertCircle } from "lucide-react";

export default function Rules() {
  const ruleItems = [
    {
      title: "参加資格について",
      content: (
        <div>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>ニコニコ動画にアカウントをお持ちの方</li>
            <li>
              ニコニコ動画に投稿した作品について、
              <span className="font-bold">以下のどちらかを満たす方</span>
              （2026/4/1時点の実績で判定）
              <br />
              <ul className="list-disc list-outside ml-6 mt-2 space-y-2">
                <li>
                  いいね数上位3曲のいいね数の平均が
                  <span className="font-bold">概ね50以下</span>
                  （～70程度を想定）
                </li>
                <li>
                  再生数上位3曲の再生数の平均が
                  <span className="font-bold">概ね500以下</span>
                  （～700程度を想定）
                </li>
              </ul>
            </li>
          </ul>
          <h3 className="text-lg font-semibold mt-4 mb-2">注意</h3>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              3曲に満たない場合は0いいね、0再生とカウントします。再生300が1作品のみの方は(300+0+0)/3=平均100再生とします。
            </li>
            <li>
              開催期間が重複する
              <span className="font-bold">「植物ソング投稿祭2026」</span>
              との同時参加OKです。
              <br />
              （同時参加する場合は本当のルーキー祭りの投稿期間に合わせて4月22日以降に投稿してください）
            </li>
            <li>
              条件を満たしておらず投稿できない方は、人気投票、二次創作、exステージ、本当のNEXTAGE投稿祭などに参加できます。
            </li>
            <li>
              本当のルーキー祭り2026春に参加した場合は
              <span className="font-bold">「本当のNEXTAGE投稿祭」</span>
              には参加できません。（本当のNEXTAGEの参加条件、本当のルーキー祭りに参加できないことに反するため）
              <br />
              ただし、本当のルーキー祭り2026春に参加した結果、それ以降に作品が伸びて、本当のルーキー祭りに参加できなくなり、本当のNEXTAGE投稿祭に参加するのはOKです。
              <div className="m-4 border-l-4 border-slate-200 pl-4">
                <h4 className="text-md font-semibold mt-2">
                  本当のNEXTAGE参加OKの例
                </h4>
                本当のルーキー後に伸びた場合
                <br />
                例）本ルー400 ボカコレ夏600
                <h4 className="text-md font-semibold mt-2">
                  本当のNEXTAGE参加NGの例
                </h4>
                本当のルーキー時点でNEXTAGEを選べる条件で、本ルーに参加したのに、NEXTAGEに参加する。
                <br />
                例）本ルー600 ボカコレ夏600
              </div>
              本当のNEXTAGEを創設の目的は、本当のルーキー祭りのレベルインフレに歯止めを掛け、初心者の参加障壁を下げるためです。参加機会の増加ではありません。
              趣旨のご理解をお願いします。
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "投稿方法",
      content: (
        <div>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              ニコニコ動画に投稿して、
              <span className="font-bold">「本当のルーキー祭り2026春」</span>
              のタグを設定し、タグロックしてください。
            </li>
            <li>
              セレクションCD企画にも参加する方は、さらに
              <span className="font-bold">「セレクションCD企画参加曲」</span>
              のタグも設定し、タグロックしてください。
            </li>
            <li>
              投稿作品とは別にMV作品を投稿する場合は、MV作品側に
              <span className="font-bold">「本当のルーキー祭り2026春MV」</span>
              のタグを設定し、タグロックしてください。
            </li>
          </ul>
          <p className="text-sm font-semibold text-cherry mt-2">
            ※ タグに#や「」は不要です。
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">
            投稿を以って下記の趣旨に同意したものとします。
          </h3>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              <span className="font-bold">
                人気投票によるランキング付けをします。
              </span>
              <br />
              作品をじっくり聴いてもらうため、推してくれてる人を可視化するのが目的です。作品に序列をつけるのが目的ではありません。
            </li>
            <li>
              <span className="font-bold">
                投稿作品は二次創作として許可なく無断で使用される場合があります。
              </span>
              <br />
              二次創作による手続きを簡素化し、本家の紹介、宣伝を促進するのが目的です。二次創作を通じて本家への導線にします。二次創作音源を無断で販売、視聴により収益化することはありません。ただし、投げ銭システムのある媒体（ニコニコ生放送など）で紹介、宣伝目的で使用する可能性はあります。
            </li>
          </ul>
          <p className="text-slate-600 leading-relaxed text-sm mt-4 mb-4">
            詳しいルールについては
            <a
              href="https://note.com/syn523/n/n5ee5e731c3d6?sub_rt=share_pw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skyblue font-medium text-fg-brand hover:underline"
            >
              本当のルーキー祭り2026春投稿者募集要項
            </a>
            をご確認ください。
          </p>
        </div>
      ),
    },
    {
      title: "投稿作品の条件",
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">必須条件</h3>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              <span className="font-bold">
                投稿期間内に楽曲をニコニコ動画へ投稿すること。
              </span>
              <br />
              投稿が期間内でも、タグ設定が期間外の場合は参加できません。
            </li>
            <li>
              他媒体も含めて<span className="font-bold">未投稿の新曲</span>
              であること。
              <br />
              過去曲にタグをつけただけ、YouTube版をニコニコ動画に投稿しただけは不可。
              WIP、告知、知人にのみ公開などはOK。
            </li>
            <li>
              YouTubeへの同時投稿、投コメでのYoutubeへの誘導もOKです。
              <br />
              MV版をYouTubeに投稿する場合など活用してください。
            </li>
            <li>
              <span className="font-bold">
                初心者が敷居を感じないようなシンプルな動画であること。
              </span>
              <br />
              歌詞表示や複数枚のイラストを使用した紙芝居形式可。
              別に用意したMV作品をYoutubeに投稿するのは可（別タグでニコ動でも可）
            </li>
            <li>
              <span className="font-bold">
                投稿は1アカウント1作品であること。
              </span>
              <br />
              中の人が複数人いる場合は人数分参加OKです。事前にその旨を連絡してください。
            </li>
            <li>
              <span className="font-bold">
                ボカロ（合成音声）作品であること。
              </span>
              <br />
              歌い手ボーカルだと人気投票での判断が難しくなるためです。
            </li>
            <li>
              <span className="font-bold">
                オフボーカル音源が用意されていること。
              </span>
              <br />
              動画ではなく、音声ファイルでお願いします。
              歌みたミックスするためです。 二次創作で使用します。
              オフボーカルの公開は作品の投稿日前でもOKです。
              (投コメにリンクを貼るため)
            </li>
            <li>
              <span className="font-bold">歌詞が用意されていること。</span>
              <br />
              投稿者コメントに貼る、テキストファイルでオフボと一緒にアップする、ピアプロ投稿など分かれば何でもいいです。
              歌ってみたの練習に必要です。動画内歌詞表示のみだと追うのが大変です。
            </li>
          </ul>
          <p className="text-sm text-slate-500 mt-2">
            ※ オフボーカル音源、歌詞が用意できない場合は相談、連絡してください。
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">任意条件</h3>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              <span className="font-bold">原曲のMP3を提出。</span>
              <br />
              ルーキーイラスト投稿祭、歌みた練習などに使用するため
            </li>
            <li>
              <span className="font-bold">作品をMIDI形式で用意。</span>
              <br />
              二次創作を簡易化して促進するため
            </li>
            <li>
              <span className="font-bold">作品のメロディを楽譜で用意。</span>
              <br />
              二次創作を簡易化して促進するため。
              楽譜作成にはMusescoreが使えます。
            </li>
          </ul>
          <p className="text-sm text-slate-500 mt-2">
            オフボーカル音源、MIDIなどの関連ファイルは提出方法の例として以下があります。基本的に所在が分かれば自由です。投稿作品の投稿者コメントに貼って頂くのが分かりやすいです。
          </p>
          <ul className="list-disc list-outside ml-6 text-sm text-slate-500 space-y-2 mt-2">
            <li>ギガファイル便にまとめて投稿者コメントにリンクを貼る。</li>
            <li>ピアプロに投稿する。</li>
            <li>ニコニコモンズを活用する。</li>
          </ul>
          <p className="text-sm text-slate-500 mt-2">
            参考：
            <a
              href="https://x.com/sumobi126759/status/2040464042284941327?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E2040464042284941327%7Ctwgr%5E8b84d798f038a4b0f023c300f5ca46140c77cd4a%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fnote.com%2Fsyn523%2Fn%2Fn5ee5e731c3d6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skyblue font-medium text-fg-brand hover:underline"
            >
              musescoreでの楽譜作成方法
            </a>
          </p>
          <p className="text-sm text-slate-500 mt-2">
            ルーキー祭りでは創作のサポートとしてクリエーターを斡旋しています。
            認定活動者はルーキー祭り界隈では有名な方達です。認定活動者とコラボすることにより、大きな注目を集めることが期待できます。
            <br />
            <a
              href="https://note.com/syn523/n/n9150f6246aef?sub_rt=share_pw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skyblue font-medium text-fg-brand hover:underline"
            >
              ルーキー祭り認定活動者
            </a>
          </p>
          <p className="text-slate-600 leading-relaxed text-sm mt-4 mb-4">
            詳しいルールについては
            <a
              href="https://note.com/syn523/n/n5ee5e731c3d6?sub_rt=share_pw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skyblue font-medium text-fg-brand hover:underline"
            >
              本当のルーキー祭り2026春投稿者募集要項
            </a>
            をご確認ください。
          </p>
        </div>
      ),
    },
    {
      title: "人気投票について",
      content: (
        <div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">
            投票に関する注意事項
          </h3>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              投票は<span className="font-bold">匿名</span>で行われます。
            </li>
            <li>
              投稿楽曲は抽選で
              <span className="font-bold">約10曲ずつの「Disc」</span>
              にグループ分けされ、各Disc内で「好きな順」に並べて投票していただきます,
            </li>
            <li>
              <span className="font-bold">人気投票は誰でも参加できます。</span>
              （音楽活動者でなくてもOK）
            </li>
            <li>
              投稿者が自曲が含まれるDiscへ投票する場合、自曲は1位に投票してください。(投票促進のため)
            </li>
            <li>
              <span className="font-bold">動画は採点の対象外です。</span>
              (動画不慣れな方への配慮)
            </li>
            <li>10作品毎に分けられたマイリスを用意します。</li>
            <li>各グループの投票用Googleフォームにアクセスしてください。</li>
            <li>
              1番好きな作品から順番に
              <span className="font-bold">1位、2位、3位・・10位</span>
              を投票してください。
            </li>
            <li>全曲を順位づけする形式のため、1曲だけ選ぶことはできません</li>
            <li>
              Disc内で相対評価人気投票をします。(1位作品:10点、・・・、10位作品:1点)
            </li>
            <li>
              自分の独断で投票してください。
              <span className="font-bold">
                投票理由や音楽的な知識はいりません。
              </span>
            </li>
            <li>
              <span className="font-bold">1グループから投票できます。</span>
              全グループ投票しなくても大丈夫です。
            </li>
            <li>期間中に非公開になった動画は1点にしてください。</li>
            <li>
              自分はこの曲を1位に投票したよ！は自己責任で公開してもOKです。
            </li>
            <li>“みんなで作品を聴き合う”ことを何より大切にしています。</li>
            <li>
              投票期間中は
              <span className="font-bold">
                運営公認のニコ生配信者による楽曲紹介配信
              </span>
              も行われます。
            </li>
          </ul>
          <h3 className="text-lg font-bold text-slate-700 mt-4 mb-2">
            予選（Disc）
          </h3>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              人気投票の結果
              <span className="font-bold">上位半数を予選通過</span>
              とし、スコアを公開します。
            </li>
            <li>
              下位の方でも個別に問い合わせ頂ければスコアをお渡しします。
              <br />
              スコアを自身で公開するのもOKです。
              <br />
              ただし順位は非公開としてください。（みんなが順位を公開すると消去法で他者の順位が実質公開となるため）
              <br />
              具体的に特定できない表現（思ってたより良かった、良くなかったなど）で感謝や感想を表明するのはOKです。
            </li>
          </ul>
          <h3 className="text-lg font-bold text-slate-700 mt-4 mb-2">
            準決勝（Selection）
          </h3>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>予選通過作品を改めて10作品単位のSelectionに分けます。</li>
            <li>
              予選と同様に人気投票をして
              <span className="font-bold">上位2曲を準決勝通過</span>とします。
            </li>
            <li>スコアは全曲が公開されます。</li>
          </ul>
          <h3 className="text-lg font-bold text-slate-700 mt-4 mb-2">
            決勝（Best）
          </h3>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>準決勝通過作品に対して同様の人気投票をします。</li>
            <li>スコアは全曲が公開されます。</li>
          </ul>
          <p className="text-slate-600 leading-relaxed text-sm mt-4 mb-4">
            詳しいルールについては
            <a
              href="https://note.com/syn523/n/n3269782e9e16?sub_rt=share_pw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skyblue font-medium text-fg-brand hover:underline"
            >
              本当のルーキー祭り2026春人気投票募集要項
            </a>
            をご確認ください。
          </p>
        </div>
      ),
    },
    {
      title: "opステージ・exステージ",
      content: (
        <ul className="list-disc list-outside ml-6 space-y-2">
          <li>
            <strong>opステージ:</strong>{" "}
            人気投票に参加したくない作品の投稿期間です。人気投票の対象から除外されます。参加タグは通常と同じ
            <span className="font-bold">「本当のルーキー祭り2026春」</span>
            です。
          </li>
          <li>
            <strong>exステージ:</strong>{" "}
            二次創作に参加した方が参加できるステージです。参加タグは
            <span className="font-bold">「本当のルーキー祭り2026春ex」</span>
            となります。
          </li>
        </ul>
      ),
    },
    {
      title: "二次創作",
      content: (
        <div>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>歌ってみた、ファンアートなどの二次創作を強く歓迎します。</li>
            <li>
              ニコニコ動画にアップロードする場合、
              <span className="font-bold">
                「本当のルーキー祭り2026春二次創作」
              </span>
              をタグロックしてください。
            </li>
            <li>
              noteに投稿する場合、
              <span className="font-bold">
                「本当のルーキー祭り2026春二次創作」
              </span>
              のタグをつけてください。
            </li>
            <li>
              指定のGoogleフォーム（後日公開予定）に投稿内容を入力してください。本サイトに反映されます。投稿者以外が入力しても構いません。
              <br />※ note投稿者はGoogleフォームへの回答は不要です。
            </li>
            <li>
              商業目的の利用（無許可での販売・グッズ化）は禁止ですが、YouTube等の収益化済み配信での利用は可能です。
            </li>
            <li>
              ルーキー歌い手は開催期間内に、ニコニコ動画へ新規投稿する必要があります。
              <br />
              つまり、期間前にニコニコ動画へ投稿してしまうと、その動画では参加できなくなります。
            </li>
            <li>
              楽曲投稿者は、参加時点で二次創作利用に同意したものとみなします。
            </li>
          </ul>
          <p className="text-slate-600 leading-relaxed text-sm mt-4 mb-4">
            詳しいルールについては
            <a
              href="https://note.com/syn523/n/n8c309f89031e?sub_rt=share_pw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skyblue font-medium text-fg-brand hover:underline"
            >
              本当のルーキー祭り2026春二次創作者募集要項
            </a>
            をご確認ください。
          </p>
        </div>
      ),
    },
    {
      title: "セレクションCD企画",
      content: (
        <div>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              <strong>セレクションCD企画:</strong> 本投稿祭は
              <span className="font-bold">「本当のNEXTAGE祭2026」</span>
              のセレクションCD企画に参加しており、セレクションCDに収録される場合があります。
              <span className="font-bold">「セレクションCD企画参加曲」</span>
              をタグロックすることで参加となり、有償販売に同意したものとみなします。
            </li>
          </ul>
          <p className="text-slate-600 leading-relaxed text-sm mt-4 mb-4">
            セレクションCDについては
            <a
              href="https://twipla.jp/events/704387"
              target="_blank"
              rel="noopener noreferrer"
              className="text-skyblue font-medium text-fg-brand hover:underline"
            >
              本当のNEXTAGE祭2026【開催日2026/9/18】with 大阪新世界フェス
            </a>
            をご確認ください。
          </p>
        </div>
      ),
    },
  ];

  return (
    <section id="rules" className="w-full py-24 bg-base-100/50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-mint uppercase mb-2">
            Rules
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800">
            参加ルール・要項
          </h3>
          <p className="text-slate-500 mt-4 text-sm mt-6 flex items-center justify-center gap-2">
            <AlertCircle size={16} className="text-cherry" />
            エントリー前に必ずすべての項目をご確認ください
          </p>
        </div>

        <div className="space-y-4">
          {ruleItems.map((item, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-white border border-slate-100 shadow-sm"
            >
              <input type="checkbox" name="rules-accordion" />
              <div className="collapse-title text-lg font-bold text-slate-700">
                {item.title}
              </div>
              <div className="collapse-content text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                <div>{item.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
