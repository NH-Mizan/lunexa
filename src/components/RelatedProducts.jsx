import ProductCard from "./Home/ProductCard";
import { getRelatedProducts } from "@/lib/api";

export default async function RelatedProducts({ currentProductId }) {
  const products = (await getRelatedProducts(currentProductId)).slice(0, 10);

  if (!products.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
