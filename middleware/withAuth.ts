import { Handler } from "@std/http";
import JWTService from "services/jwt.ts";

export const withAuth = (handler: Handler): Handler => {
  return async (req, info, params) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = authHeader.substring(7);
    const isValid = await JWTService.verify(token);

    if (!isValid) {
      return new Response("Invalid token", { status: 401 });
    }

    return handler(req, info, params);
  };
};
