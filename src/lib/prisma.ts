import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { withOptimize } from "@prisma/extension-optimize";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof getPrismaClient>;
};

function getPrismaClient() {
  return new PrismaClient()
    .$extends(withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY || "" }))
    .$extends(withAccelerate());
}

export const prisma = globalForPrisma.prisma || getPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const disconnect = async () => {
  await prisma.$disconnect();
};

export const invalidateCacheByTags = async (tags: string[]) => {
  try {
    await prisma.$accelerate.invalidate({
      tags,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P6003") {
        console.log(
          "You've reached the cache invalidation rate limit. Please try again shortly."
        );
      }
    }
    throw e;
  }
};
