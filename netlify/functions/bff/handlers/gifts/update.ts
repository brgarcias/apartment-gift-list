import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import { GiftStatusEnum } from "@/enums/gift.enum";
import { GiftStatus } from "@prisma/client";
import authCheck from "../auth/auth.check";

interface HandlerEventWithParams extends HandlerEvent {
  pathParameters?: {
    id?: string;
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
      default:
        return errorResponse(400, "Invalid action");
    }
  } catch (error) {
    console.error("Error in gift status update:", error);
    return errorResponse(500, "Internal server error");
  }
};
