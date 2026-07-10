import { cookies } from "next/headers";

const TOKEN_COOKIE_NAME = "auth_token";
const DEFAULT_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return baseUrl;
}

export function normalizeAuthenticatedUser(data) {
  return data?.profile ?? data?.data ?? data?.user ?? data ?? null;
}

export function getTokenCookieName() {
  return TOKEN_COOKIE_NAME;
}

export function getSessionCookieOptions(maxAge = DEFAULT_SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}

export async function laravelFetch(path, { token, headers, ...init } = {}) {
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(!isFormData && init.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    cache: "no-store",
  });

  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  return { response, data };
}

export async function getSessionToken() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value ?? null;
}

export async function getAuthenticatedUser() {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  try {
    const { response, data } = await laravelFetch("/customer/profile", { token });

    if (!response.ok) {
      return null;
    }

    return normalizeAuthenticatedUser(data);
  } catch {
    return null;
  }
}
