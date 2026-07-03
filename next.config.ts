import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Next.js's serverless bundler traces imports statically and doesn't
  // reliably detect Prisma's native query-engine binary (loaded at
  // runtime, not via a traceable `require()`), especially with a
  // customized `output` path like ours (lib/generated/prisma instead of
  // the default node_modules/.prisma/client). Without this, the binary
  // gets generated at build time but never makes it into the deployed
  // function bundle.
  outputFileTracingIncludes: {
    "/**/*": ["./lib/generated/prisma/**/*"],
  },
};

export default nextConfig;
