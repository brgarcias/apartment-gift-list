import { getAuthUser, signin, signout, signup } from "../handlers/auth/auth";
import authCheck from "../handlers/auth/auth.check";
import { getCategories } from "../handlers/categories/get";
import { getGiftById, getGifts } from "../handlers/gifts/get";
import { handleGiftStatusUpdate, updateGift } from "../handlers/gifts/update";
import {
  getOrderById,
  getOrders,
  getOrdersByUserId,
} from "../handlers/orders/get";
import { getUserById, getUsers } from "../handlers/users/get";
import { RouteTable } from "../types/routes.types";
import { updateUserById } from "../handlers/users/update";
import { uploadImage } from "../handlers/google-drive/upload";
import { deleteUserById } from "../handlers/users/delete";
import { createGift } from "../handlers/gifts/create";
import { deleteGift } from "../handlers/gifts/delete";

export const ROUTES: RouteTable = {
  "/gifts": {
    GET: getGifts,
  },
  "/gifts/create": {
    POST: createGift,
  },
  "/gifts/delete/:id": {
    DELETE: deleteGift,
  },
  "/gifts/update/:id": {
    PATCH: updateGift,
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
  "/users": {
    GET: getUsers,
  },
  "/users/:id": {
    GET: getUserById,
  },
  "/users/update/:id": {
    PATCH: updateUserById,
  },
  "/users/delete/:id": {
    DELETE: deleteUserById,
  },
  "/categories": {
    GET: getCategories,
  },
  "/auth/signup": {
    POST: signup,
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
