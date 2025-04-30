import { get } from "http";
import { getAuthUser, signin, signout, signup } from "../handlers/auth/auth";
import authCheck from "../handlers/auth/auth.check";
import { getCategories } from "../handlers/categories/get";
import { getGiftById, getGifts } from "../handlers/gifts/get";
import { handleGiftStatusUpdate } from "../handlers/gifts/update";
import {
  getOrderById,
  getOrders,
  getOrdersByUserId,
} from "../handlers/orders/get";
import { getUserById } from "../handlers/users/get";
import { RouteTable } from "../types/routes.types";
import { updateUserById } from "../handlers/users/update";
import { uploadImage } from "../handlers/google-drive/upload";

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
  "/orders/user/:id": {
    GET: getOrdersByUserId,
  },
  "/users/:id": {
    GET: getUserById,
  },
  "/users/update/:id": {
    PATCH: updateUserById,
  },
  "/categories": {
    GET: getCategories,
  },
  "/auth/signin": {
    POST: signin,
  },
  "/auth/signout": {
    POST: signout,
  },
  "/auth/check": {
    GET: authCheck,
  },
  "/auth/users": {
    GET: getAuthUser,
  },
  "/drive/upload/:id": {
    POST: uploadImage,
  },
};
