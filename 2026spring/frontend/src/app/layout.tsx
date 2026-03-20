import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "本当のルーキー祭り2026春",
  description: "ボカロPなどの新人クリエイターを対象とした楽曲投稿・投票イベント「本当のルーキー祭り2026春」の特設サイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Navigation>
          {children}
        </Navigation>
      </body>
    </html>
  );
}
