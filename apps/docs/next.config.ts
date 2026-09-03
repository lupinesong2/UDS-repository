import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Consume workspace packages as source (TSX) — no pre-build step required.
  transpilePackages: ["@uds/ui", "@uds/tokens", "@uds/icons"],
};

export default nextConfig;
