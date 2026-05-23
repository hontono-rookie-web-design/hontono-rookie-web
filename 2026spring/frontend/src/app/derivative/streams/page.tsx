import { Suspense } from "react";
import StreamsContent from "./StreamsContent";
import { getDerivativeStreams } from "@/lib/derivative";
import { getDerivativeArchive } from "@/lib/derivative";

export default async function Page() {
  const [schedule, archive] = await Promise.all([
    getDerivativeStreams(),
    getDerivativeArchive(),
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StreamsContent
        initialSchedule={schedule}
        initialArchive={archive}
      />
    </Suspense>
  );
}
