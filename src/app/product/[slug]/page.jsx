import ProductGallery from "@/components/ProductGallery";
import ProductInfoTabs from "@/components/ProductInfoTabs";
import ProductSizeColor from "@/components/ProductSizeColor";
import RelatedProducts from "@/components/RelatedProducts";
import { getAssetUrl, getProductDetails, SITE_URL } from "@/lib/api";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export const revalidate = 300;

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value = "", maxLength = 160) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trim()}...`;
}

function getProductDescription(product) {
  const description =
    stripHtml(product?.short_description) ||
    stripHtml(product?.description) ||
    product?.name ||
    "Shop this product at Sell-Pixers.";

  return truncate(description);
}

function getProductImages(product) {
  const images = Array.isArray(product?.images)
    ? product.images.map((image) => image?.image).filter(Boolean)
    : [];

  if (product?.image?.image) {
    images.unshift(product.image.image);
  }

  if (images.length === 0) {
    return [getAssetUrl("/images/sell.jpg")];
  }

  return [...new Set(images)].map((image) => getAssetUrl(image));
}

function getProductFromResponse(data) {
  return data?.data ?? data?.product ?? data ?? null;
}

function getProductStock(product) {
  return product?.variable?.stock ?? product?.stock ?? 0;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getProductDetails(slug);
  const product = getProductFromResponse(data);
  const productUrl = `${SITE_URL}/product/${product?.slug || slug}`;

  if (!product) {
    return {
      title: `Product Details - ${slug}`,
      description: "Product details",
      alternates: {
        canonical: productUrl,
      },
    };
  }

  const title = `${product.name} | Sell-Pixers`;
  const description = getProductDescription(product);
  const images = getProductImages(product);
  const imageMeta = images.map((image) => ({
    url: image,
    width: 800,
    height: 800,
    alt: product.name,
  }));

  return {
    title,
    description,
    keywords: [
      product.name,
      product?.brand?.name,
      "Sell-Pixers",
      "online shopping",
      "Bangladesh ecommerce",
    ].filter(Boolean),
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: "Sell-Pixers",
      type: "website",
      images: imageMeta,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;
  const data = await getProductDetails(slug);
  const product = getProductFromResponse(data);
  const colors = data?.colors || [];
  const sizes = data?.sizes || [];

  if (!product) {
    return <div className="text-center py-20 text-red-600">Product Not Found</div>;
  }

  const discount = product.old_price
    ? Math.round(((product.old_price - product.new_price) / product.old_price) * 100)
    : 0;
  const productUrl = `${SITE_URL}/product/${product?.slug || slug}`;
  const productImages = getProductImages(product);
  const productDescription = getProductDescription(product);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productDescription,
    image: productImages,
    brand: product?.brand?.name
      ? {
          "@type": "Brand",
          name: product.brand.name,
        }
      : undefined,
    sku: product?.sku || String(product.id ?? slug),
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "BDT",
      price: String(product?.new_price ?? ""),
      availability:
        getProductStock(product) === 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <section className="container my-6 px-0 sm:px-4 lg:my-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="grid gap-6 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:gap-8 lg:p-6">
        <ProductGallery product={product} />

        <div className="min-w-0">
          <div className="space-y-5 lg:pr-1">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Product Details
              </p>
              <h1 className="break-words text-2xl font-bold leading-tight text-gray-950 lg:text-4xl">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600 sm:px-4">
                  Brand: <span className="font-semibold text-gray-950">{product?.brand?.name || "N/A"}</span>
                </span>
                {getProductStock(product) === 0 ? (
                  <span className="rounded-md border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-600 sm:px-4">
                    Out of Stock
                  </span>
                ) : (
                  <span className="rounded-md border border-green-200 bg-green-50 px-3 py-2 font-semibold text-green-700 sm:px-4">
                    In Stock
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-3xl font-black text-gray-950">Tk {product?.new_price}</p>
                {product.old_price && (
                  <p className="pb-1 text-base font-semibold text-gray-400 line-through">
                    Tk {product.old_price}
                  </p>
                )}
                {discount > 0 && (
                  <span className="mb-1 rounded-md bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
                    {discount}% Off
                  </span>
                )}
              </div>
            </div>

            <ProductSizeColor product={product} sizes={sizes} colors={colors} />

            <Link
              href="tel:01846494272"
              className="flex w-full items-center justify-center rounded-lg bg-green-600 px-5 py-3 text-base font-bold text-white transition hover:bg-green-700"
            >
              <FaWhatsapp className="mr-2 text-xl" /> 01846494272
            </Link>

            <div className="grid gap-3 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 text-sm">
                <span className="font-semibold text-gray-600">Inside Dhaka</span>
                <span className="font-bold text-gray-950">Tk 70</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold text-gray-600">Outside Dhaka</span>
                <span className="font-bold text-gray-950">Tk 120</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 w-full lg:mt-10">
        <ProductInfoTabs
          description={product?.description}
          review={product?.review}
          video={product?.video}
        />
      </div>

      <div className="mt-8 lg:mt-10">
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <RelatedProducts currentProductId={product?.id} />
      </div>
    </section>
  );
}
