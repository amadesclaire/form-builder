import JWTService from "services/jwt.ts";
import { Context, Next } from "@hono/hono";
import { HTTPException } from "@hono/hono/http-exception";
import { getCookie } from "@hono/hono/cookie";

export const authenticate = async (c: Context, next: Next) => {
  const token = getCookie(c, "token");

  if (!token) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const secret = Deno.env.get("JWT_SECRET") || "defaultSecret";

  const isValid = await JWTService.verify(token, secret);
  if (!isValid) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const payload = JWTService.payload(token);
  c.set("user", payload);

  await next();
};
