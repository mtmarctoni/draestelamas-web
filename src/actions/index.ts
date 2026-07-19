import { ActionError, defineAction } from "astro:actions";
import { env } from "cloudflare:workers";
import { contactSchema } from "./schema";

export const server = {
  contact: defineAction({
    accept: "form",
    input: contactSchema,
    handler: async (input) => {
      // LAYER 1 (honeypot) has already run: Zod rejected any submission with
      // a filled important_field before this handler was invoked.

      // --- LAYER 3: Cloudflare Turnstile verification (disabled by default) ---
      // To enable: add `"cf-turnstile-response": z.string().optional()` to the
      // schema, render the Turnstile widget in ContactForm.astro (see the
      // commented block there), set TURNSTILE_SECRET_KEY, then uncomment:
      //
      // const turnstileToken = (input as Record<string, unknown>)["cf-turnstile-response"];
      // if (typeof turnstileToken !== "string" || turnstileToken.length === 0) {
      //   throw new ActionError({ code: "BAD_REQUEST", message: "Captcha verification required." });
      // }
      // const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
      //   body: new URLSearchParams({
      //     secret: env.TURNSTILE_SECRET_KEY ?? "",
      //     response: turnstileToken,
      //   }),
      // });
      // const turnstileData = (await turnstileRes.json()) as { success: boolean };
      // if (!turnstileData.success) {
      //   throw new ActionError({ code: "BAD_REQUEST", message: "Captcha verification failed." });
      // }
      // --- End Layer 3 ---

      // Cloudflare env access — NOT process.env and NOT locals (Astro v6
      // removed locals.runtime.env; locals.cfContext is only the ExecutionContext).
      const apiKey = env.RESEND_API_KEY;

      if (!apiKey) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Email service not configured.",
        });
      }

      const labels = {
        ca: {
          subject: `Nova proposta de col·laboració — ${input.name} ${input.surname}`,
          name: "Nom",
          email: "Email",
          message: "Missatge",
        },
        es: {
          subject: `Nueva propuesta de colaboración — ${input.name} ${input.surname}`,
          name: "Nombre",
          email: "Email",
          message: "Mensaje",
        },
        en: {
          subject: `New collaboration enquiry — ${input.name} ${input.surname}`,
          name: "Name",
          email: "Email",
          message: "Message",
        },
      };
      const l = labels[input.locale] ?? labels.ca;
      const subject = l.subject;
      const text = [
        `${l.name}: ${input.name} ${input.surname}`.trim(),
        `${l.email}: ${input.email}`,
        "",
        `${l.message}:`,
        input.message,
      ].join("\n");

      const from = env.RESEND_FROM || "contact@marctonimas.com";
      const to = env.RESEND_TO || "info@marctonimas.com";

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          reply_to: input.email,
          subject,
          text,
        }),
      });

      if (!res.ok) {
        // Log the upstream detail to Workers Logs (observability is enabled) for
        // debugging; return a generic message so we never leak Resend internals
        // to the client. The form shows its own localized error text regardless.
        const detail = await res.text();
        console.error(`Resend send failed: ${res.status} ${detail}`);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send email.",
        });
      }

      return { success: true };
    },
  }),
};
