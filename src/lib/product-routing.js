export function getProductSlug(product = {}) {
  return (
    product?.slug ??
    product?.product_slug ??
    product?.productSlug ??
    product?.url_slug ??
    product?.seo_slug ??
    null
  );
}

export function normalizeProductSlug(slug) {
  if (slug == null) {
    return "";
  }

  const value = String(slug);

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getProductPath(product = {}) {
  const slug = normalizeProductSlug(getProductSlug(product));
  return slug ? `/product/${encodeURIComponent(slug)}` : "#";
}
