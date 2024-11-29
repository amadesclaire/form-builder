import { connectDB } from "./connection.ts";
import { ObjectId } from "@db/mongo";

const seed = async () => {
  const db = await connectDB();

  const users = db.collection("users");

  // Seed Users
  await users.insertMany([
    {
      _id: new ObjectId(),
      username: "testuser",
      password: "hashedpassword",
    },
  ]);

  console.log("Database seeded!");
};

await seed();
