import { assertEquals, assertThrows } from "@std/assert";
import JWTService from "services/jwt.ts";

const mockHeader = {
  alg: "HS256",
  typ: "JWT",
};

const mockPayload = {
  iss: "test-issuer",
  sub: "test-subject",
  aud: "test-audience",
  exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour in the future
};

const secret = "super-secret-key";

Deno.test("JWTService.create generates a valid JWT", async () => {
  const token = await JWTService.create(mockHeader, mockPayload, secret);
  const parts = token.split(".");
  assertEquals(
    parts.length,
    3,
    "JWT should have three parts separated by dots"
  );
});

Deno.test("JWTService.payload extracts payload correctly", async () => {
  const token = await JWTService.create(mockHeader, mockPayload, secret);
  const payload = JWTService.payload(token);
  assertEquals(payload?.iss, mockPayload.iss, "Payload issuer should match");
  assertEquals(payload?.sub, mockPayload.sub, "Payload subject should match");
});

Deno.test("JWTService.isExpired returns false for valid tokens", async () => {
  const token = await JWTService.create(mockHeader, mockPayload, secret);
  const isExpired = JWTService.isExpired(token);
  assertEquals(isExpired, false, "Token should not be expired");
});

Deno.test("JWTService.isExpired returns true for expired tokens", async () => {
  const expiredPayload = {
    ...mockPayload,
    exp: Math.floor(Date.now() / 1000) - 3600,
  };
  const token = await JWTService.create(mockHeader, expiredPayload, secret);
  const isExpired = JWTService.isExpired(token);
  assertEquals(isExpired, true, "Token should be expired");
});

Deno.test("JWTService.verify returns true for valid JWT", async () => {
  const token = await JWTService.create(mockHeader, mockPayload, secret);
  const isValid = await JWTService.verify(token, secret);
  assertEquals(isValid, true, "JWT should be valid");
});

Deno.test("JWTService.verify returns false for tampered JWT", async () => {
  const token = await JWTService.create(mockHeader, mockPayload, secret);

  const [headerBase64, payloadBase64, signatureBase64] = token.split(".");
  const tamperedPayload = JSON.stringify({
    ...mockPayload,
    iss: "tampered-issuer",
  });
  const tamperedPayloadBase64 = btoa(tamperedPayload)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const tamperedToken = `${headerBase64}.${tamperedPayloadBase64}.${signatureBase64}`;

  const isValid = await JWTService.verify(tamperedToken, secret);
  assertEquals(isValid, false, "Tampered JWT should not be valid");
});

Deno.test("JWTService.isFormatValid throws for invalid formats", () => {
  const invalidToken = "invalid.token";
  assertThrows(
    () => JWTService.isFormatValid(invalidToken),
    Error,
    "Invalid token format"
  );
});

Deno.test("JWTService.payload throws error for malformed token", () => {
  const malformedToken = "invalid.token";
  assertThrows(
    () => JWTService.payload(malformedToken),
    Error,
    "Invalid token format"
  );
});

Deno.test("JWTService.payload throws error for invalid Base64 payload", () => {
  const invalidBase64Token = "header.invalidPayload.signature";
  assertThrows(
    () => JWTService.payload(invalidBase64Token),
    Error,
    "Failed to decode Base64 or parse payload"
  );
});
