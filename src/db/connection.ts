import { MongoClient, Database } from "@db/mongo";

let db: Database;

export const connectDB = async (): Promise<Database> => {
  if (!db) {
    const client = new MongoClient();

    await client.connect({
      db: Deno.env.get("DB_NAME") || "test",
      tls: true,
      servers: [
        {
          host: Deno.env.get("DB_HOST") || "127.0.0.1",
          port: parseInt(Deno.env.get("DB_PORT") || "27017", 10),
        },
      ],
      credential: {
        username: Deno.env.get("DB_USER") || "",
        password: Deno.env.get("DB_PASS") || "",
        db: Deno.env.get("DB_NAME") || "test",
        mechanism: "SCRAM-SHA-1",
      },
    });

    db = client.database(Deno.env.get("DB_NAME") || "test");
  }
  return db;
};
