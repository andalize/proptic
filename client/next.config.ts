import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    // @ts-ignore - This might not be in types yet
    errorOverlay: false,
  },
};

export default nextConfig;
