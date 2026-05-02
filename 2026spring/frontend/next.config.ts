import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // ビルド済み静的アセット（ハッシュ付き）: 長期キャッシュ
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // next/image の処理対象や手動配置した images ディレクトリ
      {
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // 静的画像ファイル拡張子マッチ（public 配下など）
      {
        source: "/:path*.(png|jpg|jpeg|gif|webp|avif|svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // API はキャッシュしない
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
      // トップページは常に最新を優先
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "max-age=0, must-revalidate",
          },
        ],
      },
      // その他の HTMLページは常に最新を優先（必要ならここを s-maxage 等に調整）
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, must-revalidate, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
