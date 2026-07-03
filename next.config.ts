import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // "standalone" copies each route's actual traced dependencies (including
  // native binaries like Prisma's query engine) into .next/standalone with
  // their real relative file layout preserved, instead of relying on the
  // regular build's bundler to inline everything into shared chunks — which
  // was severing Prisma's engine binary from the code that loads it
  // (Prisma resolves the engine path relative to its own module location,
  // and bundling moved that code into a different chunk file at runtime).
  output: "standalone",
  // Belt-and-suspenders: still explicitly include the custom Prisma client
  // output directory in case standalone's own tracing misses it too.
  outputFileTracingIncludes: {
    "/**/*": ["./lib/generated/prisma/**/*"],
  },
};

export default nextConfig;
