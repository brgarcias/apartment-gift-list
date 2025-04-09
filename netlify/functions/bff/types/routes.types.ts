import {
  HandlerEvent,
  HandlerContext,
  HandlerResponse,
} from "@netlify/functions";

export type RouteHandler = (
  event: HandlerEvent,
  context: HandlerContext
) => Promise<HandlerResponse>;

export type RouteTable = Record<
  string,
  Partial<Record<"GET" | "POST" | "PUT" | "PATCH" | "DELETE", RouteHandler>>
>;

export type Middleware = (
  handler: RouteHandler
) => (
  event: HandlerEvent,
  context: HandlerContext,
  next?: () => Promise<void>
) => Promise<HandlerResponse>;
