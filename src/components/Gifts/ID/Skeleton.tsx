export default function Skeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="rounded-t-lg w-full md:w-1/2 bg-indigo-50 dark:bg-slate-700 flex items-center justify-center p-4 sm:p-8">
            <div className="relative w-full h-64 sm:h-80 md:h-full">
              <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 animate-pulse rounded" />
            </div>
          </div>

          <div className="w-full md:w-1/2 p-4 sm:p-6 space-y-6">
            <div className="flex justify-between">
              <div className="h-8 w-3/4 bg-neutral-200 rounded animate-pulse" />
              <div className="h-6 w-20 bg-neutral-200 rounded-full animate-pulse" />
            </div>

            <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse" />

            <div className="h-8 w-40 bg-neutral-200 rounded animate-pulse" />

            <div className="bg-neutral-100 dark:bg-slate-700 p-4 rounded-lg">
              <div className="h-10 w-full bg-neutral-200 rounded animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="h-4 w-28 bg-neutral-200 rounded animate-pulse" />
              <div className="h-3 w-full bg-neutral-200 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-neutral-200 rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse mb-1" />
                <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
              </div>

              <div>
                <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse mb-1" />
                <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="h-12 w-full rounded-full bg-neutral-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
