import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import { HandlerResponse } from "@netlify/functions";
import { GiftStatus } from "@prisma/client";

export const deleteOrder = async (id: number): Promise<HandlerResponse> => {
  try {
    const deletedOrder = await prisma.order.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    const giftsToMarkAsAvailable = await prisma.giftOnOrder.findMany({
      where: {
        orderId: deletedOrder.id,
      },
      select: {
        giftId: true,
      },
    });

    await prisma.gift.updateMany({
      where: {
        id: {
          in: giftsToMarkAsAvailable.map((gift) => gift.giftId),
        },
      },
      data: {
        status: GiftStatus.AVAILABLE,
      },
    });

    return jsonResponse(204, {
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order", error);
    return errorResponse(500, "Failed to delete a order");
  }
};
