import TaxonomyProductsClient from "@/components/Products/TaxonomyProductsClient";

export default function CategoryProductsClient({ id, products = [], categories = [] }) {
  const currentCategory = categories.find((category) => Number(category.id) === Number(id));

  return (
    <TaxonomyProductsClient
      title={currentCategory?.name || "Category Products"}
      products={products}
      categories={categories}
      currentCategoryId={id}
    />
  );
}
