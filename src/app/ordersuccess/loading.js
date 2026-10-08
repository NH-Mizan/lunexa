import { SkeletonBlock } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading order details" className="bg-[#f6fafb] px-4 py-10">
      <span className="sr-only">Loading order details…</span>
      <div aria-hidden="true" className="mx-auto max-w-[1040px]">
        <div className="mb-6 flex flex-col items-center gap-4">
          <SkeletonBlock className="size-20 rounded-full" />
          <SkeletonBlock className="h-9 w-64 max-w-full rounded-lg" />
          <SkeletonBlock className="h-10 w-full max-w-md rounded" />
        </div>
        <SkeletonBlock className="mb-6 h-24 w-full rounded-xl" />
        <div className="space-y-6 rounded-xl border border-slate-100 bg-white p-5 sm:p-7">
          <SkeletonBlock className="h-10 w-48 rounded" />
          <SkeletonBlock className="h-10 w-full rounded" />
          {[0, 1, 2].map((item) => <div key={item} className="flex gap-4 border-b border-slate-100 pb-5"><SkeletonBlock className="size-14 shrink-0 rounded-lg" /><div className="flex-1 space-y-3"><SkeletonBlock className="h-5 w-3/4 rounded" /><SkeletonBlock className="h-4 w-1/2 rounded" /></div></div>)}
          <SkeletonBlock className="ml-auto h-32 w-full max-w-[410px] rounded-lg" />
          <div className="grid gap-5 sm:grid-cols-2">{[0, 1].map((item) => <SkeletonBlock key={item} className="h-44 rounded-lg" />)}</div>
          <div className="flex flex-wrap justify-center gap-4"><SkeletonBlock className="h-12 w-48 rounded-lg" /><SkeletonBlock className="h-12 w-48 rounded-lg" /></div>
        </div>
      </div>
    </div>
  );
}
