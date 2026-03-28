import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/types", "@repo/ui", "@repo/utils"],
  devIndicators: false,
};

export default nextConfig;
