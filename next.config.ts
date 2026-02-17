import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: "1337",
      }
    ],
  },
};

export default nextConfig;