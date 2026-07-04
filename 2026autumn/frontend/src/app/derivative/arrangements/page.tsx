import { Suspense } from "react";
import ArrangementContent from "./ArrangementContent";
import { getDerivativeArrangements } from "@/lib/derivative";

export default async function Page() {
  const data = await getDerivativeArrangements();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArrangementContent initialData={data} />
    </Suspense>
  );
}
