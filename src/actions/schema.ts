import { z } from "astro/zod";

/**
 * Contact form input. Field optionality mirrors the source site's form:
 * name + email required; surname + message optional.
 * `important_field` is the honeypot (LAYER 1): hidden from humans by CSS,
 * bots auto-fill it, and max(0) rejects any non-empty value before the
 * handler (and any external API call) runs.
 */
export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  surname: z.string().optional().default(""),
  email: z.email("Valid email is required"),
  message: z.string().optional().default(""),
  important_field: z.string().max(0).optional(),
  locale: z.enum(["ca", "es", "en"]).optional().default("ca"),
});
