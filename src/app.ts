import { Hono } from "@hono/hono";
import { connectDB } from "db/connection.ts";
import { authenticate } from "middleware/authenticate.ts";
import Auth from "./routes/auth.ts";

const startServer = async () => {
  const db = await connectDB();

  const app = new Hono();

  app.get("/", (c) => {
    return c.text("Hello Hono!");
  });

  app.get("/db-test", async (c) => {
    try {
      const collections = await db.listCollectionNames();
      return c.json({
        message: "Database connection successful!",
        collections,
      });
    } catch (error) {
      if (error instanceof Deno.errors.PermissionDenied) {
        console.error("Database connection test failed:", error);
        return c.json(
          { message: "Database connection failed", error: error.message },
          500
        );
      }
    }
  });

  app.get("/protected", authenticate, (c) => {
    const user = c.get("user");
    return c.json({ message: "This is a protected route", user });
  });

  /*
   * Imported Routes
   */
  app.route("/auth", Auth);

  console.log("Server is running on http://localhost:8000");
  Deno.serve({ port: 8000 }, app.fetch);
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
