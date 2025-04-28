import { getCategories } from "../handlers/categories/get";
import { getGiftById, getGifts } from "../handlers/gifts/get";
import { handleGiftStatusUpdate } from "../handlers/gifts/update";
import { getOrderById, getOrders } from "../handlers/orders/get";
import { RouteTable } from "../types/routes.types";

export const ROUTES: RouteTable = {
  "/gifts": {
    GET: getGifts,
  },
  "/gifts/:id": {
    GET: getGiftById,
  },
  "/gifts/:id/status": {
    PATCH: handleGiftStatusUpdate,
  },
  "/orders": {
    GET: getOrders,
  },
  "/orders/:id": {
    GET: getOrderById,
  },
  "/categories": {
    GET: getCategories,
  },
};
