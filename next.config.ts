import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:8000/api",
    NEXT_PUBLIC_APP_ENV: "development",
  },
};

export default nextConfig;
