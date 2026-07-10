import { memo } from "react";

function range(count) {
  return Array.from({ length: count }, (_, index) => index);
}

export const SkeletonBlock = memo(function SkeletonBlock({
  className = "",
  rounded = "rounded-xl",
}) {
  return <div className={`skeleton-base ${rounded} ${className}`} aria-hidden="true" />;
});

export const ProductCardSkeleton = memo(function ProductCardSkeleton() {
  return (
    <div className="relative border border-red-200 rounded-md shadow overflow-hidden bg-white">
      <div className="absolute top-2 left-2 z-10">
        <SkeletonBlock className="h-6 w-16 rounded-md" />
      </div>
      <div className="absolute top-[196px] right-0 z-10 md:top-[196px]">
        <SkeletonBlock className="h-10 w-10 rounded-tl-[29px] rounded-br-none rounded-bl-none rounded-tr-none md:h-11 md:w-11" />
      </div>
      <div className="product_image">
        <SkeletonBlock className="h-full w-full rounded-none" />
      </div>
      <div className="product_info space-y-3">
        <SkeletonBlock className="h-4 w-4/5 rounded-md" />
        <SkeletonBlock className="h-4 w-3/5 rounded-md" />
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-5 w-20 rounded-md" />
          <SkeletonBlock className="h-4 w-16 rounded-md" />
        </div>
      </div>
      <div className="product_btn">
        <SkeletonBlock className="h-10 w-10 rounded-md" />
        <SkeletonBlock className="h-10 flex-1 rounded-md" />
      </div>
    </div>
  );
});

