import { getCategories, getCategoryProducts } from "@/lib/api";
import CategoryProductsClient from "./CategoryProductsClient";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => Number(item.id) === Number(id));

  return {
    title: category?.name ? `${category.name} | Sell-Pixers` : "Category | Sell-Pixers",
    description: category?.name ? `Shop ${category.name} products at Sell-Pixers.` : "Shop category products at Sell-Pixers.",
  };
}

export default async function CategoryPage({ params }) {
  const { id } = await params;
  const [categories, products] = await Promise.all([
    getCategories(),
    getCategoryProducts(id),
  ]);

  return (
    <CategoryProductsClient id={id} categories={categories} products={products} />
  );
}
