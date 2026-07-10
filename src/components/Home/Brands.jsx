'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import Link from 'next/link';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/asset-url';

export default function Brands({ brands = [] }) {
  return (
    <section className="brand_area container ">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Shop From Brand</h1>
      <Swiper
        slidesPerView={2}
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 5 },
          1024: { slidesPerView: 7 },
        }}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={3000} // Smooth continuous motion
        loop={true}
        modules={[Autoplay]}
        className="brand-slider"
      >
        {brands.map((brand, index) => (
          <SwiperSlide key={brand.id ?? index}>
            <Link href={`/brands/${brand.slug}`}>
              <div className="border rounded-xl p-4 flex justify-center items-center h-28 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group">
                <Image
                  src={getAssetUrl(brand.image)}
                  alt={brand.name}
                  width={180}
                  height={96}
                  sizes="(max-width: 768px) 50vw, 180px"
                  className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
