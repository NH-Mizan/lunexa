import { SkeletonBlock, TableSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <div className="space-y-4">
      <SkeletonBlock className="h-8 w-40 rounded-md" />
      <TableSkeleton rows={4} showImage={false} columns={4} />
    </div>
  );
}
