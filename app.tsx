// app.ts
import AuthController from "controllers/authController.ts";
import { connectDB } from "db/connection.ts";
import { Handler, Route, route } from "@std/http";
import HomePage from "views/home.ts";
import { authRoutes } from "routes/authRoutes.ts";
import { withAuth } from "middleware/withAuth.ts";
// TODO: Request validation in controllers

const db = await connectDB();
const authController = new AuthController(db);

const routes: Route[] = [
  ...authRoutes(authController),
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/protected" }),
    handler: withAuth((_req) => {
      return new Response("This is a protected resource", { status: 200 });
    }),
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/dashboard" }),
    handler: (_req) => {
      return new Response("This is a public resource");
    },
  },
  {
    method: "GET",
    pattern: new URLPattern({ pathname: "/" }),
    handler: (_request: Request) => {
      const body = HomePage;
      return new Response(body, {
        status: 200,
        headers: { "Content-Type": "text/html" },
      });
    },
  },
];

function defaultHandler(_req: Request) {
  return new Response("Not found", { status: 404 });
}

Deno.serve(route(routes, defaultHandler));
