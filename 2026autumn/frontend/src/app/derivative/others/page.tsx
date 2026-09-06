import { getDerivativeOthers } from "@/lib/derivative";
import { Suspense } from "react";
import OthersContent from "./OthersContent";

export default async function Page() {
  const data = await getDerivativeOthers();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OthersContent initialData={data} />
    </Suspense>
  );
}
