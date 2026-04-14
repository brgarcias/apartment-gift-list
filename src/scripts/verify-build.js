const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../");

// ---------- Prisma Client check ----------
const prismaEntryPath = path.join(
  root,
  "node_modules",
  "@prisma",
  "client",
  "index.js",
);

if (!fs.existsSync(prismaEntryPath)) {
  console.error("❌ Prisma Client não foi gerado corretamente");
  process.exit(1);
}

// ---------- Next.js build check ----------
const nextBuildManifestPath = path.join(root, ".next", "build-manifest.json");

if (!fs.existsSync(nextBuildManifestPath)) {
  console.error("❌ Build do Next.js incompleto");
  process.exit(1);
}

console.log("✅ Build verificado com sucesso");
process.exit(0);
