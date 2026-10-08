import { SkeletonBlock } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading order details" className="bg-[#faf8f9] px-4 py-8 sm:py-12 lg:py-16">
      <span className="sr-only">Loading order details…</span>
      <div aria-hidden="true" className="mx-auto max-w-6xl">
        <SkeletonBlock className="mx-auto mb-8 h-4 w-64 max-w-full rounded" />
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-pink-100 bg-white px-5 py-12">
          <SkeletonBlock className="size-20 rounded-full" />
          <SkeletonBlock className="h-4 w-48 max-w-full rounded" />
          <SkeletonBlock className="h-11 w-full max-w-lg rounded-lg" />
          <SkeletonBlock className="h-5 w-full max-w-sm rounded" />
          <SkeletonBlock className="mt-2 h-24 w-full max-w-2xl rounded-2xl" />
        </div>
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
            <SkeletonBlock className="h-6 w-44 rounded" />
            {[0, 1, 2].map((item) => <div key={item} className="flex gap-4 border-t border-slate-100 pt-6"><SkeletonBlock className="size-14 shrink-0 rounded-xl" /><div className="flex-1 space-y-3"><SkeletonBlock className="h-5 w-3/4 rounded" /><SkeletonBlock className="h-4 w-1/2 rounded" /><SkeletonBlock className="h-4 w-full rounded" /></div></div>)}
          </div>
          <div className="space-y-5">
            {[0, 1].map((item) => <div key={item} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6"><SkeletonBlock className="h-6 w-40 rounded" /><SkeletonBlock className="h-4 w-full rounded" /><SkeletonBlock className="h-4 w-3/4 rounded" /><SkeletonBlock className="h-10 w-full rounded" /></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
