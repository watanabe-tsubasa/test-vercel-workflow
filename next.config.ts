import type { NextConfig } from "next";
import { withWorkflow } from "workflow/next";
import fs from "fs";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },

  serverExternalPackages: ["@prisma/client", "prisma"],

  output: "standalone",

  webpack(config) {
    config.externals.push("@prisma/client", "prisma");

    // 🔥 Prisma バイナリを .next/standalone に強制コピーする
    config.plugins.push({
      apply: (compiler: { hooks: { afterEmit: { tap: (arg0: string, arg1: () => void) => void; }; }; }) => {
        compiler.hooks.afterEmit.tap("CopyPrismaEngines", () => {
          const src = path.join(process.cwd(), "node_modules/.prisma/client");
          const dest = path.join(
            process.cwd(),
            ".next/standalone/node_modules/.prisma/client"
          );

          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }

          if (fs.existsSync(src)) {
            fs.readdirSync(src).forEach((file) => {
              fs.copyFileSync(path.join(src, file), path.join(dest, file));
            });
          }
        });
      },
    });

    return config;
  },
};

export default withWorkflow(nextConfig);
