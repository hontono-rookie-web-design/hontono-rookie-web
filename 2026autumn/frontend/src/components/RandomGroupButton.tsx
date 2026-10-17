"use client";

import { useRouter } from "next/navigation";

/* =========================
   グループをランダムに選んで遷移するボタン
   クライアントにはグループ番号とパスのみを渡す
========================= */
export default function RandomGroupButton({
  basePath,
  groups,
  label,
}: {
  basePath: string;
  groups: number[];
  label: string;
}) {
  const router = useRouter();

  const selectRandomGroup = () => {
    if (groups.length === 0) return;

    const randomIndex = Math.floor(Math.random() * groups.length);
    router.push(`${basePath}/${groups[randomIndex]}`, { scroll: false });
  };

  return (
    <button
      onClick={selectRandomGroup}
      className="
        text-xs py-1 px-3
        rounded-md border
        bg-blue-50 text-blue-700
        hover:bg-blue-100
        font-semibold
      "
    >
      {label}
      をランダムに選ぶ
    </button>
  );
}
