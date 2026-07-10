import { SkeletonBlock } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <SkeletonBlock className="h-4 w-24 rounded-md" />
        <SkeletonBlock className="mt-3 h-8 w-52 rounded-md" />
        <SkeletonBlock className="mt-3 h-4 w-full rounded-md" />
      </div>
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <SkeletonBlock className="h-6 w-36 rounded-md" />
        <SkeletonBlock className="mt-3 h-4 w-2/3 rounded-md" />
        <SkeletonBlock className="mt-6 h-11 w-48 rounded-2xl" />
      </div>
    </div>
  );
}
