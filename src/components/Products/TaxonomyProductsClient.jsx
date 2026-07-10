"use client";

import ProductCard from "@/components/Home/ProductCard";
import { getChildCategories, getSubcategories } from "@/lib/taxonomy";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

function SortableProducts({ products, title }) {
  const [sortBy, setSortBy] = useState("");

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sortBy === "price") return Number(a.new_price) - Number(b.new_price);
      if (sortBy === "price-desc") return Number(b.new_price) - Number(a.new_price);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, sortBy]);

  return (
    <div className="space-y-5 md:col-span-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-lg font-semibold text-gray-900 lg:text-2xl">{title}</h1>

        <select
          className="rounded-md border px-3 py-2 shadow-sm"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="">Sort By</option>
          <option value="price">Price Low to High</option>
          <option value="price-desc">Price High to Low</option>
          <option value="name">Name A to Z</option>
        </select>
      </div>

      <div className="text-sm text-gray-600">
        Showing {sortedProducts.length} product{sortedProducts.length === 1 ? "" : "s"}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {sortedProducts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500">
          No products found for the selected filters.
        </div>
      ) : null}
    </div>
  );
}

export default function TaxonomyProductsClient({
  title = "Products",
  products = [],
  categories = [],
  currentCategoryId = null,
  currentSubcategoryId = null,
  currentChildCategoryId = null,
}) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    currentCategoryId ? String(currentCategoryId) : ""
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
    currentSubcategoryId ? String(currentSubcategoryId) : ""
  );
  const [selectedChildCategoryId, setSelectedChildCategoryId] = useState(
    currentChildCategoryId ? String(currentChildCategoryId) : ""
  );
  const router = useRouter();

  const priceBounds = useMemo(() => {
    const prices = products
      .map((product) => Number(product.new_price ?? 0))
      .filter((price) => Number.isFinite(price));

    if (prices.length === 0) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  const [selectedMinPrice, setSelectedMinPrice] = useState(priceBounds.min);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(priceBounds.max);

  useEffect(() => {
    setSelectedMinPrice(priceBounds.min);
    setSelectedMaxPrice(priceBounds.max);
  }, [priceBounds.max, priceBounds.min]);

  const activeCategory = useMemo(
    () =>
      categories.find(
        (category) => String(category.id) === String(selectedCategoryId)
      ) ?? null,
    [categories, selectedCategoryId]
  );

  const activeSubcategories = useMemo(
    () => getSubcategories(activeCategory),
    [activeCategory]
  );

  const activeSubcategory = useMemo(
    () =>
      activeSubcategories.find(
        (subcategory) => String(subcategory.id) === String(selectedSubcategoryId)
      ) ?? null,
    [activeSubcategories, selectedSubcategoryId]
  );

  const activeChildCategories = useMemo(
    () => getChildCategories(activeSubcategory),
    [activeSubcategory]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const productPrice = Number(product.new_price ?? 0);
      const categoryMatch =
        !selectedCategoryId ||
        String(product.category_id ?? "") === String(selectedCategoryId);
      const subcategoryMatch =
        !selectedSubcategoryId ||
        String(product.subcategory_id ?? "") === String(selectedSubcategoryId);
      const childCategoryMatch =
        !selectedChildCategoryId ||
        String(product.childcategory_id ?? "") === String(selectedChildCategoryId);
      const minPriceMatch = productPrice >= selectedMinPrice;
      const maxPriceMatch = productPrice <= selectedMaxPrice;

      return (
        categoryMatch &&
        subcategoryMatch &&
        childCategoryMatch &&
        minPriceMatch &&
        maxPriceMatch
      );
    });
  }, [
    products,
    selectedCategoryId,
    selectedChildCategoryId,
    selectedMaxPrice,
    selectedMinPrice,
    selectedSubcategoryId,
  ]);

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategoryId(value);
    setSelectedSubcategoryId("");
    setSelectedChildCategoryId("");

    if (value) {
      router.push(`/category/${value}`);
    }
  };

  const handleSubcategoryChange = (event) => {
    const value = event.target.value;
    setSelectedSubcategoryId(value);
    setSelectedChildCategoryId("");

    if (value) {
      router.push(`/subcategory/${value}`);
    }
  };

  const handleChildCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedChildCategoryId(value);

    if (value) {
      router.push(`/childcategory/${value}`);
    }
  };

  const handleMinPriceChange = (event) => {
    const value = Number(event.target.value);
    setSelectedMinPrice(Math.min(value, selectedMaxPrice));
  };

  const handleMaxPriceChange = (event) => {
    const value = Number(event.target.value);
    setSelectedMaxPrice(Math.max(value, selectedMinPrice));
  };

  const priceRange = Math.max(priceBounds.max - priceBounds.min, 1);
  const minThumbPosition =
    ((selectedMinPrice - priceBounds.min) / priceRange) * 100;
  const maxThumbPosition =
    ((selectedMaxPrice - priceBounds.min) / priceRange) * 100;

  return (
    <div className="container min-h-screen py-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <aside className="space-y-5 rounded-xl bg-white p-4 shadow">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Price Range</h2>

            <div className="space-y-3">
              <div className="relative h-8">
                <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200" />
                <div
                  className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-orange-500"
                  style={{
                    left: `${minThumbPosition}%`,
                    right: `${100 - maxThumbPosition}%`,
                  }}
                />
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={selectedMinPrice}
                  onChange={handleMinPriceChange}
                  disabled={priceBounds.max === priceBounds.min}
                  className="pointer-events-none absolute h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:bg-white"
                />
                <input
                  type="range"
                  min={priceBounds.min}
                  max={priceBounds.max}
                  value={selectedMaxPrice}
                  onChange={handleMaxPriceChange}
                  disabled={priceBounds.max === priceBounds.min}
                  className="pointer-events-none absolute h-8 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:bg-white"
                />
              </div>

              <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                <span>${selectedMinPrice}</span>
                <span>${selectedMaxPrice}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>

            <div className="space-y-4">
              {categories.map((category) => {
                const categoryChecked =
                  String(selectedCategoryId ?? "") === String(category.id);
                const subcategories = getSubcategories(category);

                return (
                  <div key={category.id} className="space-y-2 rounded-lg border border-gray-100 p-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-800">
                      <input
                        type="radio"
                        name="category-filter"
                        value={category.id}
                        checked={categoryChecked}
                        onChange={handleCategoryChange}
                        className="h-4 w-4 cursor-pointer accent-pry"
                      />
                      <span>{category.name}</span>
                    </label>

                    {subcategories.length > 0 ? (
                      <div
                        className={`border-l border-gray-200 pl-4 ${
                          categoryChecked ? "mt-3 space-y-2" : "hidden"
                        }`}
                      >
                        {subcategories.map((subcategory) => {
                          const subcategoryChecked =
                            String(selectedSubcategoryId ?? "") === String(subcategory.id);
                          const childCategories = getChildCategories(subcategory);

                          return (
                            <div key={subcategory.id} className="space-y-2">
                              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                                <input
                                  type="radio"
                                  name="subcategory-filter"
                                  value={subcategory.id}
                                  checked={subcategoryChecked}
                                  onChange={handleSubcategoryChange}
                                  className="h-4 w-4 cursor-pointer accent-pry"
                                />
                                <span>{subcategory.name}</span>
                              </label>

                              {childCategories.length > 0 ? (
                                <div
                                  className={`border-l border-gray-200 pl-4 ${
                                    subcategoryChecked ? "space-y-2" : "hidden"
                                  }`}
                                >
                                  {childCategories.map((childCategory) => {
                                    const childCategoryChecked =
                                      String(selectedChildCategoryId ?? "") ===
                                      String(childCategory.id);

                                    return (
                                      <label
                                        key={childCategory.id}
                                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
                                      >
                                        <input
                                          type="radio"
                                          name="childcategory-filter"
                                          value={childCategory.id}
                                          checked={childCategoryChecked}
                                          onChange={handleChildCategoryChange}
                                          className="h-4 w-4 cursor-pointer accent-pry"
                                        />
                                        <span>{childCategory.name}</span>
                                      </label>
                                    );
                                  })}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <SortableProducts products={filteredProducts} title={title} />
      </div>
    </div>
  );
}
