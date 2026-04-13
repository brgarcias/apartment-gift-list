import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import { authCheckAdmin } from "../auth/auth.check";

export const deleteGift = async (
  event: HandlerEvent,
): Promise<HandlerResponse> => {
  const giftId = event.path.split("/").pop();
  if (!giftId || Number.isNaN(Number.parseInt(giftId))) {
    return errorResponse(400, "Invalid gift ID");
  }

  try {
    const session = await authCheckAdmin(event);

    if (!session) {
      return errorResponse(401, "Unauthorized");
    }

    const deletedGift = await prisma.gift.delete({
      where: { id: Number.parseInt(giftId) },
    });

    return jsonResponse(200, {
      message: "Gift deleted successfully",
      gift: deletedGift,
    });
  } catch (error) {
    console.error("Error deleting gift:", error);
    return errorResponse(500, "Internal server error");
  }
};
