import { AlertCircle } from "lucide-react";
import Link from "next/link";

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
              <strong>以下のどちらかを満たす方</strong>
              （2026/8/24 17:00 時点の実績で判定）
              <br />
              <ul className="list-disc list-outside ml-6 mt-2 space-y-2">
                <li>
                  いいね数上位3曲のいいね数の平均が
                  <strong>50以下</strong>
                </li>

                <li>
                  再生数上位3曲の再生数の平均が
                  <strong>500以下</strong>
                </li>
              </ul>
            </li>
          </ul>
          <h3 className="text-lg font-semibold mt-4 mb-2">注意</h3>

          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              3曲に満たない場合は0いいね、0再生とカウントします。1作品のみで300再生の場合は(300+0+0)/3=平均100再生とします。
            </li>

            <li>
              開催時期が重複する
              <strong>「裏ボカロック投稿祭2026」</strong>
              との同時参加OKです。
              <br />
              (同時参加する場合は裏ボカロック投稿祭2026の投稿期間に合わせて9月6日の23：59までに投稿してください。)
            </li>

            <li>
              条件を満たしておらず投稿できない方は、人気投票、二次創作、SPステージ、本当のNEXTAGE投稿祭などに参加できます。
            </li>

            <li>
              原則として基準を超えている場合は参加できませんが、特別な事情がある場合は個別にご相談ください。
            </li>
            <li>
              本当のルーキー祭り2026秋に参加した場合は
              <strong>「本当のNEXTAGE投稿祭」 には参加できません</strong>
              （本当のNEXTAGEの参加条件、本当のルーキー祭りに参加できないことに反するため）。
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
          <p className="text-sm font-semibold text-primary mb-2">※ タグに#や「」は不要です。</p>

          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              ニコニコ動画に投稿して、
              <strong>「本当のルーキー祭り2026秋」</strong>
              のタグを設定し、タグロックしてください。
              <br />
              ※参加作品以外（MV、二次創作、宣伝用のショート動画など）への使用は禁止
            </li>
            <li>
              動画説明欄に投稿者名と動画のタイトルの読みおよび以下の説明文をご記載ください。紹介放送で読み上げます。
              <strong>記号も含めて正確に</strong>お願いします。
            </li>
            <div className="my-4 bg-slate-100 border-slate-200 pl-4 py-4">
              例 <br />
              True Rookie5 (とぅるーるーきーふぁいぶ) <br />
              SynNightP (しんないとぴー)
            </div>
            <li>下記の文章を動画説明欄に記載してください。</li>
            <div className="my-4 bg-slate-100 border-slate-200 pl-4 py-4">
              「本楽曲は本当のルーキー祭り2026秋 DiscXX収録曲です。
              <br />
              下記公式Webサイトから人気投票に参加できます。」 <br />
              公式webサイト: https://2026autumn.hontono-rookie-web.workers.dev/
            </div>
            <p className="text-slate-600 leading-relaxed text-sm mt-2">
              ※収録Discは現時点で未定です。確定次第更新します。
            </p>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            投稿を以って下記の趣旨に同意したものとします。
          </h3>

          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>人気投票によるランキングの実施</li>
            <li>紹介配信等での作品の使用 </li>
            <li>本ルーに関する紹介・宣伝目的での作品利用 </li>
            <li>本ルーに関する紹介記事、紹介画像、配信、広報等での作品利用 </li>
            <li>本当の打ち上げ祭りでの作品の使用（商用利用） </li>
            <li>新世界フェスによるセレクションCDへの作品提供（商用利用） </li>
            <li>本ルー参加作品を題材とした二次創作の制作および利用 </li>
          </ul>

          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            本当の打ち上げ祭りおよびセレクションCDへの作品提供については、同意しない選択ができます。
            同意しない場合は、投稿作品に以下のタグをロックしてください。
          </p>

          <ul className="list-disc list-outside mt-2 ml-6 space-y-2">
            <li>
              <strong>「セレクションCD企画NG」</strong>
            </li>
            <li>
              <strong>「打ち上げ祭りNG」</strong>{" "}
            </li>
          </ul>

          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            なお、
            <strong>
              本ルー参加作品を起点に二次創作者自身が新たに制作したイラストについては、Pへの個別確認を必要とせず、二次創作者が自由に公開・利用・頒布できるものとします。
            </strong>
            本規約における「頒布」には、有償・無償を問わず、第三者への配布・提供を含みます。
          </p>

          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            ただし、本ルー参加作品についてP以外に別途権利者が存在する場合、その権利者が有する権利については本規約の対象外とします。
            <strong>必要な場合は、各権利者の許諾を得てください。</strong>
          </p>

          <p className="text-slate-600 leading-relaxed text-sm mt-2 mb-4">
            詳しいルールについては
            <a
              href="https://note.com/syn523/n/n15ed59e49077?sub_rt=share_pw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link font-medium hover:underline"
            >
              本当のルーキー祭り2026秋募集要項
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
            <li>他媒体を含めて未投稿の新曲</li>

            <li>既投稿曲のRemix不可</li>

            <li>生成AIによる楽曲の自動生成作品不可</li>

            <li>ボカロ・合成音声作品</li>

            <li>ニコニコ動画へ投稿</li>

            <li>1アカウント1作品</li>

            <li>オフボーカル音源を用意</li>

            <li>歌詞を用意</li>

            <li>BPMを記載</li>

            <li>投稿者名の読みを記載</li>

            <li>作品名の読みを記載</li>

            <li>シンプルな動画であること</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">任意条件</h3>
          <p>公開すると二次創作されやすくなります。</p>
          <ul className="list-disc list-outside ml-6 mt-2 mb-4 space-y-2">
            <li>原曲MP3</li>

            <li>MIDI</li>

            <li>VSQ</li>

            <li>楽譜</li>

            <li>その他関連ファイル (オフボーカルMVなど)</li>
          </ul>
          <p>原曲MP3は以下の投稿祭で使用する場合があります。</p>
          <ul className="list-disc list-outside ml-6 mt-2 space-y-2">
            <li>本当の打ち上げ祭り</li>

            <li>本当のルーキーイラスト祭り</li>
          </ul>
        </div>
      ),
    },
    {
      title: "動画・生成AI・Remix・オフボーカル等について",
      content: (
        <div>
          <h3 className="text-lg font-semibold mb-2">動画について</h3>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            本投稿祭は初心者が参加しやすい環境を重視しています。
            <br />
            そのため、動画演出による競争を避ける目的で<strong>シンプルな動画</strong>
            での参加をお願いします。告知動画などに制約はありません。
          </p>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            シンプルな動画の目安としては、
          </p>
          <ul className="list-disc list-outside ml-6 mt-2 mb-2 space-y-2">
            <li>静止画</li>

            <li>歌詞表示</li>

            <li>イラスト差し替え</li>

            <li>カメラの寄る・引く程度の演出</li>

            <li>パワポ程度のアニメーション</li>
          </ul>
          <p>を想定しています。</p>
          <br />
          <p>
            <strong>参考動画</strong>
          </p>
          <a
            href="https://nico.ms/sm46643101?ref=thumb_watch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link font-medium text-fg-brand hover:underline"
          >
            本当のルーキー祭り2026秋告知曲　True Rookie5
          </a>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            動画表現を厳密にルール化すると運営負担が大きくなるため、個別判断やパトロールは行いません。目安以外も許容しますが、参加者自身が趣旨を理解した上で判断してください。
            <br />
            なお、他参加者や視聴者から見て趣旨から大きく外れていると判断される場合があります。その場合の評価や反応については自己責任となります。
          </p>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            凝ったMV作品を制作したい場合は、
            <strong>YouTubeや「本当のルーキー祭り2026秋二次創作」タグ</strong>
            をご活用ください。これらの動画から本投稿作品への誘導ありです。(逆もOK)
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">生成AIについて</h3>
          <p>
            <strong>生成AIによる楽曲の自動生成作品は参加できません。</strong>
          </p>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">例</p>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>Suno</li>

            <li>Udio</li>

            <li>その他AIへ指示を与えて生成した楽曲</li>
          </ul>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            なお、<strong>制作補助としてのAI利用を一律に禁止するものではありません</strong>
            。判断が難しい場合は主催へご相談ください。
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">新曲・Remixについて</h3>
          <p>
            本投稿祭は<strong>未投稿の新曲</strong>を対象とします。
          </p>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            他媒体を含め既投稿曲のRemix作品は参加できません。
          </p>
          <p>これは投稿作品数の増加による運営負荷を抑え、参加作品へ十分な対応を行うためです。</p>
          <p>
            また、Remixの定義を厳密に定めることは困難であり、判断基準の統一も難しいため、一律に対象外としています。
          </p>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            告知動画や制作途中の公開などは問題ありません。
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">オフボーカル・歌詞・BPMについて</h3>
          <p>
            本投稿祭の参加曲は後日開催予定の「本当のルーキー歌い手2026秋」の課題曲として使用されます。
          </p>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            そのため<strong>以下の公開を必須</strong>とします。
          </p>
          <ul className="list-disc list-outside ml-6 mt-2 mb-2 space-y-2">
            <li>オフボーカル音源 (オーディオ形式wavまたはmp3のどちらかは必須)</li>

            <li>歌詞の記載</li>

            <li>BPMの記載</li>
          </ul>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">公開方法は自由です。</p>
          <p>原曲ファイル、オフボーカルなど作品公開前に投稿してもOKです。</p>
          <p>(動画概要にリンクを貼るため)</p>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">例</p>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>ニコニ・コモンズ</li>

            <li>Googleドライブ</li>

            <li>その他ダウンロード可能なサービス</li>

            <li>ピアプロ</li>
          </ul>
          <p className="text-slate-600 leading-relaxed text-sm mt-2">
            なるべく期限の保存期限がないものが望ましいです。難しい場合はギガファイル便で良いです。
          </p>
          <p className="text-slate-600 leading-relaxed text-sm mt-2 mb-4">
            動画説明欄などからアクセスできる状態にしてください。
          </p>
        </div>
      ),
    },
    {
      title: "人気投票について",
      content: (
        <div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">投票に関する注意事項</h3>

          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              投票は
              <strong>匿名</strong>
              で行われます。
            </li>

            <li>
              投稿楽曲は抽選で
              <strong>約5曲ずつの「Disc」</strong>
              にグループ分けされ、各Disc内で「好きな順」に並べて投票していただきます,
            </li>

            <li>
              <strong>人気投票は誰でも参加できます。</strong>
              （音楽活動者でなくてもOK）
            </li>

            <li>
              投稿者が自曲が含まれるDiscへ投票する場合、自曲は1位に投票してください。(投票促進のため)
            </li>

            <li>
              <strong>動画は採点の対象外です。</strong>
              (動画不慣れな方への配慮)
            </li>
            <li>各グループの投票用Googleフォームにアクセスしてください。</li>

            <li>Disc内で相対評価人気投票をします。(1位作品: 5点、・・・、5位作品: 1点)</li>

            <li>
              自分の独断で投票してください。
              <strong>投票理由や音楽的な知識はいりません。</strong>
            </li>

            <li>
              <strong>1グループから投票できます。</strong>
              全グループ投票しなくても大丈夫です。
            </li>

            <li>期間中に非公開になった動画は1点にしてください。</li>
            <li>自分はこの曲を1位に投票したよ！は自己責任で公開してもOKです。</li>

            <li>サビのみ、ワンコーラスのみなど部分視聴での評価も可。</li>
            <li>公序良俗に反する投票は禁止（恣意的に低得点にする行為など）。</li>

            <li>
              投票期間中は
              <strong>運営公認のニコ生配信者による楽曲紹介配信</strong>
              も行われます。
            </li>
          </ul>
          <h3 className="text-lg font-bold text-slate-700 mt-4 mb-2">予選（Disc）</h3>

          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              人気投票の結果
              <strong>上位を予選通過</strong>
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

          <h3 className="text-lg font-bold text-slate-700 mt-4 mb-2">決勝（Best）</h3>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>通過作品に対して同様の人気投票をします。</li>
            <li>スコアは全曲が公開されます。</li>
          </ul>
        </div>
      ),
    },
    {
      title: "exステージ・SPステージ",
      content: (
        <div>
          <h3 className="text-lg font-bold text-slate-700 mb-2">exステージ</h3>

          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              <strong>人気投票に参加したくない作品の投稿期間です。</strong>
            </li>
            <li>人気投票の対象から除外されます。</li>

            <li>
              参加タグは通常と同じ
              <strong>「本当のルーキー祭り2026秋」</strong>
              です。
            </li>
            <li>合成音声を使用しない歌い手ボーカル作品も投稿できます。</li>
            <li>二次創作、紹介放送の対象になります。</li>
          </ul>
          <h3 className="text-lg font-bold text-slate-700 mt-4 mb-2">SPステージ</h3>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              <strong>二次創作に参加した方</strong>
              が参加できるステージです。
            </li>

            <li>
              参加タグは
              <strong>「本当のルーキー祭り2026秋SP」</strong>
              となります。
            </li>

            <li>
              SPでは本投稿祭と同様に<strong>人気投票</strong>をします。
            </li>

            <li>
              SPステージは参加条件がなく、<strong>誰でも参加できます</strong>
              。（MVアリ、再生数不問、既投稿曲アリ）
            </li>

            <li>
              <strong>ボカロ楽曲作品に限ります。</strong>
              （人気投票が難しくなるため）
            </li>
          </ul>
          <h4 className="text-md font-semibold ml-6 mt-4 mb-2">SPステージ参加方法</h4>
          <ul className="list-disc list-outside ml-12 space-y-2">
            <li>本ルー作品の二次創作を行う。</li>
            <li>
              <strong>20Disc以上</strong>の人気投票をする。
            </li>

            <li>
              参加作品に
              <strong>合計5000pt以上</strong>
              のニコニ広告をする。
            </li>

            <li>
              参加作品の
              <strong>10曲以上</strong>
              の公開マイリストを作成する。
            </li>

            <li>
              二次創作ライバーへ
              <strong>ギフトを贈る</strong>。
              <br />
              ※ギフトの価格は問いません。ログインボーナスなど実質無償範囲の応援も対象です。
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "二次創作",
      content: (
        <div>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>歌ってみた、ファンアートなどの二次創作を強く歓迎します。</li>

            <li>
              Xでのポストを推奨します。原曲ポストを引用リポストし、
              <strong>#本当のルーキー祭り2026秋二次創作</strong>のハッシュタグを付けてください。
            </li>
            <li>
              ニコニコ動画にアップロードする場合、
              <strong>「本当のルーキー祭り2026秋二次創作」</strong>
              をタグロックしてください。
            </li>

            <li>
              noteに投稿する場合、
              <strong>「本当のルーキー祭り2026秋二次創作」</strong>
              のタグをつけてください。
            </li>

            <li>
              指定の
              <Link
                href="/derivative/Postingform"
                prefetch={false}
                className="text-link font-medium hover:underline"
              >
                Googleフォーム
              </Link>
              に投稿内容を入力してください。本サイトに反映されます。投稿者以外が入力しても構いません。
              <br />※ note投稿者はGoogleフォームへの回答は不要です。
            </li>

            <li>
              なお、本ルー関連の紹介・宣伝目的に限り、運営または第三者が二次創作作品を利用する場合があります。
            </li>
            <li>楽曲投稿者は、参加時点で二次創作利用に同意したものとみなします。</li>
          </ul>
        </div>
      ),
    },
    {
      title: "セレクションCD企画・打ち上げ祭",
      content: (
        <div>
          <ul className="list-disc list-outside ml-6 space-y-2">
            <li>
              <strong>セレクションCD企画:</strong>
              本投稿祭は
              <strong>「本当のNEXTAGE祭2026」</strong>
              のセレクションCD企画に参加しており、セレクションCDに収録される場合があります。同意しない場合は
              <strong>「セレクションCD企画NG」</strong>
              をタグロックしてください。
            </li>
            <li>
              <strong>打ち上げ祭り:</strong>
              <strong>「本当の打ち上げ祭り」</strong>
              で作品が使用される場合があります(商用利用)。同意しない場合は
              <strong>「打ち上げ祭りNG」</strong>
              をタグロックしてください。
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <section id="rules" className="w-full py-24 bg-base-100/50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-secondary uppercase mb-2">Rules</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800">参加ルール・要項</h3>
          <p className="text-slate-500 mt-4 text-sm mt-6 flex items-center justify-center gap-2">
            <AlertCircle size={16} className="text-accent" />
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

              <div className="collapse-title text-lg font-bold text-slate-700">{item.title}</div>

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
