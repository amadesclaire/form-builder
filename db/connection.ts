import { MongoClient, Database } from "@db/mongo";

let db: Database;

export const connectDB = async (): Promise<Database> => {
  if (!db) {
    const client = new MongoClient();

    try {
      await client.connect({
        db: Deno.env.get("DB_NAME") || "testDB",
        tls: Deno.env.get("MODE") === "production",
        servers: [
          {
            host: Deno.env.get("DB_HOST") || "127.0.0.1",
            port: parseInt(Deno.env.get("DB_PORT") || "27017", 10),
          },
        ],
        credential: {
          username: Deno.env.get("DB_USER") || "appUser",
          password: Deno.env.get("DB_PASS") || "appPassword123",
          db: Deno.env.get("DB_NAME") || "testDB",
          mechanism: "SCRAM-SHA-1",
        },
      });

      db = client.database(Deno.env.get("DB_NAME") || "testDB");
      console.log("Connected to MongoDB successfully!");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error;
    }
  }
  return db;
};
