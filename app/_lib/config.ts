// Gateway URL for server-side fetches (route handlers, server components).
// The gateway is the single entry point for ALL backend requests from the UI.
// In Docker it's http://gateway:8080; in dev it's http://localhost:5000.
//
// This is resolved lazily (function, not a module-level constant) so that
// the throw-on-missing-env does not fire at build time — only at request time.
export function resolveGatewayUrl(): string {
  const url = process.env.API_URL;
  if (url) return url;
  if (process.env.NODE_ENV === "production") {
    throw new Error("API_URL environment variable must be set in production");
  }
  return "http://localhost:5000";
}

// Convenience accessor — call this at request/handler time, not at module top level.
export const getGatewayUrl = (): string => resolveGatewayUrl();

// Support UI external URL for the "Support" tab link.
export const SUPPORT_URL =
  process.env.NEXT_PUBLIC_SUPPORT_URL ?? "http://localhost:4200";

// Cookie names for the JWT access + refresh tokens.
export const ACCESS_TOKEN_COOKIE = "tsqr_at";
export const REFRESH_TOKEN_COOKIE = "tsqr_rt";

// Cookie options for httpOnly secure cookies.
export const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};