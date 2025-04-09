const fs = require("fs");
const path = require("path");

// Verifica se o Prisma Client foi gerado corretamente
const prismaClientPath = path.join(
  __dirname,
  "../../node_modules/.prisma/client/index.js"
);
if (!fs.existsSync(prismaClientPath)) {
  console.error("❌ Prisma Client não foi gerado corretamente");
  process.exit(1);
}

// Verifica se o build do Next.js está completo
const nextBuildPath = path.join(__dirname, "../../.next/build-manifest.json");
if (!fs.existsSync(nextBuildPath)) {
  console.error("❌ Build do Next.js incompleto");
  process.exit(1);
}

console.log("✅ Build verificado com sucesso");
process.exit(0);
