import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  distDir: "out",
  images: {
    unoptimized: true,
    domains: ["placehold.co", "firebasestorage.googleapis.com"],
  },
  experimental: {
    optimizePackageImports: ["@heroicons/react"],
  },
};

export default nextConfig;
