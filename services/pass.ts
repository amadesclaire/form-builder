import { crypto } from "@std/crypto";

const ITERATIONS = 100000;

const PasswordService = {
  generateSalt: async (length: number = 16): Promise<string> => {
    const randomBytes = await crypto.getRandomValues(new Uint8Array(length));
    return btoa(String.fromCharCode(...randomBytes));
  },
  hashPassword: async (
    password: string,
    salt: string,
    iterations: number = 100000
  ): Promise<string> => {
    const encoder = new TextEncoder();
    const keyMaterial = encoder.encode(password);
    const saltBytes = encoder.encode(salt);

    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: saltBytes,
        iterations,
      },
      await crypto.subtle.importKey(
        "raw",
        keyMaterial,
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
      ),
      { name: "HMAC", hash: "SHA-256", length: 256 },
      true,
      ["sign"]
    );

    const rawKey = await crypto.subtle.exportKey("raw", derivedKey);
    return btoa(String.fromCharCode(...new Uint8Array(rawKey)));
  },
  createPasswordHash: async (
    password: string,
    iterations: number = ITERATIONS
  ): Promise<string> => {
    const salt = await PasswordService.generateSalt();
    const hash = await PasswordService.hashPassword(password, salt, iterations);
    return `${iterations}:${salt}:${hash}`;
  },
  verifyPassword: async (
    password: string,
    storedHash: string
  ): Promise<boolean> => {
    try {
      const [iterations, salt, originalHash] = storedHash.split(":");
      if (!iterations || !salt || !originalHash) {
        return false;
      }
      const computedHash = await PasswordService.hashPassword(
        password,
        salt,
        parseInt(iterations, 10)
      );
      return computedHash === originalHash;
    } catch {
      return false;
    }
  },
};

export default PasswordService;
