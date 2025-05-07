import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import { authCheckAdmin } from "../auth/auth.check";

export const deleteUserById = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  const userId = event.path.split("/").pop();
  if (!userId || isNaN(parseInt(userId))) {
    return errorResponse(400, "Invalid user ID");
  }

  try {
    const session = await authCheckAdmin(event);

    if (!session) {
      return errorResponse(401, "Unauthorized");
    }

    const userWithRelations = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        orders: {
          include: {
            Gift: {
              include: {
                gift: true,
              },
            },
          },
        },
      },
    });

    if (!userWithRelations) {
      return errorResponse(404, "User not found");
    }

    const result = await prisma.$transaction(async (prisma) => {
      const giftIdsFromOrders = userWithRelations.orders.flatMap((order) =>
        order.Gift.map((giftOnOrder) => giftOnOrder.giftId)
      );

      if (giftIdsFromOrders.length > 0) {
        await prisma.gift.updateMany({
          where: { id: { in: giftIdsFromOrders } },
          data: { status: "AVAILABLE" },
        });
      }

      await prisma.giftOnOrder.deleteMany({
        where: { order: { userId: parseInt(userId) } },
      });

      await prisma.order.deleteMany({
        where: { userId: parseInt(userId) },
      });

      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(userId) },
      });

      return deletedUser;
    });

    return jsonResponse(200, result);
  } catch (error) {
    console.error("Error deleting user by ID:", error);
    return errorResponse(500, "Failed to delete user by ID");
  }
};
