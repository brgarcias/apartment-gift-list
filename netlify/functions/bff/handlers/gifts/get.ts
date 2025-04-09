import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";

export const getGifts = async (): Promise<HandlerResponse> => {
  try {
    const gifts = await prisma.gift.findMany({
      cacheStrategy: { ttl: 60 * 60 * 24 * 7 },
    });

    return jsonResponse(200, gifts);
  } catch (error) {
    console.error("Error fetching gifts:", error);
    return errorResponse(500, "Failed to fetch gifts");
  }
};

export const getGiftById = async (event: HandlerEvent) => {
  const giftId = event.path.split("/").pop();
  if (!giftId || isNaN(parseInt(giftId))) {
    return errorResponse(400, "Invalid gift ID");
  }
  try {
    const gift = await prisma.gift.findUnique({
      where: { id: parseInt(giftId) },
      cacheStrategy: { ttl: 60 * 60 * 24 * 5 },
    });

    if (!gift) {
      return errorResponse(404, "Gift not found");
    }

    return jsonResponse(200, gift);
  } catch (error) {
    console.error("Error fetching gift by ID:", error);
    return errorResponse(500, "Failed to fetch gift by ID");
  }
};
