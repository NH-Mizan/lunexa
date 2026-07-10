'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Link from 'next/link';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/asset-url';

export default function TopCategories({ categories = [] }) {
  return (
    <section className="container my-10">
      <h2 className="category_title" >TOP CATEGORIES</h2>

      <Swiper
        slidesPerView={3}
        spaceBetween={10}
        breakpoints={{
          640: { slidesPerView: 4 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}

        modules={[Navigation, Autoplay]}
        className="category-swiper"
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat.id}>
            <Link
              href={`/category/${cat.id}`}
              className="group block bg-gray-300  rounded-md shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300" 
            >
              <div className="h-24 lg:h-36 flex items-center justify-center overflow-hidden bg-gray-100">
                <Image
                  src={getAssetUrl(cat.image)}
                  alt={cat.name}
                  width={220}
                  height={144}
                  sizes="(max-width: 768px) 33vw, 220px"
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="home_categorics text-center">
                <p className=" group-hover:text-red-400 transition">
                  {cat.name}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
