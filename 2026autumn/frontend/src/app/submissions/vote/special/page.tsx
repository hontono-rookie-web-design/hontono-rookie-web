import VoteContent from "./VoteContent";

export const dynamic = "force-static";
export const revalidate = false;

export default function Page() {
  return <VoteContent />;
}
