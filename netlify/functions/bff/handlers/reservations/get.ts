import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";

export const getReservations = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  try {
    const { queryStringParameters } = event;
    const { deletedAt } = queryStringParameters || {};
    const reservations = await prisma.reservation.findMany({
      cacheStrategy: {
        swr: 60,
        ttl: 60 * 60 * 12,
        tags: ["all_reservations"],
      },
      where: {
        deletedAt: deletedAt ? { not: null } : null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        gift: {
          include: {
            gift: true,
          },
        },
      },
    });

    return jsonResponse(200, reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return errorResponse(500, "Failed to fetch reservations");
  }
};

export const getReservationById = async (event: HandlerEvent) => {
  const reservationId = event.path.split("/").pop();
  if (!reservationId || isNaN(parseInt(reservationId))) {
    return errorResponse(400, "Invalid Reservation ID");
  }
  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(reservationId) },
      cacheStrategy: {
        swr: 60,
        ttl: 60 * 60 * 12,
        tags: ["reservation_by_id"],
      },
    });

    if (!reservation) {
      return errorResponse(404, "Reservation not found");
    }

    return jsonResponse(200, reservation);
  } catch (error) {
    console.error("Error fetching reservation by ID:", error);
    return errorResponse(500, "Failed to fetch reservation by ID");
  }
};
