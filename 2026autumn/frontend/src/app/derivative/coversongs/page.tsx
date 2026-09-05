import { getDerivativeCoverSongs } from "@/lib/derivative";
import { Suspense } from "react";
import CoverSongsContent from "./CoverSongsContent";

export default async function Page() {
  const data = await getDerivativeCoverSongs();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CoverSongsContent initialData={data} />
    </Suspense>
  );
}
