import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || process.env.BASE_PATH || "";
const isStatic = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (isStatic) return [];
    return [
      { source: "/original-site", destination: "/archive" },
      { source: "/original-site/:path*", destination: "/archive/:path*" },
    ];
  },
};

if (isStatic) nextConfig.output = "export";
if (basePath) nextConfig.basePath = basePath;

export default nextConfig;
