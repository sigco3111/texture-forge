import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/texture-forge',
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
