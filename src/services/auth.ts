import { connectDB } from "db/connection.ts";
import PasswordService from "services/pass.ts";
import { User } from "models/user.ts";
import JWTService from "services/jwt.ts";

const AuthService = {
  mapMongoId: <T>(
    document: T & { _id?: string }
  ): Omit<T, "_id"> & { id: string } => {
    const { _id, ...rest } = document;
    return { id: _id || "", ...rest };
  },
  registerUser: async (
    username: string,
    email: string,
    password: string
  ): Promise<Omit<User, "_id"> & { id: string }> => {
    const db = await connectDB();
    const users = db.collection<User>("users");

    const existingUser = await users.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new Error("Username or email is already taken.");
    }

    const passwordHash = await PasswordService.createPasswordHash(password);

    const newUser: Omit<User, "_id"> = {
      username,
      email,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertedId = await users.insertOne(newUser);

    return AuthService.mapMongoId({ _id: insertedId?.toString(), ...newUser });
  },
  loginUser: async (
    email: string,
    password: string
  ): Promise<{ token: string; user: Omit<User, "passwordHash"> }> => {
    const db = await connectDB();
    const users = db.collection<User>("users");

    const user = await users.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const isValidPassword = await PasswordService.verifyPassword(
      password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new Error("Invalid email or password.");
    }

    const token = await JWTService.create(
      { alg: "HS256", typ: "JWT" },
      {
        sub: user._id,
        username: user.username,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      Deno.env.get("JWT_SECRET") || "defaultSecret"
    );

    const { passwordHash, ...safeUser } = user;

    return { token, user: safeUser };
  },
};

export default AuthService;
