'use client';
import Link from 'next/link';
import { PiArrowFatLineRight } from "react-icons/pi";
import ProductCard from './ProductCard';

export default function CategoryWiseProducts({ categories = [] }) {
  return (
    <section className="container">
      {categories.map(category => (
        <div key={category.id} className='my-4'>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg lg:text-3xl font-bold text-gray-800 ">{category.name}</h2>
            <Link href={`/category/${category.id}`} className="flex text-sm lg:text-lg items-center text-wt bg-pry px-4 py-1 rounded-md hover:text-sec ">
              View All <PiArrowFatLineRight className='ml-2'/>
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4">
            {category.products?.slice(0, 10).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
