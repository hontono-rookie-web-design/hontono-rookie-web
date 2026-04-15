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
  icons: {
    icon: [
      { url: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  openGraph: {
    title: "本当のルーキー祭り2026春",
    description: "ボカロPなどの新人クリエイターを対象とした楽曲投稿・投票イベント「本当のルーキー祭り2026春」の特設サイト",
    images: [{ url: "/ogp.png" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "本当のルーキー祭り2026春",
    description: "ボカロPなどの新人クリエイターを対象とした楽曲投稿・投票イベント「本当のルーキー祭り2026春」の特設サイト",
    images: ["/ogp.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full">
        <Navigation>
          {children}
        </Navigation>
      </body>
    </html>
  );
}
