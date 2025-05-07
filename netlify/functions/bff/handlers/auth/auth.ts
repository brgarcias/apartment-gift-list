import { prisma } from "@/lib/prisma";
import { UserPayload, UserPayloadLogin } from "@/types/user";
import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import { errorResponse, jsonResponse } from "@/lib/response";
import RedisService from "@/lib/redis";
import { randomBytes } from "crypto";
import authCheck from "./auth.check";

export const signup = async (event: HandlerEvent): Promise<HandlerResponse> => {
  try {
    const { body } = event;
    if (!body) {
      return errorResponse(400, "No data provided");
    }
    const userData: UserPayload = JSON.parse(body);
    const verifyIfUserExists = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (verifyIfUserExists) {
      return errorResponse(409, "User already exists");
    }

    const createdUser = await prisma.user.create({
      data: userData,
    });

    return jsonResponse(200, {
      user: createdUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return errorResponse(500, "Failed to create user");
  }
};

export const signin = async (event: HandlerEvent): Promise<HandlerResponse> => {
  const redis = new RedisService();
  await redis.connect();
  try {
    const { body } = event;
    if (!body) {
      return errorResponse(400, "No data provided");
    }
    const userData: UserPayloadLogin = JSON.parse(body);
    let userFinded = await prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (!userFinded) {
      return errorResponse(404, "User not found");
    }

    const sessionToken = randomBytes(32).toString("hex");
    const sessionDuration = 60 * 60 * 24 * 7;

    const sessionData = {
      userId: userFinded.id,
      createdAt: new Date().toISOString(),
      userAgent: event.headers["user-agent"],
      ip: event.headers["client-ip"] || event.headers["x-forwarded-for"],
    };

    await redis.setWithExpiry(
      `session:${sessionToken}`,
      sessionData,
      sessionDuration
    );

    await redis.setCache(`user:${userFinded.id}`, userFinded);

    const response = jsonResponse(200, {
      id: userFinded.id,
      name: userFinded.name,
      birthDate: userFinded.birthDate,
      profileImage: userFinded.profileImage,
      email: userFinded.email,
      isAdmin: userFinded.isAdmin,
    });

    const cookieHeader = [
      `session=${sessionToken}`,
      `HttpOnly`,
      `Secure`,
      `Path=/`,
      `SameSite=Lax`,
      `Max-Age=${sessionDuration}`,
      process.env.NODE_ENV === "production" && `Domain=abcasanova.com.br`,
    ]
      .filter(Boolean)
      .join("; ");

    response.headers = {
      ...response.headers,
      "Set-Cookie": cookieHeader,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_BASE_URL || "*",
    };

    return response;
  } catch (error) {
    console.error("Error signing user:", error);
    return errorResponse(500, "Failed to sign in user");
  } finally {
    await redis.disconnect();
  }
};

export const signout = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  const redis = new RedisService();
  await redis.connect();
  try {
    const { headers } = event;
    const sessionToken = headers["cookie"]
      ?.split("; ")
      .find((row) => row.startsWith("session="))
      ?.split("=")[1];

    if (!sessionToken) {
      return errorResponse(400, "No session token provided");
    }

    await redis.deleteCache(`session:${sessionToken}`);

    const response = jsonResponse(200, { message: "User signed out" });
    response.headers = {
      ...response.headers,
      "Set-Cookie": `session=; HttpOnly; Secure; Path=/; SameSite=Strict; Max-Age=0`,
    };

    return response;
  } catch (error) {
    console.error("Error signing out user:", error);
    return errorResponse(500, "Failed to sign out user");
  } finally {
    await redis.disconnect();
  }
};

export const getAuthUser = async (
  event: HandlerEvent
): Promise<HandlerResponse> => {
  try {
    const session = await authCheck(event);

    if (session.statusCode !== 200 || !session.body) {
      return errorResponse(401, "Unauthorized");
    }

    const userSession = JSON.parse(session.body) as unknown as {
      userId: number;
    };

    const user = await prisma.user.findFirst({
      where: {
        id: userSession.userId,
      },
    });

    return jsonResponse(200, { user });
  } catch (error) {
    console.error("Error getting auth user:", error);
    return errorResponse(500, "Failed to get auth user");
  }
};
