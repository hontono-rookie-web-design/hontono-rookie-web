import { Suspense } from "react";
import OthersContent from "./OthersContent";
import { getDerivativeOthers } from "@/lib/derivative";

export default async function Page() {
  const data = await getDerivativeOthers();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OthersContent initialData={data} />
    </Suspense>
  );
}
