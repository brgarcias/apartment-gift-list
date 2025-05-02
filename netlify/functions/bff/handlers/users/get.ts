import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";

export const getUserById = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  const userId = event.path.split("/").pop();
  if (!userId || isNaN(parseInt(userId))) {
    return errorResponse(400, "Invalid user ID");
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        orders: {
          include: {
            Gift: true,
          },
        },
      },
    });

    if (!user) {
      return errorResponse(404, "User not found");
    }

    return jsonResponse(200, user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return errorResponse(500, "Failed to fetch user by ID");
  }
};
