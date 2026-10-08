import { SkeletonBlock } from "@/components/Skeletons";
import styles from "./success.module.css";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading order details" className={styles.page}>
      <span className="sr-only">Loading order details…</span>
      <div aria-hidden="true" className={styles.container}>
        <div className="mb-4 flex flex-col items-center gap-3">
          <SkeletonBlock className="size-[72px] rounded-full" />
          <SkeletonBlock className="h-9 w-64 max-w-full rounded-lg" />
          <SkeletonBlock className="h-10 w-full max-w-md rounded" />
        </div>
        <SkeletonBlock className="mb-4 h-16 w-full rounded-xl" />
        <div className="space-y-4 rounded-xl border border-slate-100 bg-white p-4 sm:p-5">
          <SkeletonBlock className="h-10 w-48 rounded" />
          <SkeletonBlock className="h-10 w-full rounded" />
          {[0, 1, 2].map((item) => <div key={item} className="flex gap-4 border-b border-slate-100 pb-5"><SkeletonBlock className="size-14 shrink-0 rounded-lg" /><div className="flex-1 space-y-3"><SkeletonBlock className="h-5 w-3/4 rounded" /><SkeletonBlock className="h-4 w-1/2 rounded" /></div></div>)}
          <SkeletonBlock className="ml-auto h-28 w-full max-w-[380px] rounded-lg" />
          <div className="grid gap-4 sm:grid-cols-2">{[0, 1].map((item) => <SkeletonBlock key={item} className="h-36 rounded-lg" />)}</div>
          <div className="flex flex-wrap justify-center gap-4"><SkeletonBlock className="h-12 w-48 rounded-lg" /><SkeletonBlock className="h-12 w-48 rounded-lg" /></div>
        </div>
      </div>
    </div>
  );
}
