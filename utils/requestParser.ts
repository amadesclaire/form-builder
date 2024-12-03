import { UnsupportedContentType } from "lib/errors.ts";

export type Client = "json" | "html";

export const clientIs = (req: Request): Client | undefined => {
  const contentType = req.headers.get("Content-Type");
  if (contentType?.includes("application/json")) {
    return "json";
  }
  if (contentType?.includes("text/html")) {
    return "html";
  }
  throw new UnsupportedContentType(contentType ?? "unknown");
};

export const parseRequestBody = async (
  req: Request
): Promise<Record<string, unknown>> => {
  const contentType = req.headers.get("Content-Type");

  if (contentType?.includes("application/json")) {
    return await req.json();
  }

  if (contentType?.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    return Object.fromEntries(new URLSearchParams(text));
  }

  throw new UnsupportedContentType(contentType ?? "unknown");
};
