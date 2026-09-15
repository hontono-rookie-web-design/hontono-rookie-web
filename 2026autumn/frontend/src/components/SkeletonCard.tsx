/* =========================
   Skeleton
========================= */
function SkeletonCard() {
  return (
    <div className="w-full max-w-[900px] rounded-xl bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="w-40 h-24 bg-gray-200 rounded animate-pulse" />

        <div className="flex flex-col flex-1 gap-2">
          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse" />

          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />

          <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />

          <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
