import { RouteHandler, Middleware } from "../types/routes.types";

export const applyMiddlewares = (
  ...middlewares: Middleware[]
): RouteHandler => {
  return middlewares.reduceRight<RouteHandler>(
    (next, middleware) => {
      return async (event, context) => {
        return middleware(next)(event, context);
      };
    },
    async () => {
      throw { status: 404, message: "No handler found" };
    }
  );
};
