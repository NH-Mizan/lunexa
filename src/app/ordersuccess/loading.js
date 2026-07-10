import { SkeletonBlock, TableSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8">
        <div className="space-y-4 border-b pb-6 text-center">
          <div className="flex justify-center">
            <SkeletonBlock className="h-16 w-16 rounded-full" />
          </div>
          <div className="flex flex-col items-center gap-3">
            <SkeletonBlock className="h-8 w-80 rounded-md" />
            <SkeletonBlock className="h-4 w-56 rounded-md" />
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <SkeletonBlock className="h-10 w-32 rounded-full" />
            <SkeletonBlock className="h-10 w-32 rounded-full" />
            <SkeletonBlock className="h-10 w-32 rounded-full" />
          </div>
        </div>
        <div className="space-y-4">
          <SkeletonBlock className="h-7 w-40 rounded-md" />
          <TableSkeleton rows={3} showImage={false} columns={4} />
        </div>
        <div className="flex justify-end">
          <div className="w-full md:w-1/2 space-y-3 rounded-xl bg-gray-50 p-5">
            <SkeletonBlock className="h-4 w-full rounded-md" />
            <SkeletonBlock className="h-4 w-full rounded-md" />
            <SkeletonBlock className="h-5 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
