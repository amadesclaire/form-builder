import { Hono } from "@hono/hono";
import { deleteCookie, setCookie } from "@hono/hono/cookie";
import AuthService from "services/auth.ts";
import { User } from "models/user.ts";
import { HTTPException } from "@hono/hono/http-exception";

const app = new Hono();

app.post("/register", async (c) => {
  try {
    const { username, email, password } = await c.req.json();

    if (!username || !email || !password) {
      return c.json({ error: "Missing fields" }, 400);
    }

    const user: User = await AuthService.registerUser(
      username,
      email,
      password
    );
    return c.json({ message: "User registered successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(400, { message: error.message });
    } else {
      throw new HTTPException();
    }
  }
});

app.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Missing fields" }, 400);
    }

    const { token, user } = await AuthService.loginUser(email, password);

    setCookie(c, "token", token, {
      httpOnly: true,
      secure: Deno.env.get("MODE") === "production",
      sameSite: "Strict",
      path: "/",
    });

    return c.json({ message: "Login successful", token, user });
  } catch (error) {
    if (error instanceof Error) {
      throw new HTTPException(400, { message: error.message });
    } else {
      throw new HTTPException(500, { message: "Internal server error" });
    }
  }
});

app.post("/logout", async (c) => {
  await deleteCookie(c, "token", {
    path: "/",
  });
  return c.json({ message: "Logout successful" });
});

export default app;
