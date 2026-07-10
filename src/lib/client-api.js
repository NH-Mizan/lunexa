import { getProductSlug } from "./product-routing";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

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

async function getJson(path, init = {}) {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status}`);
  }

  return response.json();
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

export async function getLiveSearchProducts(query) {
  const trimmedQuery = query?.trim();

  if (!trimmedQuery) {
    return [];
  }

  const params = new URLSearchParams({
    search: trimmedQuery,
    q: trimmedQuery,
  });

  return normalizeProducts(await getCollection(`/livesearch?${params.toString()}`));
}
