import { HandlerResponse } from "@netlify/functions";

export const jsonResponse = (
  statusCode: number,
  body: any
): HandlerResponse => ({
  statusCode,
  body: JSON.stringify(body),
  headers: {
    "Content-Type": "application/json",
  },
});

export const errorResponse = (statusCode: number, message: string) =>
  jsonResponse(statusCode, { error: message });
