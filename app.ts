import { Hono } from "@hono/hono";
import { serveDir, serveFile } from "@std/http/file-server";
import { api } from "./api.ts";
import { web } from "./web.ts";

const app = new Hono();

/****************************************************
 * App Routes
 ****************************************************/
app.route("/api", api);
app.route("/", web);

/****************************************************
 * Static Routes
 ****************************************************/
app.use("/static/*", (c) => serveDir(c.req.raw));
app.use("/favicon.ico", (c) => serveFile(c.req.raw, "/favicon.ico"));
app.get("*", (c) => serveFile(c.req.raw, "./static/fallback.txt"));

/****************************************************
 * Start server
 ****************************************************/
Deno.serve({ port: 8000 }, app.fetch);
