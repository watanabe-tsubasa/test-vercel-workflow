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

  webpack(config) {
    config.externals.push("@prisma/client", "prisma");

    config.plugins.push({
      apply: (compiler: { hooks: { afterEmit: { tap: (arg0: string, arg1: () => void) => void; }; }; }) => {
        compiler.hooks.afterEmit.tap("CopyPrismaEngines", () => {
          const srcDir = path.join(process.cwd(), "node_modules/.prisma/client");
          const vercelOutput = path.join(process.cwd(), ".vercel/output/functions");

          if (!fs.existsSync(srcDir)) return;
          if (!fs.existsSync(vercelOutput)) return;

          console.log("Copying Prisma engines to Vercel functions...");

          const functions = fs.readdirSync(vercelOutput);

          for (const fn of functions) {
            const fnDir = path.join(vercelOutput, fn, "index.func", "node_modules/.prisma/client");

            if (!fs.existsSync(fnDir)) {
              fs.mkdirSync(fnDir, { recursive: true });
            }

            fs.readdirSync(srcDir).forEach((file) => {
              fs.copyFileSync(path.join(srcDir, file), path.join(fnDir, file));
            });
          }
        });
      },
    });

    return config;
  },
};

export default withWorkflow(nextConfig);
