import { ActionError, defineAction } from "astro:actions";
import { contactSchema } from "./schema";

export const server = {
  contact: defineAction({
    accept: "form",
    input: contactSchema,
    handler: async (input, ctx) => {
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
      //     secret: ctx.locals.runtime.env.TURNSTILE_SECRET_KEY ?? "",
      //     response: turnstileToken,
      //   }),
      // });
      // const turnstileData = (await turnstileRes.json()) as { success: boolean };
      // if (!turnstileData.success) {
      //   throw new ActionError({ code: "BAD_REQUEST", message: "Captcha verification failed." });
      // }
      // --- End Layer 3 ---

      // Cloudflare env access — NOT process.env. Optional chaining keeps the
      // error explicit when the platform proxy is absent locally.
      const apiKey = ctx.locals.cfContext?.env?.RESEND_API_KEY;

      if (!apiKey) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Email service not configured.",
        });
      }

      const subject = `Nova proposta de col·laboració — ${input.name} ${input.surname}`.trim();
      const text = [
        `Nom: ${input.name} ${input.surname}`.trim(),
        `Email: ${input.email}`,
        "",
        "Missatge:",
        input.message || "(sense missatge)",
      ].join("\n");

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "contact@draestelamas.com",
          to: "info@draestelamas.com",
          reply_to: input.email,
          subject,
          text,
        }),
      });

      if (!res.ok) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send email.",
        });
      }

      return { success: true };
    },
  }),
};
