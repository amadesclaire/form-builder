// authController.ts
import PasswordService from "services/pass.ts";
import JWTService, { JWTHeader, JWTPayload } from "services/jwt.ts";
import { Client, clientIs, parseRequestBody } from "utils/requestParser.ts";
import { Database } from "@db/mongo";
import {
  ExistingEmailError,
  ExistingUsernameError,
  InvalidCredentialsError,
  ShortPassword,
  UnsupportedContentType,
} from "lib/errors.ts";
import AuthService from "services/auth.ts";
import { Cookie, setCookie } from "@std/http/cookie";
import { omitProperty } from "utils/omitProperty.ts";

type LoginRequest = {
  email: string;
  password: string;
};
type SignupRequest = {
  username: string;
  email: string;
  password: string;
};

export class AuthController {
  private db: Database;
  private authService: AuthService;
  constructor(db: Database, authService: AuthService) {
    this.db = db;
    this.authService = authService;
  }
  public async signupForm(): Promise<Response> {
    return new Response();
  }

  public async signup(req: Request): Promise<Response> {
    const responses = {
      unsupportedContentType: new Response("Unsupported Content-Type", {
        status: 415,
      }),
      existingUser: {
        json: new Response("User already exists", { status: 400 }),
        html: new Response(null, {
          status: 302,
          headers: { Location: "/signup?error=existingUser" },
        }),
      },
      success: {
        json: new Response("User registered successfully", { status: 201 }),
        html: new Response(null, {
          status: 302,
          headers: { Location: "/login" },
        }),
      },
      internalError: {
        json: new Response("Internal Server Error", { status: 500 }),
        html: new Response(null, {
          status: 302,
          headers: { Location: "/signup?error=internalServerError" },
        }),
      },
      existingUsername: {
        json: new Response("Username already taken", { status: 400 }),
        html: new Response(null, {
          status: 302,
          headers: { Location: "/signup?error=existingUsername" },
        }),
      },
      existingEmail: {
        json: new Response("Email already taken", { status: 400 }),
        html: new Response(null, {
          status: 302,
          headers: { Location: "/signup?error=existingEmail" },
        }),
      },
      shortPassword: {
        json: new Response("Password must be at least 16 characters long", {
          status: 400,
        }),
        html: new Response(null, {
          status: 302,
          headers: { Location: "/signup?error=shortPassword" },
        }),
      },
    };

    try {
      const client: Client | undefined = clientIs(req);

      if (!client) {
        return responses.unsupportedContentType;
      }
      const users = this.db.collection("users");

      // Parse the request body (handles JSON and x-www-form-urlencoded)
      const { username, email, password } = (await parseRequestBody(
        req
      )) as SignupRequest;

      // Hash the password
      const passwordHash = await PasswordService.createPasswordHash(password);
      const timestamp = new Date().toISOString();
      // Save the user to the database
      await users.insertOne({
        username,
        email,
        passwordHash,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      return responses.success[client];
    } catch (error) {
      console.error("Error during signup:", error);

      if (error instanceof ExistingEmailError) {
        return responses.existingEmail[client];
      }
      if (error instanceof ExistingUsernameError) {
        return responses.existingUsername[client];
      }
      if (error instanceof ShortPassword) {
        return responses.shortPassword[client];
      }
      if (error instanceof Error) {
        return responses.internalError[client];
      }
    }
  }

  public async login(req: Request): Promise<Response> {
    const responses = {
      unsupportedContentType: new Response("Unsupported Content-Type", {
        status: 415,
      }),
      invalidCredentials: {
        json: new Response("Invalid email or password", { status: 400 }),
        html: new Response(null, {
          status: 302,
          headers: { Location: "/login?error=invalidCredentials" },
        }),
      },
      success: {
        json: (token: string) => {
          const headers = new Headers();
          headers.set("Content-Type", "application/json");
          headers.set("status", "200");
          const cookie: Cookie = {
            name: "token",
            value: token,
            httpOnly: true,
          };
          setCookie(headers, cookie);
          return new Response(
            JSON.stringify({ message: "Login successful", token: token }),
            { headers }
          );
        },
        html: (token: string) => {
          const headers = new Headers();
          headers.set("Content-Type", "application/json");
          headers.set("status", "302");
          headers.set("location", "/dashboard");
          const cookie: Cookie = {
            name: "token",
            value: token,
            httpOnly: true,
          };
          setCookie(headers, cookie);
          return new Response(null, {
            headers,
          });
        },
      },
      error: {
        json: new Response("Internal Server Error", { status: 500 }),
        html: new Response(null, {
          status: 302,
          headers: { Location: "/login?error=internalServerError" },
        }),
      },
    };
    try {
      const client: Client | undefined = clientIs(req);
      if (!client) {
        return responses.unsupportedContentType;
      }
      // Parse the request body
      const { email, password } = (await parseRequestBody(req)) as LoginRequest;
      // TODO Validate

      const { token } = await this.authService.loginUser(email, password);

      return responses.success?.[client](token);
    } catch (error) {
      // if error is invalid credentials
      if (error instanceof InvalidCredentialsError) {
        return responses.invalidCredentials[client];
      }
      console.error("Error during login:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  public async logout(): Promise<Response> {
    try {
    } catch (error) {
      console.error("Error during logout:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }

  public async me(req: Request): Promise<Response> {
    try {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response("Unauthorized", { status: 401 });
      }

      const token = authHeader.substring(7); // Remove "Bearer "

      // Verify the token
      const isValid = await JWTService.verify(token);
      if (!isValid) {
        return new Response("Invalid token", { status: 401 });
      }

      const payload = JWTService.payload(token);
      const users = this.db.collection("users");
      const user = await users.findOne({ _id: payload?.userId });

      if (!user) {
        return new Response("User not found", { status: 404 });
      }

      return new Response(
        JSON.stringify({
          id: user._id,
          username: user.username,
          email: user.email,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
}

export default AuthController;
