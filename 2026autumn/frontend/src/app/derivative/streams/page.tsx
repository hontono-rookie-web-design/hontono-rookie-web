import { getDerivativeArchives, getDerivativeStreams } from "@/lib/derivative";
import { Suspense } from "react";
import StreamsContent from "./StreamsContent";

export default async function Page() {
  const [schedule, archive] = await Promise.all([getDerivativeStreams(), getDerivativeArchives()]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StreamsContent initialSchedule={schedule} initialArchive={archive} />
    </Suspense>
  );
}
