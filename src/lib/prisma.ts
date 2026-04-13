import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

/**
 * Prisma extended client type with Accelerate
 */
type ExtendedPrismaClient = PrismaClient & {
  $accelerate: {
    invalidate: (input: { tags: string[] }) => Promise<{ requestId: string }>;
    invalidateAll: () => Promise<{ requestId: string }>;
  };
};

const createPrismaClient = () => {
  const client = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
    errorFormat: "pretty",
  });

  // Apply the accelerate extension and cast to the extended type
  return client.$extends(withAccelerate()) as unknown as ExtendedPrismaClient;
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: ExtendedPrismaClient | undefined;
}

/**
 * Singleton pattern (safe for serverless + dev hot reload)
 */
export const prisma: ExtendedPrismaClient =
  globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

/**
 * Graceful shutdown helper
 */
export const disconnect = async (): Promise<void> => {
  await prisma.$disconnect();
};

/**
 * Accelerate cache invalidation helper
 */
export const invalidateCacheByTags = async (tags: string[]): Promise<void> => {
  try {
    await prisma.$accelerate.invalidate({ tags });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P6003"
    ) {
      console.warn("Accelerate cache invalidation rate limit reached.");
      return;
    }

    throw error;
  }
};
