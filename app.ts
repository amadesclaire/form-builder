import { Hono } from "@hono/hono";
import { trimTrailingSlash } from "@hono/hono/trailing-slash";
import { serveDir, serveFile } from "@std/http/file-server";
import { api } from "./api/api.ts";
import { web } from "./web/web.ts";

const app = new Hono({ strict: true });

/****************************************************
 * App Routes
 ****************************************************/
app.route("/api", api);
app.route("/", web);

/****************************************************
 * Middleware
 ****************************************************/
app.use(trimTrailingSlash());

/****************************************************
 * Static Routes
 ****************************************************/
app.use("/static/*", (c) => serveDir(c.req.raw));
app.use("/favicon.ico", (c) => serveFile(c.req.raw, "/logo-small.png"));
app.get("*", (c) => serveFile(c.req.raw, "./static/fallback.txt"));

/****************************************************
 * Start server
 ****************************************************/
Deno.serve({ port: 8000 }, app.fetch);
