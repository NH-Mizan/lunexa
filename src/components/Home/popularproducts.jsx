"use client";
import ProductCard from './ProductCard';

export default function PopularProducts({ products = [] }) {

  return (
   <section className="container">
      <h2 className="text-3xl font-bold text-center mb-8">
        <span className="text-pry italic block text-base"> Shop Bangladesh</span>
        Popular Product
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            product={product} />
        ))}
      </div>
    </section>
  );
}
