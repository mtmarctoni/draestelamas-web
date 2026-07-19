import { describe, expect, it } from "vitest";
import { contactSchema } from "../src/actions/schema";

const valid = {
  name: "Maria",
  surname: "Serra",
  email: "maria@example.com",
  message: "Hola, m'agradaria proposar una col·laboració.",
  important_field: "",
};

describe("contactSchema", () => {
  it("accepts a fully valid submission", () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects missing surname", () => {
    const result = contactSchema.safeParse({
      name: "Maria",
      email: "maria@example.com",
      message: "Hola",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing message", () => {
    const result = contactSchema.safeParse({
      name: "Maria",
      surname: "Serra",
      email: "maria@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("trims whitespace-only surname/message to empty, then rejects", () => {
    const result = contactSchema.safeParse({ ...valid, surname: "   ", message: "   " });
    expect(result.success).toBe(false);
  });

  it("rejects a filled honeypot (Layer 1 spam defense)", () => {
    const result = contactSchema.safeParse({ ...valid, important_field: "http://spam.example" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a one-character name", () => {
    const result = contactSchema.safeParse({ ...valid, name: "M" });
    expect(result.success).toBe(false);
  });
});
