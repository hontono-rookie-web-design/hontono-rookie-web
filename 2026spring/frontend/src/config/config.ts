export const CONFIG = {
  event: {
    name: "本当のルーキー祭り2026春",
  },

  fanficsheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID_FANFIC!,
    streams: { name: "紹介配信" },
    illustrations: { name: "イラスト" },
    arrangements: { name: "アレンジ" },
    coversongs: { name: "歌ってみた" },
    others: { name: "その他" },
  },

  notesheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID_NOTES!,
    name: "list",
  },

  videosheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID_VIDEOS!,
    rookie: { name: "rookie" },
    op: { name: "op" },
    ex: { name: "ex" },
  },

  groupedvideosheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID_GROUPED!,
    rookie: { name: "rookie" },
  },

  groupedvideosheets_semifinal: {
    spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID_GROUPED_SEMIFINAL!,
    rookie: { name: "rookie" },
  },

  videosheets_final: {
    spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID_VIDEOS_FINAL!,
    rookie: { name: "rookie" },
  },

  voteformssheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID_VOTEFORM!,
    preliminaries: { name: "予選" },
    semifinals: { name: "準決勝" },
    finals: { name: "決勝" },
    ex: { name: "ex" },
  },

  rankingsheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID_RANKING!,
    preliminaries: { name: "予選" },
    semifinals: { name: "準決勝" },
    finals: { name: "決勝" },
    ex: { name: "ex" },
  },

  images: {
    defaultIllustration: "/2026spring_logo.png",
  },

  links: {
    voteGuide:
      "https://note.com/syn523/n/n3269782e9e16?sub_rt=share_pb",
  },
}