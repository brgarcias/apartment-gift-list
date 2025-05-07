import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import { Gift } from "@prisma/client";
import { authCheckAdmin } from "../auth/auth.check";

export const createGift = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  if (!event.body) {
    return errorResponse(400, "No data provided");
  }

  const { gift }: { gift: Gift } = JSON.parse(event.body);

  try {
    const session = await authCheckAdmin(event);

    if (!session) {
      return errorResponse(401, "Unauthorized");
    }

    const createdGift = await prisma.gift.create({
      data: gift,
    });

    return jsonResponse(201, {
      gift: createdGift,
    });
  } catch (error) {
    console.error("Error in gift creation:", error);
    return errorResponse(500, "Internal server error");
  }
};
