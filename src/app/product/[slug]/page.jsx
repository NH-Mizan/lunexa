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
    <section className="container my-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="w-full flex flex-col md:flex-row gap-6 p-4 bg-white shadow-md rounded-lg">
        <ProductGallery product={product} />

        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-semibold mb-2">{product.name}</h1>

          <div className="text-sm text-gray-600 mb-2">
            <span className="mr-2">Brand:</span>
            <span className="font-medium">{product?.brand?.name || "N/A"}</span>
          </div>

          <div className="my-4">
            <p className="text-xl font-bold text-pink-600">Tk {product?.new_price}</p>
            {product.old_price && (
              <p className="text-gray-500 line-through text-sm">Tk {product.old_price}</p>
            )}
            {discount > 0 && (
              <p className="text-sm text-green-600 font-semibold">{discount}% OFF</p>
            )}
          </div>

          <div className="mb-2">
            <strong>Status:</strong>
            {getProductStock(product) === 0 ? (
              <span className="ml-2 text-red-500 font-semibold">Out of Stock</span>
            ) : (
              <span className="ml-2 text-green-600 font-semibold">In Stock</span>
            )}
          </div>

          <ProductSizeColor product={product} sizes={sizes} colors={colors} />

          <div className="flex-wrap items-center gap-3 mt-4">
            <Link href="tel:01846494272" className="flex w-[270px] lg:w-[310px] justify-center text-center items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
              <FaWhatsapp className="mr-2 font-bold text-xl" /> 01846494272
            </Link>
          </div>

          <div className="mt-12">
            <div className="flex justify-between border-t pt-4 text-sm">
              <span>Delivery Charge</span>
              <span>Inside Dhaka Tk 70</span>
            </div>
            <div className="flex justify-between border-t mt-6 pt-4 text-sm">
              <span>Delivery Charge</span>
              <span>Outside Dhaka Tk 120</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full mt-10">
        <ProductInfoTabs
          description={product?.description}
          review={product?.review}
          video={product?.video}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Related Products</h2>
        <RelatedProducts currentProductId={product?.id} />
      </div>
    </section>
  );
}
