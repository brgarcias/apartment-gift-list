import { ROUTES } from "../constants/routes.constants";
import { extractPathParams } from "./params.utils";

export const findMatchingRoute = (
  path: string
): { route: string; params: Record<string, string> } | null => {
  for (const route of Object.keys(ROUTES)) {
    const routeParts = route.split("/");
    const pathParts = path.split("/");

    if (routeParts.length !== pathParts.length) continue;

    const isMatch = routeParts.every(
      (part, index) => part === pathParts[index] || part.startsWith(":")
    );

    if (isMatch) {
      return {
        route,
        params: extractPathParams(route, path),
      };
    }
  }
  return null;
};
