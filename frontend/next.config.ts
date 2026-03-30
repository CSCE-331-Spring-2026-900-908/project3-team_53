import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.EC2_API_URL || "http://18.189.164.191"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
