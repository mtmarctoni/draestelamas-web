import { z } from "astro/zod";

/**
 * Contact form input. All text fields are required and trimmed; the client
 * mirrors these checks so validation feels instant. `important_field` is the
 * honeypot (LAYER 1): hidden from humans by CSS, bots auto-fill it, and
 * max(0) rejects any non-empty value before the handler (and any external
 * API call) runs.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  surname: z.string().trim().min(1, "Surname is required"),
  email: z.string().trim().pipe(z.email("Valid email is required")),
  message: z.string().trim().min(1, "Message is required"),
  important_field: z.string().max(0).optional(),
  locale: z.enum(["ca", "es", "en"]).optional().default("ca"),
});
