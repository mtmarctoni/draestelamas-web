# 06 — Contact: Action, Spam Defense, Form (Tasks 22–24)

> Part of the [Astro Rebuild plan](00-overview.md). The form lives on the (fully static) home pages and calls the Astro Action from a client script — no page is SSR. Spam defense layers: **1** honeypot field validated by Zod (this file), **2** Cloudflare Bot Fight Mode (operational, `08-deploy.md`), **3** Turnstile hooks (present but commented out, enable later if spam appears).

---

### Task 22: Contact input schema (TDD)

**Files:**
- Create: `src/actions/schema.ts`
- Test: `tests/contact-schema.test.ts`

**Interfaces:**
- Produces: `contactSchema` (Zod object) with fields `name` (string, min 2), `surname` (string, optional → `""`), `email` (valid email), `message` (string, optional → `""`), `important_field` (honeypot: must be empty if present). Consumed by `src/actions/index.ts` (Task 23).

- [ ] **Step 1: Write the failing test `tests/contact-schema.test.ts`**

```ts
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

  it("accepts missing surname and message (optional per source form)", () => {
    const result = contactSchema.safeParse({ name: "Maria", email: "maria@example.com" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.surname).toBe("");
      expect(result.data.message).toBe("");
    }
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
```

- [ ] **Step 2: Run it to verify it fails**

```bash
pnpm test
```

Expected: FAIL — cannot resolve `../src/actions/schema`.

- [ ] **Step 3: Write `src/actions/schema.ts`**

```ts
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
  email: z.string().email("Valid email is required"),
  message: z.string().optional().default(""),
  important_field: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test
```

Expected: all `contactSchema` tests PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add contact schema with honeypot validation (TDD)"
```

---

### Task 23: Contact action (Resend + Turnstile hooks)

**Files:**
- Create: `src/actions/index.ts`

**Interfaces:**
- Consumes: `contactSchema` (Task 22), `ctx.locals.runtime.env.RESEND_API_KEY` (typed in Task 2).
- Produces: server action `actions.contact` (accept: `"form"`) returning `{ success: true }` or throwing `ActionError`. Client import path: `astro:actions`.

- [ ] **Step 1: Write `src/actions/index.ts`**

```ts
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
      const apiKey = ctx.locals.runtime?.env?.RESEND_API_KEY;

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
```

> `from: contact@draestelamas.com` requires the domain to be verified in Resend — an operational step in `08-deploy.md`, not a code concern.

- [ ] **Step 2: Type-check**

```bash
pnpm astro check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add contact action with Resend delivery and Turnstile hooks"
```

---

### Task 24: ContactForm component, client submission, integration test

**Files:**
- Create: `src/components/ContactForm.astro`
- Modify: `src/components/HomePage.astro`

**Interfaces:**
- Consumes: `actions.contact` (Task 23), `getTranslations`, `Locale`.
- Produces: `<ContactForm locale />` (`<section id="contacto">`). Localized runtime strings travel via `data-sending` / `data-submit` attributes; success/error boxes use `hidden` + `role="status"` / `role="alert"`.

- [ ] **Step 1: Write `src/components/ContactForm.astro`**

```astro
---
import { getTranslations } from "../i18n";
import type { Locale } from "../i18n";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);
---

<section id="contacto">
  <div class="section-inner contacto-inner">
    <h2 class="section-title fade-up">{t.contact.title}</h2>
    <div class="info-item fade-up">
      <div class="info-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      </div>
      <div>
        <div class="info-label">Email</div>
        <div class="info-val">{t.contact.email}</div>
      </div>
    </div>
    <div class="fade-up form-wrap">
      <p class="form-success" id="form-success" role="status" hidden>{t.contact.success}</p>
      <p class="form-error" id="form-error" role="alert" hidden>{t.contact.error}</p>
      <form
        class="contact-form"
        id="contact-form"
        data-sending={t.contact.sending}
        data-submit={t.contact.submit}
      >
        {/* LAYER 1: honeypot — visually removed, bots fill it, Zod rejects it. */}
        <div class="honeypot" aria-hidden="true">
          <label for="important_field">Do not fill this field</label>
          <input type="text" id="important_field" name="important_field" tabindex="-1" autocomplete="off" />
        </div>
        <div class="form-row">
          <div class="field">
            <label for="name">{t.contact.labels.name}</label>
            <input type="text" id="name" name="name" required minlength="2" autocomplete="given-name" />
          </div>
          <div class="field">
            <label for="surname">{t.contact.labels.surname}</label>
            <input type="text" id="surname" name="surname" autocomplete="family-name" />
          </div>
        </div>
        <div class="field">
          <label for="email">{t.contact.labels.email}</label>
          <input type="email" id="email" name="email" required autocomplete="email" />
        </div>
        <div class="field">
          <label for="message">{t.contact.labels.message}</label>
          <textarea id="message" name="message" rows="6"></textarea>
        </div>
        {/* LAYER 3: Cloudflare Turnstile (disabled by default). To enable, add the
            widget below, allow challenges.cloudflare.com in the CSP (already done),
            and uncomment the verification block in src/actions/index.ts:
        <div class="cf-turnstile" data-sitekey="YOUR_TURNSTILE_SITE_KEY"></div>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer is:inline></script>
        */}
        <p class="form-note">{t.contact.gdpr}</p>
        <button type="submit" class="btn btn-primary submit-btn" id="submit-btn">{t.contact.submit}</button>
      </form>
    </div>
  </div>
</section>

