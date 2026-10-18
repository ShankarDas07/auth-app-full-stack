// Single place that decides which backend the frontend talks to.
//
// - Local dev   -> .env.development  (http://localhost:8083/api/v1)
// - Netlify     -> .env.production   (Render URL) or a VITE_API_BASE_URL set in the Netlify dashboard
//
// Whatever value is given, it is cleaned up so it always ends with "/api/v1"
// (the Spring controllers are mounted under /api/v1).

const DEV_API_URL = "http://localhost:8083/api/v1";
const PROD_API_URL = "https://auth-app-full-stack.onrender.com/api/v1";

function normalizeApiUrl(raw: string | undefined): string {
  const fallback = import.meta.env.PROD ? PROD_API_URL : DEV_API_URL;
  let url = (raw ?? "").trim() || fallback;

  url = url.replace(/\/+$/, ""); // remove trailing "/"
  if (!url.endsWith("/api/v1")) url += "/api/v1";
  return url;
}

/** Used by axios, e.g. https://auth-app-full-stack.onrender.com/api/v1 */
export const API_BASE_URL = normalizeApiUrl(import.meta.env.VITE_API_BASE_URL);

/** Backend root without /api/v1. Used for OAuth2: <BACKEND_URL>/oauth2/authorization/google */
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/v1$/, "");
