import { Middleware } from "../types/routes.types";
import { findMatchingRoute } from "../utils/route.utils";
import { ROUTES } from "../constants/routes.constants";

export const routeMiddleware: Middleware = (handler) => {
  return async (event, context) => {
    const path = event.path.replace("/.netlify/functions/bff", "");
    const routeMatch = findMatchingRoute(path);

    if (!routeMatch) {
      throw { status: 404, message: "Route not found" };
    }

    const method = event.httpMethod as keyof (typeof ROUTES)[string];
    const handlerFn = ROUTES[routeMatch.route]?.[method];

    if (!handlerFn) {
      throw { status: 405, message: "Method not allowed" };
    }

    Object.assign(event, {
      pathParameters: {
        ...routeMatch.params,
      },
    });

    return handlerFn(event, context);
  };
};