<script>
  import { actions } from "astro:actions";

  const form = document.getElementById("contact-form") as HTMLFormElement | null;
  const success = document.getElementById("form-success");
  const errorBox = document.getElementById("form-error");
  const submit = document.getElementById("submit-btn") as HTMLButtonElement | null;

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!submit) return;
    submit.disabled = true;
    submit.textContent = form.dataset.sending ?? "";
    errorBox?.setAttribute("hidden", "");

    const { error } = await actions.contact(new FormData(form));

    if (!error) {
      form.hidden = true;
      success?.removeAttribute("hidden");
    } else {
      errorBox?.removeAttribute("hidden");
      submit.disabled = false;
      submit.textContent = form.dataset.submit ?? "";
    }
  });
</script>

<style>
  #contacto {
    background: #fff;
  }
  .contacto-inner {
    max-width: 780px;
  }
  .info-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 2rem;
  }
  .info-icon {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    background: var(--color-sand);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .info-icon svg {
    width: 15px;
    height: 15px;
    stroke: var(--color-navy);
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
  }
  .info-label {
    font-size: 0.65rem;
    color: var(--color-burnt);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-weight: 500;
  }
  .info-val {
    font-size: 0.88rem;
    color: var(--color-ink);
    margin-top: 2px;
  }
  .form-wrap {
    transition-delay: 0.1s;
  }
  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .honeypot {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .field label {
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-muted);
    font-weight: 500;
  }
  .field input,
  .field textarea {
    font-family: var(--font-body);
    font-size: 0.87rem;
    color: var(--color-ink);
    background: var(--color-ivory);
    border: 1px solid rgba(43, 74, 106, 0.15);
    border-radius: 2px;
    padding: 0.62rem 0.82rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    resize: vertical;
  }
  .field input:focus,
  .field textarea:focus {
    border-color: var(--color-sky);
    box-shadow: 0 0 0 3px rgba(74, 123, 155, 0.1);
  }
  .field textarea {
    min-height: 140px;
  }
  .form-note {
    font-size: 0.69rem;
    color: var(--color-muted);
    line-height: 1.6;
  }
  .form-success {
    background: rgba(181, 98, 42, 0.08);
    border: 1px solid var(--color-burnt);
    border-radius: 4px;
    padding: 1.5rem;
    color: var(--color-burnt);
    font-size: 0.87rem;
    text-align: center;
  }
  .form-error {
    background: rgba(198, 11, 30, 0.06);
    border: 1px solid #c0392b;
    border-radius: 4px;
    padding: 1rem 1.5rem;
    color: #c0392b;
    font-size: 0.87rem;
    text-align: center;
    margin-bottom: 1rem;
  }
  .form-success[hidden],
  .form-error[hidden] {
    display: none;
  }
  .submit-btn {
    width: 100%;
    margin-top: 0.5rem;
  }
  @media (max-width: 960px) {
    .form-row {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Mount in `HomePage.astro`** — add `import ContactForm from "./ContactForm.astro";` and `<ContactForm locale={locale} />` after `<Collaborations locale={locale} />`. Final `HomePage.astro` state:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "./Hero.astro";
import EcgDivider from "./EcgDivider.astro";
import About from "./About.astro";
import Cardiorenal from "./Cardiorenal.astro";
import DigitalHealth from "./DigitalHealth.astro";
import Gallery from "./Gallery.astro";
import Collaborations from "./Collaborations.astro";
import ContactForm from "./ContactForm.astro";
import type { Locale } from "../i18n";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
---

<BaseLayout locale={locale}>
  <Hero locale={locale} />
  <EcgDivider />
  <About locale={locale} />
  <Cardiorenal locale={locale} />
  <DigitalHealth locale={locale} />
  <Gallery locale={locale} />
  <Collaborations locale={locale} />
  <ContactForm locale={locale} />
</BaseLayout>
```

- [ ] **Step 3: Static verification**

```bash
pnpm astro check && pnpm build
grep -c 'id="contact-form"' dist/index.html dist/es/index.html dist/en/index.html
grep -c 'name="important_field"' dist/index.html
grep -c "Missatge enviat" dist/index.html
grep -c "Mensaje enviado" dist/es/index.html
grep -c "Message sent" dist/en/index.html
```

Expected: form present once per locale page; honeypot present; localized success strings present (inside the hidden status boxes).

- [ ] **Step 4: Integration test the action against the dev server**

Terminal 1:

```bash
pnpm dev
```

Terminal 2 (adjust port if `pnpm dev` reports a different one):

```bash
# Honeypot filled -> Zod rejects -> HTTP 400
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:4321/_actions/contact \
  -H "Origin: http://localhost:4321" \
  -F name=Test -F surname=Bot -F email=test@example.com -F message="hello there" \
  -F important_field=spam

# Valid input, no RESEND_API_KEY configured -> handler throws -> HTTP 500
curl -s -X POST http://localhost:4321/_actions/contact \
  -H "Origin: http://localhost:4321" \
  -F name=Test -F surname=Human -F email=test@example.com -F message="hello there" \
  -F important_field=
```

Expected: first command prints `400`; second returns a JSON error containing `"Email service not configured."` with HTTP 500. Both prove routing, validation order (honeypot before handler), and env guarding. Stop the dev server afterwards.

> With a real key in `.dev.vars` (`RESEND_API_KEY=re_…`) the second call returns `{"data":{"success":true},...}` and delivers a real email — only do that if the user provides a key.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add contact form with client-side action submission and honeypot"
```
