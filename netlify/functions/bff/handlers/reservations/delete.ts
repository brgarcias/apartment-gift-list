import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import { HandlerResponse } from "@netlify/functions";
import { GiftStatus } from "@prisma/client";

export const deleteReservation = async (
  id: number
): Promise<HandlerResponse> => {
  try {
    const deletedReservation = await prisma.reservation.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    const giftsToMarkAsAvailable = await prisma.giftOnReservation.findMany({
      where: {
        reservationId: deletedReservation.id,
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
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting reservation", error);
    return errorResponse(500, "Failed to delete a reservation");
  }
};
