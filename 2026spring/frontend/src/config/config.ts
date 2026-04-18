export const CONFIG = {
  event: {
    name: "本当のルーキー祭り2026春",
  },

  fanficsheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_FANFIC_SPREADSHEET_ID!,
    streams: { name: "紹介配信" },
    illustrations: { name: "イラスト" },
    arrangements: { name: "アレンジ" },
    coversongs: { name: "歌ってみた" },
    others: { name: "その他" },
  },

  notesheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_NOTE_SPREADSHEET_ID!,
    name: "list",
  },

  videosheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_VIDEO_SPREADSHEET_ID!,
    rookie: { name: "rookie" },
    op: { name: "op" },
    ex: { name: "ex" },
  },

  images: {
    defaultIllustration: "/2026春ロゴ.png",
  },
};

