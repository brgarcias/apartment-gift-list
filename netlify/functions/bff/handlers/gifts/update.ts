import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import { GiftStatusEnum } from "@/enums/gift.enum";
import { Gift, GiftStatus } from "@prisma/client";
import authCheck, { authCheckAdmin } from "../auth/auth.check";
import { uploadGiftImage } from "../google-drive/upload";

interface HandlerEventWithParams extends HandlerEvent {
  pathParameters?: {
    id?: string;
  };
}

interface GiftWithImageFormData extends Gift {
  image: {
    content: string;
    filename: string;
    mimetype: string;
  };
}

const purchaseGift = async (
  event: HandlerEventWithParams
): Promise<HandlerResponse> => {
  const userId = event.body ? JSON.parse(event.body).userId : null;
  if (!userId) {
    return errorResponse(400, "User ID not provided");
  }

  const giftId = event.pathParameters?.id
    ? parseInt(event.pathParameters.id)
    : NaN;

  if (!giftId) {
    return errorResponse(400, "Gift ID not provided");
  }

  try {
    const result = await prisma.$transaction(async (prisma) => {
      // Lock the gift row for update
      const gift = await prisma.gift.findUnique({
        where: { id: giftId },
        select: { status: true },
      });

      if (!gift) {
        throw new Error("Presente não encontrado");
      }

      if (gift.status !== GiftStatus.AVAILABLE) {
        throw new Error(
          gift.status === GiftStatus.PURCHASED
            ? "Este presente já foi comprado"
            : "Não é possível comprar um presente reservado"
        );
      }

      const order = await prisma.order.create({
        data: {
          userId,
        },
      });

      await prisma.giftOnOrder.create({
        data: {
          giftId,
          orderId: order.id,
        },
      });

      const updatedGift = await prisma.gift.update({
        where: {
          id: giftId,
        },
        data: {
          status: GiftStatus.PURCHASED,
        },
      });

      return { order, gift: updatedGift };
    });

    return jsonResponse(200, result.gift);
  } catch (error) {
    console.error("Error in purchase transaction:", error);
    return errorResponse(
      400,
      error instanceof Error ? error.message : "Falha na compra do presente"
    );
  }
};

const returnGift = async (
  event: HandlerEventWithParams
): Promise<HandlerResponse> => {
  const giftId = event.pathParameters?.id
    ? parseInt(event.pathParameters.id)
    : NaN;
  if (!giftId) {
    return errorResponse(400, "Gift ID not provided");
  }
  try {
    const session = await authCheckAdmin(event);

    if (!session) {
      return errorResponse(401, "Unauthorized");
    }
    const gift = await prisma.gift.findUnique({
      where: { id: giftId },
      select: { status: true, GiftOnOrder: { select: { orderId: true } } },
    });
    if (!gift) {
      return errorResponse(404, "Gift not found");
    }
    if (gift.status !== GiftStatus.PURCHASED) {
      return errorResponse(400, "Gift is not purchased");
    }
    const result = await prisma.$transaction(async (prisma) => {
      await prisma.giftOnOrder.deleteMany({
        where: { giftId: giftId },
      });

      const orderId = gift.GiftOnOrder[0].orderId;

      await prisma.order.delete({
        where: { id: orderId },
      });

      const updatedGift = await prisma.gift.update({
        where: { id: giftId },
        data: { status: GiftStatus.AVAILABLE },
      });

      return updatedGift;
    });
    return jsonResponse(200, result);
  } catch (error) {
    console.error("Error in returnGift:", error);
    return errorResponse(
      500,
      error instanceof Error ? error.message : "Internal server error"
    );
  }
};

export const handleGiftStatusUpdate = async (
  event: HandlerEventWithParams
): Promise<HandlerResponse> => {
  if (!event.body) {
    return errorResponse(400, "No data provided");
  }

  const { action }: { action: GiftStatusEnum } = JSON.parse(event.body);
  const giftId = event.pathParameters?.id;

  if (!giftId) {
    return errorResponse(400, "Gift ID not provided");
  }

  try {
    const session = await authCheck(event);

    if (session.statusCode !== 200) {
      return session;
    }

    switch (action) {
      case GiftStatusEnum.PURCHASED:
        return await purchaseGift(event);
      case GiftStatusEnum.AVAILABLE:
        return await returnGift(event);
      default:
        return errorResponse(400, "Invalid action");
    }
  } catch (error) {
    console.error("Error in gift status update:", error);
    return errorResponse(500, "Internal server error");
  }
};

export const updateGift = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  const giftId = event.path.split("/").pop();
  if (!giftId || isNaN(parseInt(giftId))) {
    return errorResponse(400, "Invalid gift ID");
  }

  if (!event.body) {
    return errorResponse(400, "No data provided");
  }

  const data: GiftWithImageFormData = JSON.parse(event.body);

  try {
    const session = await authCheckAdmin(event);

    if (!session) {
      return errorResponse(401, "Unauthorized");
    }

    let imageUrl = data.imageUrl;

    const { image } = data;
    if (image) {
      const imageContent = Buffer.from(image.content, "base64");

      imageUrl = await uploadGiftImage({
        content: imageContent,
        filename: image.filename,
        mimetype: image.mimetype,
      });
    }

    const updatedGift = await prisma.gift.update({
      where: {
        id: parseInt(giftId),
      },
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
      giftUpdated: updatedGift,
    });
  } catch (error) {
    console.error("Error in gift update:", error);
    return errorResponse(500, "Internal server error");
  }
};
