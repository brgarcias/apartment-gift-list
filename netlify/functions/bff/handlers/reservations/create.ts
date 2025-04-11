import { prisma } from "@/lib/prisma";
import { ReservationOperationResult } from "@/interfaces/reservation.interface";

export const createReservation = async (
  giftId: number,
  userId: number
): Promise<ReservationOperationResult> => {
  try {
    const createdReservation = await prisma.reservation.create({
      data: {
        userId,
      },
    });

    await prisma.giftOnReservation.create({
      data: {
        giftId,
        reservationId: createdReservation.id,
      },
    });

    return { success: true, reservation: createdReservation };
  } catch (error) {
    console.error(
      `Error creating reservation for the giftId ${giftId}:`,
      error
    );
    return {
      success: false,
      error: `Failed to create a reservation for the giftId ${giftId}`,
    };
  }
};
