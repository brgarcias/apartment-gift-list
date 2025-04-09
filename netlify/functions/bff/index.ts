import { Handler } from "@netlify/functions";
import { applyMiddlewares } from "./middlewares";
import { routeMiddleware } from "./middlewares/route.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { disconnect } from "@/lib/prisma";

const composedHandler = applyMiddlewares(errorMiddleware, routeMiddleware);

export const handler: Handler = async (event, context) => {
  try {
    return await composedHandler(event, context);
  } finally {
    await disconnect();
  }
};
