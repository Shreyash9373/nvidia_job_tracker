import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ⚠️ Warning: This allows production builds to complete even if ESLint errors exist
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
