import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import { Gift } from "@prisma/client";
import { authCheckAdmin } from "../auth/auth.check";
import { uploadGiftImage } from "../google-drive/upload";

interface GiftWithImageFormData extends Gift {
  image: {
    content: string;
    filename: string;
    mimetype: string;
  };
}

export const createGift = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  if (!event.body) {
    return errorResponse(400, "No data provided");
  }

  const data: GiftWithImageFormData = JSON.parse(event.body);

  try {
    const session = await authCheckAdmin(event);

    if (!session) {
      return errorResponse(401, "Unauthorized");
    }

    const { image } = data;
    const imageContent = Buffer.from(image.content, "base64");

    const imageUrl = await uploadGiftImage({
      content: imageContent,
      filename: image.filename,
      mimetype: image.mimetype,
    });

    const createdGift = await prisma.gift.create({
      data: {
        name: data.name,
        purchaseLink: data.purchaseLink,
        description: data.description,
        price: data.price,
        status: data.status,
        categoryId: data.categoryId,
        imageUrl,
      },
      include: {
        Category: true,
      },
    });

    return jsonResponse(201, {
      gift: createdGift,
    });
  } catch (error) {
    console.error("Error in gift creation:", error);
    return errorResponse(500, "Internal server error");
  }
};
