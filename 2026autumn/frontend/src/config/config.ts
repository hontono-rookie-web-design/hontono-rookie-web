export const CONFIG = {
  event: {
    name: "本当のルーキー祭り2026春",
  },

  fanficsheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID_FANFIC!,
    streams: { name: "紹介配信予定" },
    archive: { name: "紹介配信アーカイブ" },
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
    status: {
      rookie: { name: "ルーキー" },
      ex: { name: "EX" },
      sp: { name: "SP" },
    },
    stage: {
      preliminaries: { group_id: "prelim_group_id", rank: "prelim_rank", name: "予選" },
      semifinals: { group_id: "semifinal_group_id", rank: "semifinal_rank", name: "準決勝" },
      finals: { group_id: "final_group_id", rank: "final_rank", name: "決勝" },
      sp: { group_id: "sp_group_id", rank: "sp_rank", name: "sp" },
    },
  },

  voteformssheets: {
    spreadsheetId: process.env.NEXT_PUBLIC_SPREADSHEET_ID_VOTEFORM!,
    preliminaries: { name: "予選" },
    semifinals: { name: "準決勝" },
    finals: { name: "決勝" },
    sp: { name: "SP" },
  },

  images: {
    defaultIllustration: "/2026spring_logo.png",
  },

  links: {
    voteGuide: "https://note.com/syn523/n/n3269782e9e16?sub_rt=share_pb",
  },
};
