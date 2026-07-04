import { Suspense } from "react";
import ArticlesContent from "./ArticlesContent";
import { getDerivativeArticles } from "@/lib/derivative";

export default async function Page() {
  const data = await getDerivativeArticles();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticlesContent initialData={data} />
    </Suspense>
  );
}
