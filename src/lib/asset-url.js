export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://sellpixer.websolutionit.com";

export const ASSET_BASE_URL =
  process.env.NEXT_PUBLIC_ASSET_URL?.replace(/\/$/, "") || SITE_URL;

export function getAssetUrl(path) {
  if (!path) {
    return "/images/sell-pixer.webp";
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${ASSET_BASE_URL}${normalizedPath}`;
}
