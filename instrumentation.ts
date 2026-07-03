// Runs once before any other application code (including route handler
// imports) — this is the one place we can reliably set an env var that
// Prisma reads before it resolves its own module.
//
// The bundler-relocation fixes (binaryTargets, outputFileTracingIncludes,
// standalone output) never resolved a persistent PrismaClientInitializationError
// in Vercel's deployed function, even though the ~32MB function size
// confirms the engine binary itself is present in the bundle. That means
// Prisma's runtime relative-path lookup is landing in the wrong place —
// so instead of relying on it, tell Prisma exactly where the engine is via
// an absolute path.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs" && process.env.VERCEL) {
    const path = await import("node:path");
    const fs = await import("node:fs");

    const enginePath = path.join(
      process.cwd(),
      "lib/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node",
    );

    if (fs.existsSync(enginePath)) {
      process.env.PRISMA_QUERY_ENGINE_LIBRARY = enginePath;
    }
  }
}
