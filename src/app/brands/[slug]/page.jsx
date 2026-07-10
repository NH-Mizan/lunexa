import TaxonomyProductsClient from "@/components/Products/TaxonomyProductsClient";
import { getBrandProducts, getCategories } from "@/lib/api";

export const revalidate = 300;

function normalizeBrandResponse(response) {
  const payload = response?.data;

  return {
    brand: response?.brands ?? null,
    products: Array.isArray(payload?.data) ? payload.data : [],
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brandResponse = await getBrandProducts(slug);
  const { brand } = normalizeBrandResponse(brandResponse);

  return {
    title: brand?.name ? `${brand.name} | Sell-Pixers` : "Brand | Sell-Pixers",
    description: brand?.name
      ? `Shop ${brand.name} products at Sell-Pixers.`
      : "Shop brand products at Sell-Pixers.",
  };
}

export default async function BrandProductsPage({ params }) {
  const { slug } = await params;
  const [categories, brandResponse] = await Promise.all([
    getCategories(),
    getBrandProducts(slug),
  ]);
  const { brand, products } = normalizeBrandResponse(brandResponse);

  return (
    <TaxonomyProductsClient
      title={brand?.name ? `${brand.name} Products` : "Brand Products"}
      products={products}
      categories={categories}
    />
  );
}
