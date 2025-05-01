import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { prisma } from "@/lib/prisma";
import { errorResponse, jsonResponse } from "@/lib/response";
import authCheck from "../auth/auth.check";

export const getOrders = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  try {
    const { queryStringParameters } = event;
    const { deletedAt } = queryStringParameters || {};
    const orders = await prisma.order.findMany({
      cacheStrategy: { swr: 60, ttl: 60, tags: ["all_orders"] },
      where: {
        deletedAt: deletedAt ? { not: null } : null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Gift: {
          include: {
            gift: true,
          },
        },
      },
    });

    return jsonResponse(200, orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return errorResponse(500, "Failed to fetch orders");
  }
};

export const getOrderById = async (event: HandlerEvent) => {
  const orderId = event.path.split("/").pop();
  if (!orderId || isNaN(parseInt(orderId))) {
    return errorResponse(400, "Invalid Order ID");
  }
  try {
    const session = await authCheck(event);

    if (session.statusCode !== 200) {
      return session;
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      cacheStrategy: { swr: 60, ttl: 60, tags: ["order_by_id"] },
      include: {
        Gift: {
          include: {
            gift: true,
          },
        },
      },
    });

    if (!order) {
      return errorResponse(404, "Order not found");
    }

    return jsonResponse(200, order);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return errorResponse(500, "Failed to fetch order by ID");
  }
};

export const getOrdersByUserId = async (event: HandlerEvent) => {
  const userId = event.path.split("/").pop();
  if (!userId || isNaN(parseInt(userId))) {
    return errorResponse(400, "Invalid User ID");
  }
  try {
    const session = await authCheck(event);

    if (session.statusCode !== 200) {
      return session;
    }

    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      cacheStrategy: { swr: 60, ttl: 60, tags: ["order_by_user_id"] },
      include: {
        Gift: {
          include: {
            gift: {
              include: {
                Category: true,
              },
            },
          },
        },
      },
    });

    return jsonResponse(200, orders);
  } catch (error) {
    console.error("Error fetching order by user ID:", error);
    return errorResponse(500, "Failed to fetch order by user ID");
  }
};
