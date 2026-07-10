import {
  getBrands,
  getCategories,
  getHomepageProducts,
  getHotDealProducts,
  getSliderItems,
} from "@/lib/api";
import Brands from "@/components/Home/Brands";
import HomeProducts from "@/components/Home/homeproducts";
import OfferBanner from "@/components/Home/offerbanner";
import PopularProducts from "@/components/Home/popularproducts";
import Slider from "@/components/Home/slider";
import TopCategories from "@/components/Home/topcategories";

export const revalidate = 300;

export default async function HomePage() {
  const [sliderImages, categories, popularProducts, homepageCategories, brands] =
    await Promise.all([
      getSliderItems(),
      getCategories(),
      getHotDealProducts(),
      getHomepageProducts(),
      getBrands(),
    ]);

  return (
    <div>
      <Slider images={sliderImages} />
      <TopCategories categories={categories} />
      <PopularProducts products={popularProducts.slice(0, 10)} />
      <OfferBanner />
      <HomeProducts categories={homepageCategories} />
      <Brands brands={brands} />
    </div>
  );
}
