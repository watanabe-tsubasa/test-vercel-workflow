import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },

  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },

  webpack(config) {
    config.externals.push("@prisma/client", "prisma");
    return config;
  },
};

export default withWorkflow(nextConfig);
