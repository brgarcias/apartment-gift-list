import { HandlerEvent } from "@netlify/functions";
import RedisService from "@/lib/redis";

const redis = new RedisService();

export async function verifySession(event: HandlerEvent) {
  try {
    const sessionToken = event.headers.cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("session="))
      ?.split("=")[1];

    if (!sessionToken) return null;

    const sessionData = await redis.getCache(`session:${sessionToken}`);
    if (!sessionData) return null;

    await redis.setWithExpiry(
      `session:${sessionToken}`,
      sessionData,
      24 * 60 * 60
    );

    return {
      userId: sessionData.userId,
      sessionToken,
    };
  } catch (error) {
    console.error("Session verification error:", error);
    return null;
  }
}
