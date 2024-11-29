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

Deno.test("JWTService.createJwt generates a valid JWT", async () => {
  const token = await JWTService.createJwt(mockHeader, mockPayload, secret);
  const parts = token.split(".");
  assertEquals(
    parts.length,
    3,
    "JWT should have three parts separated by dots"
  );
});

Deno.test("JWTService.getJwtPayload extracts payload correctly", async () => {
  const token = await JWTService.createJwt(mockHeader, mockPayload, secret);
  const payload = JWTService.getJwtPayload(token);
  assertEquals(payload?.iss, mockPayload.iss, "Payload issuer should match");
  assertEquals(payload?.sub, mockPayload.sub, "Payload subject should match");
});

Deno.test(
  "JWTService.isJwtExpired returns false for valid tokens",
  async () => {
    const token = await JWTService.createJwt(mockHeader, mockPayload, secret);
    const isExpired = JWTService.isJwtExpired(token);
    assertEquals(isExpired, false, "Token should not be expired");
  }
);

Deno.test(
  "JWTService.isJwtExpired returns true for expired tokens",
  async () => {
    const expiredPayload = {
      ...mockPayload,
      exp: Math.floor(Date.now() / 1000) - 3600,
    };
    const token = await JWTService.createJwt(
      mockHeader,
      expiredPayload,
      secret
    );
    const isExpired = JWTService.isJwtExpired(token);
    assertEquals(isExpired, true, "Token should be expired");
  }
);

Deno.test("JWTService.isJwtValid returns true for valid JWT", async () => {
  const token = await JWTService.createJwt(mockHeader, mockPayload, secret);
  const isValid = await JWTService.isJwtValid(token, secret);
  assertEquals(isValid, true, "JWT should be valid");
});

Deno.test("JWTService.isJwtValid returns false for tampered JWT", async () => {
  const token = await JWTService.createJwt(mockHeader, mockPayload, secret);

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

  const isValid = await JWTService.isJwtValid(tamperedToken, secret);
  assertEquals(isValid, false, "Tampered JWT should not be valid");
});

Deno.test("JWTService.isTokenFormatValid throws for invalid formats", () => {
  const invalidToken = "invalid.token";
  assertThrows(
    () => JWTService.isTokenFormatValid(invalidToken),
    Error,
    "Invalid token format"
  );
});

Deno.test("JWTService.getJwtPayload throws error for malformed token", () => {
  const malformedToken = "invalid.token";
  assertThrows(
    () => JWTService.getJwtPayload(malformedToken),
    Error,
    "Invalid token format"
  );
});

Deno.test(
  "JWTService.getJwtPayload throws error for invalid Base64 payload",
  () => {
    const invalidBase64Token = "header.invalidPayload.signature";
    assertThrows(
      () => JWTService.getJwtPayload(invalidBase64Token),
      Error,
      "Failed to decode Base64 or parse payload"
    );
  }
);
