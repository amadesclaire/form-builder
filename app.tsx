// app.ts
import { Handler, Route, route } from "@std/http";
import HomePage from "views/home.ts";
import { authRoutes } from "routes/authRoutes.ts";
// TODO: Request validation in controllers

const routes: Route[] = [
  ...authRoutes(),
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
