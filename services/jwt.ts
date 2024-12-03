import { UnauthorizedError } from "lib/errors.ts";
import { getUnixTime } from "utils/getUnixTime.ts";
import { User } from "models/user.ts";

export type JWTPayload = {
  iss: string; // Issuer:
  sub: string; // Subject: User ID
  exp: number; // Expiration time (Unix timestamp)
  iat: number; // Issued at (Unix timestamp)
  email: string; // User email
  aud?: string; // Audience
  nbf?: number; // Not before (Unix timestamp)
  [key: string]: unknown; // Allow additional custom claims
};

export type JWTHeader = {
  alg: string; // Algorithm (e.g., "HS256")
  typ: string; // Type (e.g., "JWT")
  [key: string]: unknown; // Allow additional custom fields
};

export type JWT = {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
};

const JWTService = {
  handleErrors: (error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    } else {
      console.error("Unknown error");
      throw new Error("Unknown error");
    }
  },
  base64Encode: (obj: unknown): string => {
    const json = JSON.stringify(obj);
    const uint8Array = new TextEncoder().encode(json);
    const binaryString = String.fromCharCode(...uint8Array);
    return btoa(binaryString)
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  },
  hmacSha256: async (key: string, data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(key),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      encoder.encode(data)
    );
    const bytes = new Uint8Array(signature);
    const binary = Array.from(bytes)
      .map((b) => String.fromCharCode(b))
      .join("");
    return btoa(binary)
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  },
  create: async (user: User): Promise<string> => {
    if (!user._id) {
      throw new Error("User ID not found");
    }
    const header: JWTHeader = {
      alg: "HS256",
      typ: "JWT",
    };
    const payload: JWTPayload = {
      iss: user._id,
      sub: "",
      exp: getUnixTime() + 60 * 60, // 1 hour
      iat: getUnixTime(),
      email: user.email,
    };
    const secret = Deno.env.get("JWT_SECRET") ?? "secret";
    const headerBase64 = await JWTService.base64Encode(header);
    const payloadBase64 = await JWTService.base64Encode(payload);
    const signatureBase64 = await JWTService.hmacSha256(
      secret,
      `${headerBase64}.${payloadBase64}`
    );

    return `${headerBase64}.${payloadBase64}.${signatureBase64}`;
  },
  isFormatValid: (token: string): boolean => {
    const isValid = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(
      token
    );
    if (isValid) {
      return true;
    }
    throw new Error("Invalid token format");
  },
  payload: (token: string): JWTPayload => {
    try {
      JWTService.isFormatValid(token);

      const payloadBase64 = token.split(".")[1];
      const json = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(json) as JWTPayload;
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid token format") {
        throw error;
      }
      throw new Error("Failed to decode Base64 or parse payload");
    }
  },
  isExpired: (token: string): boolean => {
    try {
      JWTService.isFormatValid(token);
      const payload = JWTService.payload(token);
      if (!payload || !payload.exp) return true;
      const now = Math.floor(Date.now() / 1000);
      const skew = 300;
      return now >= payload.exp - skew;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new Error(`Failed to check JWT expiration: ${error.message}`);
      } else {
        throw new Error("Unknown error");
      }
    }
  },
  verify: async (token: string): Promise<boolean> => {
    try {
      const secret = Deno.env.get("JWT_SECRET") ?? "secret";
      JWTService.isFormatValid(token);
      const [headerBase64, payloadBase64, signatureBase64] = token.split(".");
      const data = `${headerBase64}.${payloadBase64}`;
      const calculatedSignature = await JWTService.hmacSha256(secret, data);
      return calculatedSignature === signatureBase64;
    } catch {
      return false;
    }
  },
};

export default JWTService;
