import { connectDB } from "db/connection.ts";
import PasswordService from "./pass.ts";
import { User } from "models/user.ts";
import JWTService, { JWTPayload } from "./jwt.ts";
import { Database } from "@db/mongo";
import {
  ExistingEmailError,
  ExistingUsernameError,
  NotFoundError,
  ShortPassword,
} from "lib/errors.ts";
import { UnauthorizedError } from "lib/errors.ts";
import { InvalidCredentialsError } from "lib/errors.ts";
import { getUnixTime } from "utils/getUnixTime.ts";

class AuthService {
  private db: Database;
  constructor(db: Database) {
    this.db = db;
  }
  mapMongoId<T>(
    document: T & { _id?: string }
  ): Omit<T, "_id"> & { id: string } {
    const { _id, ...rest } = document;
    return { id: _id || "", ...rest };
  }

  async registerUser(
    username: string,
    email: string,
    password: string
  ): Promise<Omit<User, "_id"> & { id: string }> {
    const db = await connectDB();
    const users = db.collection<User>("users");

    // check password is 16 characters long
    if (password.length < 16) {
      throw new ShortPassword("Password must be at least 16 characters long.");
    }

    const existingUserEmail = await users.findOne({ email });
    const existingUserUsername = await users.findOne({ username });
    if (existingUserEmail) {
      throw new ExistingEmailError("Email is already taken.");
    }
    if (existingUserUsername) {
      throw new ExistingUsernameError("Username is already taken.");
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

    return this.mapMongoId({ _id: insertedId?.toString(), ...newUser });
  }
  async loginUser(email: string, password: string): Promise<{ token: string }> {
    const db = await connectDB();
    const users = db.collection<User>("users");

    const user = await users.findOne({ email });
    if (!user) {
      throw new InvalidCredentialsError("Invalid email or password.");
    }

    const isValidPassword = await PasswordService.verifyPassword(
      password,
      user.passwordHash
    );
    if (!isValidPassword) {
      throw new Error("Invalid email or password.");
    }

    const token = await JWTService.create(user);

    const { passwordHash, ...safeUser } = user;

    return { token };
  }
  async getUser(token: string): Promise<Omit<User, "passwordHash">> {
    const users = this.db.collection<User>("users");
    const credentials = await JWTService.payload(token);
    const id = credentials?.id;
    if (!id) {
      throw new UnauthorizedError("Invalid token.");
    }
    const user = await users.findOne({ _id: id });
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    return user;
  }
}

export default AuthService;
