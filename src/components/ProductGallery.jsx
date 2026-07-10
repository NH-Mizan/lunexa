"use client";

import { getAssetUrl } from "@/lib/asset-url";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

function AutoPlayPlugin(slider) {
  let timeout;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;

    timeout = setTimeout(() => {
      slider.next();
    }, 3000);
  }

  slider.on("created", () => {
    slider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });

    slider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });

    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
}

function ThumbnailPlugin(mainRef) {
  return (slider) => {
    function removeActive() {
      slider.slides.forEach((slide) => {
        slide.classList.remove("active");
      });
    }

    function addActive(idx) {
      slider.slides[idx]?.classList.add("active");
    }

    slider.on("created", () => {
      if (!mainRef.current) return;

      addActive(slider.track.details.rel);

      slider.slides.forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          mainRef.current?.moveToIdx(idx);
        });
      });

      mainRef.current.on("animationStarted", (main) => {
        removeActive();
        const next = main.animator.targetIdx || 0;
        addActive(main.track.absToRel(next));
        slider.moveToIdx(next);
      });
    });
  };
}

export default function ProductGallery({ product }) {
  const productImages = [
    ...(Array.isArray(product?.images) ? product.images : []),
    product?.image?.image ? { image: product.image.image } : null,
  ].filter((image) => image?.image);
  const galleryImages = productImages.length
    ? productImages
    : [{ image: "/images/sell.jpg" }];

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      initial: 0,
      loop: true,
    },
    [AutoPlayPlugin]
  );

  const [thumbnailRef] = useKeenSlider(
    {
      initial: 0,
      slides: {
        perView: 4,
        spacing: 10,
      },
    },
    [ThumbnailPlugin(instanceRef)]
  );

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
        <div ref={sliderRef} className="keen-slider overflow-hidden rounded-xl bg-gray-50">
          {galleryImages.map((img, index) => (
            <div key={img.id ?? img.image ?? index} className="keen-slider__slide">
              <div className="group grid aspect-square place-items-center overflow-hidden bg-gray-50">
                <Image
                  src={getAssetUrl(img.image)}
                  alt={product.name}
                  width={720}
                  height={720}
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {galleryImages.length > 1 && (
        <div ref={thumbnailRef} className="keen-slider thumbnail mt-4">
          {galleryImages.map((img, index) => (
            <div
              key={img.id ?? img.image ?? index}
              className="keen-slider__slide cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white p-1 transition hover:border-black"
            >
              <Image
                src={getAssetUrl(img.image)}
                alt={`${product.name} thumbnail ${index + 1}`}
                width={120}
                height={120}
                className="h-20 w-full rounded-lg object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .thumbnail .keen-slider__slide.active {
          border-color: #111827;
          box-shadow: 0 0 0 1px #111827;
        }
      `}</style>
    </div>
  );
}
