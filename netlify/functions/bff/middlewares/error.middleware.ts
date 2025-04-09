import { Middleware } from "../types/routes.types";
import { errorResponse } from "@/lib/response";

export const errorMiddleware: Middleware = (handler) => {
  return async (event, context) => {
    try {
      return await handler(event, context);
    } catch (error: any) {
      console.error("Error in BFF handler:", error);
      return errorResponse(
        error.status || 500,
        error.message || "Internal server error"
      );
    }
  };
};