export const CategorySkeleton = memo(function CategorySkeleton({ count = 5 }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
      {range(count).map((item) => (
        <div key={item} className="overflow-hidden rounded-md shadow-sm border border-gray-200 bg-white">
          <div className="h-24 lg:h-36 p-3">
            <SkeletonBlock className="h-full w-full rounded-lg" />
          </div>
          <div className="home_categorics bg-transparent px-3">
            <SkeletonBlock className="h-4 w-3/4 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
});

export const BannerSkeleton = memo(function BannerSkeleton({ count = 1, heightClass = "h-[200px] lg:h-[500px]" }) {
  return (
    <div className={`grid gap-6 ${count > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
      {range(count).map((item) => (
        <div key={item} className={`relative overflow-hidden rounded-2xl bg-white shadow-md ${heightClass}`}>
          <SkeletonBlock className="absolute inset-0 rounded-none" />
          <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-6">
            <SkeletonBlock className="h-6 w-28 rounded-md" />
            <SkeletonBlock className="h-8 w-3/4 rounded-md" />
            <SkeletonBlock className="h-4 w-1/2 rounded-md" />
            <div className="flex gap-3">
              <SkeletonBlock className="h-10 w-32 rounded-md" />
              <SkeletonBlock className="h-10 w-24 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

export const TableSkeleton = memo(function TableSkeleton({
  rows = 4,
  showImage = true,
  columns = 5,
}) {
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="grid gap-4 border-b bg-gray-50 px-6 py-4" style={gridStyle}>
        {range(columns).map((item) => (
          <SkeletonBlock key={item} className="h-4 w-full rounded-md" />
        ))}
      </div>
      <div className="divide-y divide-gray-200">
        {range(rows).map((row) => (
          <div key={row} className="grid items-center gap-4 px-6 py-4" style={gridStyle}>
            {columns === 4 ? (
              <>
                <SkeletonBlock className="h-4 w-4/5 rounded-md" />
                <SkeletonBlock className="h-4 w-12 justify-self-center rounded-md" />
                <SkeletonBlock className="h-4 w-16 justify-self-center rounded-md" />
                <SkeletonBlock className="h-4 w-16 justify-self-end rounded-md" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {showImage && <SkeletonBlock className="h-16 w-16 rounded-lg" />}
                  {!showImage && <SkeletonBlock className="h-4 w-20 rounded-md" />}
                </div>
                <SkeletonBlock className="h-4 w-4/5 rounded-md" />
                <SkeletonBlock className="h-4 w-12 justify-self-center rounded-md" />
                <SkeletonBlock className="h-4 w-16 justify-self-end rounded-md" />
                <div className="flex justify-center gap-3">
                  <SkeletonBlock className="h-10 w-20 rounded-lg" />
                  <SkeletonBlock className="h-10 w-24 rounded-lg" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export const ProfileSkeleton = memo(function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <SkeletonBlock className="h-20 w-20 rounded-full" />
            <div className="space-y-3">
              <SkeletonBlock className="h-6 w-36 rounded-md" />
              <SkeletonBlock className="h-4 w-52 rounded-md" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {range(4).map((item) => (
              <SkeletonBlock key={item} className="h-8 w-8 rounded-full" />
            ))}
            <SkeletonBlock className="h-9 w-20 rounded-lg" />
          </div>
        </div>
      </div>

      {range(2).map((section) => (
        <div key={section} className="bg-white rounded-lg shadow p-6">
          <div className="mb-5 flex items-center justify-between">
            <SkeletonBlock className="h-6 w-44 rounded-md" />
            <SkeletonBlock className="h-9 w-20 rounded-lg" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {range(section === 0 ? 5 : 4).map((item) => (
              <div key={item} className={item === 4 ? "md:col-span-2 space-y-2" : "space-y-2"}>
                <SkeletonBlock className="h-3 w-20 rounded-md" />
                <SkeletonBlock className="h-5 w-32 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export const ProductGridSkeleton = memo(function ProductGridSkeleton({ count = 10, className = "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4" }) {
  return (
    <div className={className}>
      {range(count).map((item) => (
        <ProductCardSkeleton key={item} />
      ))}
    </div>
  );
});

export const HomePageSkeleton = memo(function HomePageSkeleton() {
  return (
    <div className="space-y-10 pb-10">
      <section className="container pt-2">
        <BannerSkeleton />
      </section>

      <section className="container space-y-5">
        <SkeletonBlock className="h-6 w-40 rounded-md" />
        <CategorySkeleton />
      </section>

      <section className="container space-y-6">
        <div className="flex flex-col items-center gap-3">
          <SkeletonBlock className="h-4 w-28 rounded-md" />
          <SkeletonBlock className="h-9 w-56 rounded-md" />
        </div>
        <ProductGridSkeleton />
      </section>

      <section className="container">
        <BannerSkeleton count={2} heightClass="h-64 md:h-80" />
      </section>

      <section className="container space-y-8">
        {range(3).map((section) => (
          <div key={section} className="space-y-4">
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-8 w-48 rounded-md" />
              <SkeletonBlock className="h-10 w-28 rounded-md" />
            </div>
            <ProductGridSkeleton />
          </div>
        ))}
      </section>

      <section className="container space-y-4">
        <SkeletonBlock className="h-8 w-44 rounded-md" />
        <div className="grid grid-cols-2 gap-5 md:grid-cols-5 lg:grid-cols-7">
          {range(7).map((item) => (
            <div key={item} className="rounded-xl border border-gray-200 bg-white p-4">
              <SkeletonBlock className="h-20 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
});

export const CategoryPageSkeleton = memo(function CategoryPageSkeleton() {
  return (
    <div className="container min-h-screen py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <aside className="rounded-xl bg-white p-4 shadow md:col-span-1">
          <SkeletonBlock className="mb-4 h-6 w-32 rounded-md" />
          <div className="space-y-3">
            {range(8).map((item) => (
              <div key={item} className="flex items-center gap-3">
                <SkeletonBlock className="h-4 w-4 rounded-full" />
                <SkeletonBlock className="h-4 w-28 rounded-md" />
              </div>
            ))}
          </div>
        </aside>

        <div className="md:col-span-3 space-y-4">
          <div className="flex justify-end">
            <SkeletonBlock className="h-10 w-36 rounded-md" />
          </div>
          <ProductGridSkeleton count={8} className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" />
        </div>
      </div>
    </div>
  );
});

export const ProductDetailsSkeleton = memo(function ProductDetailsSkeleton() {
  return (
    <section className="container my-10 space-y-10">
      <div className="flex flex-col gap-6 rounded-lg bg-white p-4 shadow-md md:flex-row">
        <div className="w-full md:w-1/2 space-y-3">
          <SkeletonBlock className="h-[360px] w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-3">
            {range(4).map((item) => (
              <SkeletonBlock key={item} className="h-20 w-full rounded-md" />
            ))}
          </div>
        </div>
        <div className="w-full md:w-1/2 space-y-5">
          <SkeletonBlock className="h-8 w-3/4 rounded-md" />
          <SkeletonBlock className="h-4 w-32 rounded-md" />
          <SkeletonBlock className="h-7 w-24 rounded-md" />
          <SkeletonBlock className="h-4 w-24 rounded-md" />
          <div className="space-y-3">
            <SkeletonBlock className="h-11 w-full rounded-lg" />
            <SkeletonBlock className="h-11 w-full rounded-lg" />
            <SkeletonBlock className="h-11 w-3/4 rounded-lg" />
          </div>
          <div className="space-y-3 pt-6">
            <SkeletonBlock className="h-4 w-full rounded-md" />
            <SkeletonBlock className="h-4 w-full rounded-md" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <SkeletonBlock className="h-10 w-80 rounded-lg" />
        <SkeletonBlock className="h-36 w-full rounded-lg" />
      </div>

      <div className="space-y-4">
        <SkeletonBlock className="h-7 w-44 rounded-md" />
        <ProductGridSkeleton count={5} className="grid grid-cols-2 gap-4 md:grid-cols-5" />
      </div>
    </section>
  );
});

export const DashboardOverviewSkeleton = memo(function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <SkeletonBlock className="h-8 w-40 rounded-md" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {range(3).map((item) => (
          <div key={item} className="rounded-2xl bg-white p-6 shadow">
            <SkeletonBlock className="h-4 w-28 rounded-md" />
            <SkeletonBlock className="mt-4 h-8 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
});

export const CheckoutSkeleton = memo(function CheckoutSkeleton() {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 rounded-lg bg-white p-6 shadow-md lg:col-span-2">
            <SkeletonBlock className="h-8 w-48 rounded-md" />
            <div className="grid gap-6 md:grid-cols-2">
              {range(4).map((item) => (
                <div key={item} className="space-y-2">
                  <SkeletonBlock className="h-4 w-28 rounded-md" />
                  <SkeletonBlock className="h-12 w-full rounded-lg" />
                </div>
              ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {range(2).map((item) => (
                <div key={item} className="space-y-3">
                  <SkeletonBlock className="h-6 w-36 rounded-md" />
                  <SkeletonBlock className="h-20 w-full rounded-xl" />
                  <SkeletonBlock className="h-20 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-white p-6 shadow-md">
            <SkeletonBlock className="h-7 w-36 rounded-md" />
            {range(3).map((item) => (
              <div key={item} className="flex items-center gap-3">
                <SkeletonBlock className="h-16 w-16 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-4 w-4/5 rounded-md" />
                  <SkeletonBlock className="h-4 w-2/5 rounded-md" />
                </div>
              </div>
            ))}
            <SkeletonBlock className="h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
});
