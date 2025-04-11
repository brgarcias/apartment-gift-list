import { prisma } from "@/lib/prisma";
import { OrderOperationResult } from "@/interfaces/order.interface";

export const createOrder = async (
  giftId: number,
  userId: number
): Promise<OrderOperationResult> => {
  try {
    const createdOrder = await prisma.order.create({
      data: {
        userId,
      },
    });

    await prisma.giftOnOrder.create({
      data: {
        giftId,
        orderId: createdOrder.id,
      },
    });

    return { success: true, order: createdOrder };
  } catch (error) {
    console.error(`Error creating order for the giftId ${giftId}:`, error);
    return {
      success: false,
      error: `Failed to create a order for the giftId ${giftId}`,
    };
  }
};
