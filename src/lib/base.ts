/** Prefix for GitHub Pages project sites, e.g. /contemporary-art-hub. Empty in local next dev. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBase(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (basePath && normalized.startsWith(`${basePath}/`)) return normalized;
  return `${basePath}${normalized}`;
}

export function apiUrl(path: string) {
  return withBase(path.startsWith("/") ? path : `/${path}`);
}
