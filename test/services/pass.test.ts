import { assertEquals, assertNotEquals } from "@std/assert";
import PasswordService from "services/pass.ts";

Deno.test("createPasswordHash generates a valid hash", async () => {
  const password = "securePassword123";
  const hash = await PasswordService.createPasswordHash(password);

  assertNotEquals(
    hash,
    password,
    "Hash should not equal the plain-text password"
  );
  assertEquals(
    hash.split(":").length,
    3,
    "Hash should have 3 parts: iterations, salt, and the hashed value"
  );
});

Deno.test("verifyPassword returns true for a correct password", async () => {
  const password = "correctPassword";
  const hash = await PasswordService.createPasswordHash(password);

  const isValid = await PasswordService.verifyPassword(password, hash);
  assertEquals(
    isValid,
    true,
    "verifyPassword should return true for the correct password"
  );
});

Deno.test(
  "verifyPassword returns false for an incorrect password",
  async () => {
    const password = "correctPassword";
    const hash = await PasswordService.createPasswordHash(password);

    const isValid = await PasswordService.verifyPassword("wrongPassword", hash);
    assertEquals(
      isValid,
      false,
      "verifyPassword should return false for an incorrect password"
    );
  }
);

Deno.test(
  "createPasswordHash generates different hashes for the same password due to unique salts",
  async () => {
    const password = "samePassword";
    const hash1 = await PasswordService.createPasswordHash(password);
    const hash2 = await PasswordService.createPasswordHash(password);

    assertNotEquals(hash1, hash2, "Hashes should differ due to unique salts");
  }
);

Deno.test("verifyPassword fails if the hash format is incorrect", async () => {
  const invalidHash = "invalid:hash:format";
  const password = "somePassword";

  const isValid = await PasswordService.verifyPassword(password, invalidHash);
  assertEquals(
    isValid,
    false,
    "verifyPassword should return false for an invalid hash format"
  );
});

Deno.test("verifyPassword returns false for empty password", async () => {
  const hash = await PasswordService.createPasswordHash("nonEmptyPassword");

  const isValid = await PasswordService.verifyPassword("", hash);
  assertEquals(
    isValid,
    false,
    "verifyPassword should return false for an empty password"
  );
});
