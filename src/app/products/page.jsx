import TaxonomyProductsClient from "@/components/Products/TaxonomyProductsClient";
import { getCategories, getHotDealProducts } from "@/lib/api";

export const revalidate = 300;

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getHotDealProducts(),
  ]);

  return (
    <TaxonomyProductsClient
      title="All Products"
      products={products}
      categories={categories}
    />
  );
}
