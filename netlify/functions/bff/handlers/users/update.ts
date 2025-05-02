import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";

export const updateUserById = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  const userId = event.path.split("/").pop();
  if (!userId || isNaN(parseInt(userId))) {
    return errorResponse(400, "Invalid user ID");
  }
  try {
    const body = JSON.parse(event.body || "{}");
    if (!body) {
      return errorResponse(400, "Invalid request body");
    }
    const { name, birthDate, profileImage, isAdmin } = body;

    if (!name || !birthDate) {
      return errorResponse(400, "Name or birth date are required");
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { name, birthDate, profileImage, isAdmin },
    });

    return jsonResponse(200, updatedUser);
  } catch (error) {
    console.error("Error updating user by ID:", error);
    return errorResponse(500, "Failed to update user by ID");
  }
};

export const uploadProfileImage = async (
  userId: string,
  profileImage: string
): Promise<HandlerResponse> => {
  if (!userId || isNaN(parseInt(userId))) {
    return errorResponse(400, "Invalid user ID");
  }
  try {
    if (!profileImage) {
      return errorResponse(400, "Profile image is required");
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { profileImage },
    });

    return jsonResponse(200, updatedUser);
  } catch (error) {
    console.error("Error updating user by ID:", error);
    return errorResponse(500, "Failed to update user by ID");
  }
};
