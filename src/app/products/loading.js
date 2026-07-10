import { ProductGridSkeleton, SkeletonBlock } from "@/components/Skeletons";

export default function Loading() {
  return (
    <section className="container my-10 space-y-6">
      <SkeletonBlock className="h-8 w-40 rounded-md" />
      <ProductGridSkeleton count={10} className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5" />
    </section>
  );
}
