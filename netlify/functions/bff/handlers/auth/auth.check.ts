import { parse } from "cookie";
import RedisService from "@/lib/redis";
import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { errorResponse, jsonResponse } from "@/lib/response";

export default async function authCheck(
  event: HandlerEvent
): Promise<HandlerResponse> {
  const redis = new RedisService();
  await redis.connect();

  try {
    const cookies = parse(event.headers.cookie || "");
    const sessionToken = cookies.session;

    if (!sessionToken) {
      return errorResponse(401, "Unauthorized");
    }

    const session = await redis.getCache(`session:${sessionToken}`);
    if (!session) {
      return errorResponse(401, "Session expired");
    }

    return jsonResponse(200, {
      ...session,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return errorResponse(500, "Internal server error");
  } finally {
    await redis.disconnect();
  }
}
