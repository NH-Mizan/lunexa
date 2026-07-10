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

  if (!product?.images?.length) return null;

  return (
    <div className="w-full md:w-1/2">
      <div ref={sliderRef} className="keen-slider rounded-lg overflow-hidden">
        {product.images.map((img, index) => (
          <div key={img.id ?? index} className="keen-slider__slide">
            <Image
              src={getAssetUrl(img.image)}
              alt={product.name}
              width={640}
              height={640}
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>

      <div ref={thumbnailRef} className="keen-slider mt-3 thumbnail">
        {product.images.map((img, index) => (
          <div
            key={img.id ?? index}
            className="keen-slider__slide cursor-pointer border rounded-md overflow-hidden"
          >
            <Image
              src={getAssetUrl(img.image)}
              alt={`${product.name} thumbnail ${index + 1}`}
              width={120}
              height={80}
              className="w-full h-20 object-cover"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .thumbnail .keen-slider__slide.active {
          border: 2px solid #ec4899;
        }
      `}</style>
    </div>
  );
}
