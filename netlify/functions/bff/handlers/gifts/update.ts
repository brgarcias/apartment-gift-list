import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import { GiftOperationResult } from "@/interfaces/gift.interface";
import { GiftStatusEnum } from "@/enums/gift.enum";
import { GiftStatus } from "@prisma/client";
import { createOrder } from "../orders/create";
import { createReservation } from "../reservations/create";

interface HandlerEventWithParams extends HandlerEvent {
  pathParameters?: {
    id?: string;
  };
}

const validateGiftForOperation = async (
  giftId: number,
  operationType: "purchase" | "reserve"
): Promise<GiftOperationResult> => {
  try {
    const gift = await prisma.gift.findUnique({ where: { id: giftId } });

    if (!gift) {
      return { success: false, error: "Gift not found" };
    }

    if (operationType === "purchase") {
      if (gift.status === GiftStatus.RESERVED)
        return { success: false, error: "Unable to purchase a reserved gift" };
      if (gift.status === GiftStatus.PURCHASED)
        return { success: false, error: "Gift already purchased" };
    } else {
      if (gift.status === GiftStatus.PURCHASED)
        return { success: false, error: "Unable to reserve a purchased gift" };
      if (gift.status === GiftStatus.RESERVED)
        return { success: false, error: "Gift already reserved" };
    }

    return { success: true, gift };
  } catch (error) {
    console.error(`Error validating gift for ${operationType}:`, error);
    return { success: false, error: "Validation failed" };
  }
};

const updateGiftStatus = async (
  giftId: number,
  updateData: { status: GiftStatus }
): Promise<GiftOperationResult> => {
  try {
    const updatedGift = await prisma.gift.update({
      where: { id: giftId },
      data: updateData,
    });
    return { success: true, gift: updatedGift };
  } catch (error) {
    console.error("Error updating gift status:", error);
    return { success: false, error: "Failed to update gift" };
  }
};

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

  const validation = await validateGiftForOperation(giftId, "purchase");
  if (!validation.success) {
    return errorResponse(400, validation.error!);
  }

  const order = await createOrder(giftId, userId);
  if (!order.success) {
    return errorResponse(500, order.error!);
  }

  const operation = await updateGiftStatus(giftId, {
    status: GiftStatus.PURCHASED,
  });
  if (!operation.success) {
    return errorResponse(500, operation.error!);
  }

  return jsonResponse(200, operation.gift);
};

const reserveGift = async (
  event: HandlerEventWithParams
): Promise<HandlerResponse> => {
  const giftId = event.pathParameters?.id
    ? parseInt(event.pathParameters.id)
    : NaN;

  const userId = event.body ? JSON.parse(event.body).userId : null;
  if (!userId) {
    return errorResponse(400, "User ID not provided");
  }

  if (!giftId) {
    return errorResponse(400, "Gift ID not provided");
  }

  const validation = await validateGiftForOperation(giftId, "reserve");
  if (!validation.success) {
    return errorResponse(400, validation.error!);
  }

  const reservation = await createReservation(giftId, userId);
  if (!reservation.success) {
    return errorResponse(500, reservation.error!);
  }

  const operation = await updateGiftStatus(giftId, {
    status: GiftStatus.RESERVED,
  });
  if (!operation.success) {
    return errorResponse(500, operation.error!);
  }

  return jsonResponse(200, operation.gift);
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
    const actions: Record<
      Exclude<GiftStatusEnum, GiftStatusEnum.AVAILABLE>,
      HandlerResponse
    > = {
      [GiftStatusEnum.PURCHASED]: await purchaseGift(event),
      [GiftStatusEnum.RESERVED]: await reserveGift(event),
    };
    return (
      actions[action as Exclude<GiftStatusEnum, GiftStatusEnum.AVAILABLE>] ||
      errorResponse(400, "Invalid action")
    );
  } catch (error) {
    console.error("Error in gift status update:", error);
    return errorResponse(500, "Internal server error");
  }
};
