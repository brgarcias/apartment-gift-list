import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import { Gift } from "@prisma/client";
import { authCheckAdmin } from "../auth/auth.check";

interface GiftWithImageFormData extends Gift {
  image: {
    content: string;
    filename: string;
    mimetype: string;
  };
}

export const deleteGift = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  const giftId = event.path.split("/").pop();
  if (!giftId || isNaN(parseInt(giftId))) {
    return errorResponse(400, "Invalid gift ID");
  }

  try {
    const session = await authCheckAdmin(event);

    if (!session) {
      return errorResponse(401, "Unauthorized");
    }

    const deletedGift = await prisma.gift.delete({
      where: { id: parseInt(giftId) },
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
