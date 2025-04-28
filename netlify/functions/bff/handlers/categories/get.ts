import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";

export const getCategories = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  try {
    const categories = await prisma.category.findMany({
      cacheStrategy: { swr: 60, ttl: 60, tags: ["all_categories"] },
      orderBy: {
        createdAt: "desc",
      },
    });

    return jsonResponse(200, categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return errorResponse(500, "Failed to fetch categories");
  }
};
