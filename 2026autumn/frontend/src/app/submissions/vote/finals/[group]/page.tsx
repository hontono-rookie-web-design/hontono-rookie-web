import { notFound } from "next/navigation";
import VoteContent, { getGroups } from "../VoteContent";

export const dynamic = "force-static";
export const revalidate = false;
// ビルド時に生成したグループ以外は 404 にする（リクエスト時のレンダリングを発生させない）
export const dynamicParams = false;

export async function generateStaticParams() {
  const groups = await getGroups();
  return groups.map((group) => ({ group: String(group) }));
}

export default async function Page({ params }: { params: Promise<{ group: string }> }) {
  const { group } = await params;
  const groupNumber = Number(group);
  if (!Number.isInteger(groupNumber)) notFound();

  return <VoteContent group={groupNumber} />;
}
