import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { invalidateCacheByTags, prisma } from "@/lib/prisma";
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
    const { name, birthDate, profileImage } = body;

    if (!name || !birthDate || !profileImage) {
      return errorResponse(
        400,
        "Name, birth date or profile image are required"
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { name, birthDate, profileImage },
    });

    await invalidateCacheByTags(["user_by_id"]);

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

    await invalidateCacheByTags(["user_by_id"]);

    return jsonResponse(200, updatedUser);
  } catch (error) {
    console.error("Error updating user by ID:", error);
    return errorResponse(500, "Failed to update user by ID");
  }
};
