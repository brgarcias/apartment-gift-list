export default function SkeletonGrid() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={crypto.randomUUID()}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-4 animate-pulse"
          >
            <div className="h-48 bg-neutral-200 rounded" />

            <div className="h-5 w-3/4 bg-neutral-200 rounded" />

            <div className="h-4 w-1/2 bg-neutral-200 rounded" />

            <div className="h-4 w-1/3 bg-neutral-200 rounded" />

            <div className="h-10 w-full bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
