import { Suspense } from "react";
import IllustrationsContent from "./IllustrationsContent";
import { getDerivativeIllustrations } from "@/lib/derivative";

export default async function Page() {
  const items = await getDerivativeIllustrations();

  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <IllustrationsContent initialItems={items} />
    </Suspense>
  );
}
