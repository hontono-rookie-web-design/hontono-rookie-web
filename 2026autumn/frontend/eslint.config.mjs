import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // Next.js、React、React Hooksの推奨ルール
  ...nextVitals,

  // TypeScript向けの推奨ルール
  ...nextTs,

  // 既存コードで多数発生しているルールは、
  // Status Check導入時点ではwarningとして扱う。
  // 今後コードを修正しながら、段階的にerrorへ戻す。
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
    },
  },

  // eslint-config-nextのデフォルトignoreを設定
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
