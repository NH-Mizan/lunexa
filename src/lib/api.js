import { getProductSlug, normalizeProductSlug } from "./product-routing";

export { getAssetUrl, SITE_URL, ASSET_BASE_URL } from "./asset-url";
export { getProductPath, getProductSlug, normalizeProductSlug } from "./product-routing";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const DEFAULT_REVALIDATE = 300;

const HOMEPAGE_CATEGORY_SLUGS = new Set([
  "mens-fashion",
  "womens-fashion",
  "cosmetics",
  "gadgets",
  "grocery",
  "home-lifestyle",
]);

function logApiFallback(path, error) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const message = error instanceof Error ? error.message : String(error);
  console.warn(`API request failed for ${path}. Using fallback data. ${message}`);
}

function buildApiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function getJson(path, { revalidate = DEFAULT_REVALIDATE, ...init } = {}) {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
    next: init.cache === "no-store" ? undefined : { revalidate },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }

  return response.json();
}

async function getCollection(path, options) {
  try {
    const data = await getJson(path, options);
    if (Array.isArray(data?.data)) {
      return data.data;
    }

    if (Array.isArray(data?.data?.data)) {
      return data.data.data;
    }

    return Array.isArray(data) ? data : [];
  } catch (error) {
    logApiFallback(path, error);
    return [];
  }
}

function normalizeChildCategory(item = {}) {
  return {
    ...item,
  };
}

function normalizeSubcategory(item = {}) {
  const childCategories =
    item?.childcategories ??
    item?.childCategories ??
    item?.child_categories ??
    item?.children ??
    [];

  return {
    ...item,
    childcategories: Array.isArray(childCategories)
      ? childCategories.map(normalizeChildCategory)
      : [],
  };
}

function normalizeCategory(item = {}) {
  const subcategories =
    item?.subcategories ??
    item?.subCategories ??
    item?.sub_categories ??
    [];

  return {
    ...item,
    subcategories: Array.isArray(subcategories)
      ? subcategories.map(normalizeSubcategory)
      : [],
  };
}

function normalizeProduct(product = {}) {
  return {
    ...product,
    slug: getProductSlug(product),
  };
}

function normalizeProducts(products) {
  return Array.isArray(products) ? products.map(normalizeProduct) : [];
}

function normalizeProductCategory(category = {}) {
  return {
    ...category,
    products: normalizeProducts(category.products),
  };
}

export async function getCategories() {
  const categories = await getCollection("/categories", { revalidate: 900 });
  return Array.isArray(categories) ? categories.map(normalizeCategory) : [];
}

export async function getSliderItems() {
  return getCollection("/slider", { revalidate: 300 });
}

export async function getHotDealProducts() {
  return normalizeProducts(await getCollection("/hotdeal-product", { revalidate: 300 }));
}

export async function getHomepageProducts() {
  const categories = await getCollection("/homepage-product", { revalidate: 300 });
  return categories
    .filter((category) => HOMEPAGE_CATEGORY_SLUGS.has(category.slug))
    .map(normalizeProductCategory);
}

export async function getBrands() {
  return getCollection("/brands", { revalidate: 900 });
}

export async function getBrandProducts(slug, page = 1) {
  try {
    const params = new URLSearchParams();

    if (page) {
      params.set("page", String(page));
    }

    const query = params.toString();
    return await getJson(`/brands/${slug}${query ? `?${query}` : ""}`, {
      revalidate: 300,
    });
  } catch (error) {
    logApiFallback(`/brands/${slug}`, error);
    return null;
  }
}

export async function getCategoryProducts(id) {
  return normalizeProducts(await getCollection(`/category/${id}`, { revalidate: 300 }));
}

export async function getSubcategoryProducts(id) {
  return normalizeProducts(await getCollection(`/subcategory/${id}`, { revalidate: 300 }));
}

export async function getChildCategoryProducts(id) {
  return normalizeProducts(await getCollection(`/childcategory/${id}`, { revalidate: 300 }));
}

export async function getLiveSearchProducts(query) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return [];
  }

  const params = new URLSearchParams({
    search: trimmedQuery,
    q: trimmedQuery,
  });

  return normalizeProducts(await getCollection(`/livesearch?${params.toString()}`, {
    cache: "no-store",
  }));
}

export async function getRelatedProducts(id) {
  return normalizeProducts(await getCollection(`/related-product/${id}`, { revalidate: 300 }));
}

export async function getProductDetails(slugOrId) {
  try {
    const slug = normalizeProductSlug(slugOrId);
    return await getJson(`/product/${encodeURIComponent(slug)}`, { revalidate: 300 });
  } catch (error) {
    logApiFallback(`/product/${slugOrId}`, error);
    return null;
  }
}
