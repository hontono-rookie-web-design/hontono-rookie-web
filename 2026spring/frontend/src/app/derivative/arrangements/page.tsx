import { Suspense } from "react";
import ArrangementContent from "./ArrangementContent";
import { getDerivativeArrangement } from "@/lib/derivative";

export default async function Page() {
  const data = await getDerivativeArrangement();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArrangementContent initialData={data} />
    </Suspense>
  );
}
