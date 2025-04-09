import { getGiftById, getGifts } from "../handlers/gifts/get";
import { handleGiftStatusUpdate } from "../handlers/gifts/update";
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
};
