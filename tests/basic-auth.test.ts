import { describe, expect, it } from "vitest";
import { basicAuthGate } from "../src/lib/basic-auth";

function authHeader(user: string, pass: string): string {
  return `Basic ${btoa(`${user}:${pass}`)}`;
}

describe("basicAuthGate", () => {
  it("returns null when both env vars are absent (auth disabled)", () => {
    expect(basicAuthGate(undefined, undefined, null)).toBeNull();
  });

  it("returns null when AUTH_USER is set but AUTH_PASS is absent", () => {
    expect(basicAuthGate("admin", undefined, null)).toBeNull();
  });

  it("returns null when AUTH_PASS is set but AUTH_USER is absent", () => {
    expect(basicAuthGate(undefined, "secret", null)).toBeNull();
  });

  it("returns null when both env vars are empty strings", () => {
    expect(basicAuthGate("", "", null)).toBeNull();
  });

  it("returns 401 when auth is enabled but no Authorization header", () => {
    const res = basicAuthGate("admin", "secret", null);
    expect(res).not.toBeNull();
    expect(res?.status).toBe(401);
    expect(res?.headers.get("WWW-Authenticate")).toBe(
      'Basic realm="draestelamas", charset="UTF-8"',
    );
  });

  it("returns 401 for non-Basic Authorization header", () => {
    const res = basicAuthGate("admin", "secret", "Bearer token");
    expect(res?.status).toBe(401);
  });

  it("returns 401 for malformed base64 in Basic header", () => {
    const res = basicAuthGate("admin", "secret", "Basic !!!invalid");
    expect(res?.status).toBe(401);
  });

  it("returns 401 when decoded value has no colon separator", () => {
    const encoded = btoa("nocolon");
    const res = basicAuthGate("admin", "secret", `Basic ${encoded}`);
    expect(res?.status).toBe(401);
  });

  it("returns 401 for wrong credentials", () => {
    const res = basicAuthGate("admin", "secret", authHeader("wrong", "creds"));
    expect(res?.status).toBe(401);
  });

  it("returns null for correct credentials", () => {
    const res = basicAuthGate("admin", "secret", authHeader("admin", "secret"));
    expect(res).toBeNull();
  });

  it("uses the default realm", () => {
    const res = basicAuthGate("admin", "secret", null);
    expect(res?.headers.get("WWW-Authenticate")).toContain('realm="draestelamas"');
  });

  it("supports a custom realm", () => {
    const res = basicAuthGate("admin", "secret", null, "Custom");
    expect(res?.headers.get("WWW-Authenticate")).toContain('realm="Custom"');
  });

  it("sets Cache-Control: no-store on 401 responses", () => {
    const res = basicAuthGate("admin", "secret", null);
    expect(res?.headers.get("Cache-Control")).toBe("no-store");
  });

  it("returns 401 for empty Basic token", () => {
    const res = basicAuthGate("admin", "secret", "Basic ");
    expect(res?.status).toBe(401);
  });
});
