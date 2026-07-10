import TaxonomyProductsClient from "@/components/Products/TaxonomyProductsClient";
import { getCategories, getSubcategoryProducts } from "@/lib/api";
import { findParentCategoryBySubcategoryId, findSubcategoryById } from "@/lib/taxonomy";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const categories = await getCategories();
  const subcategory = findSubcategoryById(categories, id);

  return {
    title: subcategory?.name ? `${subcategory.name} | Sell-Pixers` : "Subcategory | Sell-Pixers",
    description: subcategory?.name
      ? `Shop ${subcategory.name} products at Sell-Pixers.`
      : "Shop subcategory products at Sell-Pixers.",
  };
}

export default async function SubcategoryPage({ params }) {
  const { id } = await params;
  const [categories, products] = await Promise.all([
    getCategories(),
    getSubcategoryProducts(id),
  ]);
  const subcategory = findSubcategoryById(categories, id);
  const parentCategory = findParentCategoryBySubcategoryId(categories, id);

  return (
    <TaxonomyProductsClient
      title={subcategory?.name || "Subcategory Products"}
      products={products}
      categories={categories}
      currentCategoryId={parentCategory?.id ?? null}
      currentSubcategoryId={id}
    />
  );
}
