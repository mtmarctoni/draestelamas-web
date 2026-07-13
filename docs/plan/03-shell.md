# 03 — Shell: SEO, Layout, Header, Footer, Pages (Tasks 9–13)

> Part of the [Astro Rebuild plan](00-overview.md). After this file the site builds with three empty-but-complete locale pages: correct `<html lang>`, SEO/hreflang, fixed nav with language switcher, footer with working privacy/legal modals.

---

### Task 9: SEO component

**Files:**
- Create: `src/components/SEO.astro`

**Interfaces:**
- Consumes: `locales`, `defaultLocale`, `localeHreflang`, `ogLocale`, `stripLocalePrefix`, `localizePath`, `getTranslations`, `Locale` from `../i18n`.
- Produces: `<SEO locale title description />` emitting title, meta description, canonical, 4 hreflang links, OpenGraph, Twitter card. Used only by `BaseLayout.astro`.

- [ ] **Step 1: Write `src/components/SEO.astro`**

```astro
---
import {
  defaultLocale,
  getTranslations,
  localeHreflang,
  localizePath,
  locales,
  ogLocale,
  stripLocalePrefix,
} from "../i18n";
import type { Locale } from "../i18n";

interface Props {
  locale: Locale;
  title: string;
  description: string;
}

const { locale, title, description } = Astro.props;
const t = getTranslations(locale);
const site = Astro.site!;
const basePath = stripLocalePrefix(Astro.url.pathname);
const urlFor = (loc: Locale) => new URL(localizePath(basePath, loc), site).href;
const ogImage = new URL("/og-image.jpg", site).href;
---

<title>{title}</title>
<meta name="description" content={description} />
<meta name="author" content="Dra. Estela Mas Ródenas" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href={urlFor(locale)} />

{locales.map((loc) => <link rel="alternate" hreflang={localeHreflang[loc]} href={urlFor(loc)} />)}
<link rel="alternate" hreflang="x-default" href={urlFor(defaultLocale)} />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="Dra. Estela Mas" />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:url" content={urlFor(locale)} />
<meta property="og:locale" content={ogLocale[locale]} />
{locales
  .filter((loc) => loc !== locale)
  .map((loc) => <meta property="og:locale:alternate" content={ogLocale[loc]} />)}
<meta property="og:image" content={ogImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="941" />
<meta property="og:image:alt" content={t.hero.imageAlt} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
```

- [ ] **Step 2: Type-check**

```bash
pnpm astro check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add SEO component with localized canonical, hreflang, and OpenGraph"
```

---

### Task 10: BaseLayout with fonts, JSON-LD, view transitions, and the global client script

**Files:**
- Create: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `SEO.astro` (Task 9), `Header.astro` + `Footer.astro` (Tasks 11–12 — created next; `astro check` passes only after Task 12), `getTranslations`, `global.css`.
- Produces: `<BaseLayout locale [title] [description]><slot /></BaseLayout>`. `title`/`description` default to `t.meta.*` (blog post pages override them). Emits the site-wide client script (nav scroll state, hamburger, fade-up observer, ECG scroll drive, legacy `?lang=` redirect).

- [ ] **Step 1: Write `src/layouts/BaseLayout.astro`**

```astro
---
import { Font } from "astro:assets";
import SEO from "../components/SEO.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import { getTranslations } from "../i18n";
import type { Locale } from "../i18n";
import "../styles/global.css";

interface Props {
  locale: Locale;
  title?: string;
  description?: string;
}

const { locale } = Astro.props;
const t = getTranslations(locale);
const title = Astro.props.title ?? t.meta.title;
const description = Astro.props.description ?? t.meta.description;

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Physician",
  name: "Dra. Estela Mas Ródenas",
  medicalSpecialty: "Nephrology",
  description,
  url: Astro.site?.href,
  availableService: {
    "@type": "MedicalProcedure",
    name: "Consulta nefrològica online",
  },
  knowsLanguage: ["ca", "es", "en"],
});
---

<!doctype html>
<html lang={locale}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="view-transition" content="same-origin" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <Font cssVariable="--font-cormorant" preload />
    <Font cssVariable="--font-inter" preload />
    <SEO locale={locale} title={title} description={description} />
    <script type="application/ld+json" is:inline set:html={jsonLd} />
  </head>
  <body>
    <Header locale={locale} />
    <main><slot /></main>
    <Footer locale={locale} />
    <script>
      // Legacy URLs: the old site used /?lang=es|en — redirect them to the locale routes.
      const legacyLang = new URLSearchParams(location.search).get("lang");
      if ((legacyLang === "es" || legacyLang === "en") && location.pathname === "/") {
        location.replace(`/${legacyLang}/`);
      }

      // Fixed nav: shadow once scrolled.
      const nav = document.getElementById("main-nav");
      addEventListener("scroll", () => nav?.classList.toggle("scrolled", scrollY > 20), {
        passive: true,
      });

      // Mobile menu.
      const links = document.getElementById("nav-links");
      document.getElementById("hamburger")?.addEventListener("click", () => {
        links?.classList.toggle("open");
      });
      links?.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => links.classList.remove("open"));
      });

      // Entrance animation.
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12 }
      );
      document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

      // ECG divider: trace position driven by page scroll (guarded — divider exists from Task 14).
      const ecgLine = document.querySelector<HTMLElement>(".ecg-line");
      if (ecgLine && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const ECG_SPEED = 0.4; // px of trace movement per px scrolled
        let ticking = false;
        const update = () => {
          ecgLine.style.backgroundPositionX = `${-scrollY * ECG_SPEED}px`;
          ticking = false;
        };
        addEventListener(
          "scroll",
          () => {
            if (!ticking) {
              requestAnimationFrame(update);
              ticking = true;
            }
          },
          { passive: true }
        );
        update();
      }
    </script>
  </body>
</html>
```

> The `<script>` has no `is:inline` — Astro bundles it into an external file, which the CSP (`script-src 'self'`) allows. The JSON-LD block is `is:inline` but is a non-executable data block, unaffected by `script-src`.
>
> **Compatibility note:** if `import { Font } from "astro:assets"` fails on your Astro version, apply the fonts fallback documented in Task 2 Step 1.

- [ ] **Step 2: Continue to Task 11** — `astro check` cannot pass yet because `Header.astro`/`Footer.astro` do not exist. Commit lands at the end of Task 12.

---

### Task 11: Header and LanguageSwitcher

**Files:**
- Create: `src/components/Header.astro`, `src/components/LanguageSwitcher.astro`

**Interfaces:**
- Consumes: `getTranslations`, `homePath`, `stripLocalePrefix`, `localizePath`, `locales`, `Locale` from `../i18n`; `src/assets/img/logo.png`.
- Produces: fixed `<nav id="main-nav">` with ids `nav-links`, `hamburger` (used by BaseLayout's script). Anchor links target `{homePath(locale)}#section` so they work from any page. `<LanguageSwitcher locale />` renders links to the same path in the other locales.

- [ ] **Step 1: Write `src/components/LanguageSwitcher.astro`**

```astro
---
import { localizePath, locales, stripLocalePrefix } from "../i18n";
import type { Locale } from "../i18n";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const basePath = stripLocalePrefix(Astro.url.pathname);

// Inline flag SVGs copied from the source site (senyera, rojigualda, union jack).
const flags: Record<Locale, string> = {
  ca: "<svg width='16' height='11' viewBox='0 0 16 11' aria-hidden='true'><rect width='16' height='11' fill='#FCDD09'/><rect y='0' width='16' height='1.57' fill='#C60B1E'/><rect y='3.14' width='16' height='1.57' fill='#C60B1E'/><rect y='6.29' width='16' height='1.57' fill='#C60B1E'/><rect y='9.43' width='16' height='1.57' fill='#C60B1E'/></svg>",
  es: "<svg width='16' height='11' viewBox='0 0 16 11' aria-hidden='true'><rect width='16' height='11' fill='#c60b1e'/><rect y='2.75' width='16' height='5.5' fill='#f1bf00'/></svg>",
  en: "<svg width='16' height='11' viewBox='0 0 16 11' aria-hidden='true'><rect width='16' height='11' fill='#012169'/><path d='M0,0 L16,11 M16,0 L0,11' stroke='white' stroke-width='2.2'/><path d='M0,0 L16,11 M16,0 L0,11' stroke='#C8102E' stroke-width='1.2'/><path d='M8,0 V11 M0,5.5 H16' stroke='white' stroke-width='3'/><path d='M8,0 V11 M0,5.5 H16' stroke='#C8102E' stroke-width='1.8'/></svg>",
};

const labels: Record<Locale, string> = { ca: "CA", es: "ES", en: "EN" };
---

<li class="lang-switcher">
  {
    locales.map((loc) => (
      <a
        class:list={["lang-btn", { active: loc === locale }]}
        href={localizePath(basePath, loc)}
        aria-current={loc === locale ? "true" : undefined}
        lang={loc}
      >
        <Fragment set:html={flags[loc]} />
        {labels[loc]}
      </a>
    ))
  }
</li>

<style>
  .lang-switcher {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .lang-btn {
    font-size: 0.65rem;
    font-weight: 500;
    cursor: pointer;
    background: none;
    border: 1px solid var(--color-sand);
    padding: 0.26rem 0.5rem;
    border-radius: 2px;
    transition: all 0.2s;
    color: var(--color-muted);
    display: flex;
    align-items: center;
    gap: 0.22rem;
    line-height: 1;
  }
  .lang-btn:hover {
    border-color: var(--color-sky);
    color: var(--color-sky);
  }
  .lang-btn.active {
    border-color: var(--color-burnt);
    color: var(--color-burnt);
    background: rgba(181, 98, 42, 0.06);
  }
  .lang-btn :global(svg) {
    border-radius: 1px;
  }
</style>
```

- [ ] **Step 2: Write `src/components/Header.astro`**

```astro
---
import { Image } from "astro:assets";
import LanguageSwitcher from "./LanguageSwitcher.astro";
import { getTranslations, homePath } from "../i18n";
import type { Locale } from "../i18n";
import logo from "../assets/img/logo.png";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);
const home = homePath(locale);
---

<nav id="main-nav">
  <a class="nav-logo" href={home}>
    <Image src={logo} alt="" width={88} densities={[1, 2]} loading="eager" />
    <span class="nav-logo-text">
      Dra. Estela Mas
      <span class="nav-logo-sub">Nefrologia</span>
    </span>
  </a>
  <ul class="nav-links" id="nav-links">
    <li><a href={`${home}#inicio`}>{t.nav.homeLabel}</a></li>
    <li><a href={`${home}#sobre`}>{t.nav.aboutLabel}</a></li>
    <li>
      <a href={`${home}#cardiorenal`} class="nav-blog-link">
        {t.nav.blogLabel}<span class="nav-blog-pill">{t.nav.blogPill}</span>
      </a>
    </li>
    <li><a href={`${home}#digital`}>{t.nav.digitalLabel}</a></li>
    <li><a href={`${home}#galeria`}>{t.nav.galleryLabel}</a></li>
    <li><a href={`${home}#colaboracions`} set:html={t.nav.collaborationsHtml} /></li>
    <li><a href={`${home}#contacto`} class="nav-cta">{t.nav.contactLabel}</a></li>
    <LanguageSwitcher locale={locale} />
  </ul>
  <button class="hamburger" id="hamburger" aria-label="Menú" aria-controls="nav-links">
    <span></span><span></span><span></span>
  </button>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: var(--nav-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background: rgba(245, 242, 237, 0.96);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(43, 74, 106, 0.1);
    transition: box-shadow 0.3s;
  }
  nav.scrolled {
    box-shadow: 0 2px 24px rgba(43, 74, 106, 0.1);
  }
  .nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .nav-logo img {
    height: 44px;
    width: auto;
  }
  .nav-logo-text {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--color-navy);
    line-height: 1.1;
    letter-spacing: 0.01em;
  }
  .nav-logo-sub {
    font-family: var(--font-body);
    font-weight: 300;
    font-size: 0.68rem;
    color: var(--color-burnt);
    display: block;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 1px;
  }
  .nav-links {
    display: flex;
    gap: 1.25rem;
    list-style: none;
    align-items: center;
    margin: 0;
    padding: 0;
  }
  .nav-links li {
    display: flex;
    align-items: center;
  }
  .nav-links a {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--color-navy);
    padding: 0.25rem 0;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    display: inline-block;
  }
  .nav-links a:hover {
    border-bottom-color: var(--color-burnt);
    color: var(--color-burnt);
  }
  .nav-cta {
    background: var(--color-navy) !important;
    color: #fff !important;
    padding: 0.4rem 1rem !important;
    border-radius: 2px !important;
    border: none !important;
    transition: background 0.2s !important;
  }
  .nav-cta:hover {
    background: var(--color-burnt) !important;
  }
  .nav-blog-link {
    display: inline-flex !important;
    align-items: center;
    gap: 0.45rem;
  }
  .nav-blog-pill {
    background: var(--color-burnt);
    color: #fff;
    font-size: 0.54rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 600;
    padding: 0.18rem 0.5rem;
    border-radius: 20px;
    line-height: 1;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .nav-blog-link:hover .nav-blog-pill {
    background: var(--color-navy);
  }
  .hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px;
  }
  .hamburger span {
    width: 24px;
    height: 2px;
    background: var(--color-navy);
    transition: 0.3s;
  }
  @media (max-width: 960px) {
    .nav-links {
      display: none;
    }
    .hamburger {
      display: flex;
    }
    .nav-links.open {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      position: fixed;
      top: var(--nav-h);
      left: 0;
      right: 0;
      background: var(--color-ivory);
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--color-sand);
      gap: 1rem;
      z-index: 99;
    }
  }
</style>
```

- [ ] **Step 3: Continue to Task 12** (check/commit after Footer exists).

---

### Task 12: Footer with privacy/legal `<dialog>` modals

**Files:**
- Create: `src/components/Footer.astro`, `src/components/LegalModals.astro`

**Interfaces:**
- Consumes: `getTranslations`, `socialLinks`, `Locale` from `../i18n`; `src/assets/img/logo.png`.
- Produces: `<Footer locale />` (includes `<LegalModals locale />`). Modal ids: `modal-privacy`, `modal-legal`; trigger buttons carry `data-open-modal="<id>"`.

- [ ] **Step 1: Write `src/components/LegalModals.astro`**

```astro
---
import { getTranslations } from "../i18n";
import type { Locale } from "../i18n";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);
const modals = [
  { id: "modal-privacy", ...t.privacy },
  { id: "modal-legal", ...t.legal },
];
---

{
  modals.map((modal) => (
    <dialog class="modal" id={modal.id}>
      <div class="modal-box">
        <form method="dialog">
          <button class="modal-close" aria-label="Tancar">
            ×
          </button>
        </form>
        <h2>{modal.title}</h2>
        {modal.sections.map((section) => (
          <>
            <h3>{section.heading}</h3>
            <p set:html={section.bodyHtml} />
          </>
        ))}
        <p class="modal-date">{modal.updated}</p>
      </div>
    </dialog>
  ))
}

<script>
  document.querySelectorAll<HTMLElement>("[data-open-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const dialog = document.getElementById(trigger.dataset.openModal!) as HTMLDialogElement | null;
      dialog?.showModal();
    });
  });
  // Close on backdrop click (Escape is native <dialog> behavior).
  document.querySelectorAll<HTMLDialogElement>("dialog.modal").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
</script>

<style>
  .modal {
    margin: auto;
    border: none;
    padding: 0;
    background: transparent;
    max-width: min(680px, calc(100vw - 3rem));
    width: 100%;
  }
  .modal::backdrop {
    background: rgba(37, 40, 48, 0.6);
    backdrop-filter: blur(4px);
  }
  .modal-box {
    background: #fff;
    border-radius: 4px;
    max-height: 85vh;
    overflow-y: auto;
    padding: 3rem;
    position: relative;
  }
  .modal-close {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-muted);
    font-size: 1.4rem;
    line-height: 1;
    transition: color 0.2s;
  }
  .modal-close:hover {
    color: var(--color-burnt);
  }
  .modal-box h2 {
    font-family: var(--font-display);
    font-size: 1.8rem;
    font-weight: 300;
    color: var(--color-navy);
    margin-bottom: 1.5rem;
  }
  .modal-box h3 {
    font-family: var(--font-display);
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--color-navy);
    margin: 1.5rem 0 0.5rem;
  }
  .modal-box p {
    font-size: 0.88rem;
    color: var(--color-muted);
    line-height: 1.85;
    margin-bottom: 0.75rem;
    font-weight: 300;
  }
  .modal-box p :global(strong) {
    color: var(--color-navy);
    font-weight: 500;
  }
  .modal-date {
    font-size: 0.75rem;
    color: var(--color-muted);
    opacity: 0.6;
    margin-top: 2rem;
    border-top: 1px solid var(--color-sand);
    padding-top: 1rem;
  }
</style>
```

- [ ] **Step 2: Write `src/components/Footer.astro`**

```astro
---
import { Image } from "astro:assets";
import LegalModals from "./LegalModals.astro";
import { getTranslations, socialLinks } from "../i18n";
import type { Locale } from "../i18n";
import logo from "../assets/img/logo.png";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);
const year = new Date().getFullYear();
---

<footer>
  <div class="footer-logo">
    <Image src={logo} alt="" width={68} densities={[1, 2]} loading="lazy" />
    {t.footer.name}
  </div>
  <p>{t.footer.specialty}</p>
  <p class="footer-row">
    <a href={socialLinks.linkedin.href} target="_blank" rel="noopener">{socialLinks.linkedin.label}</a>
    &nbsp;·&nbsp;
    <a href={socialLinks.twitter.href} target="_blank" rel="noopener">{socialLinks.twitter.label}</a>
  </p>
  <p class="footer-row">
    <button type="button" class="footer-link" data-open-modal="modal-privacy">{t.footer.privacyLabel}</button>
    &nbsp;·&nbsp;
    <button type="button" class="footer-link" data-open-modal="modal-legal">{t.footer.legalLabel}</button>
  </p>
  <p class="footer-row">© {year} draestelamas.com</p>
</footer>

<LegalModals locale={locale} />

<style>
  footer {
    background: var(--color-ink);
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    padding: 2.5rem 2rem;
    font-size: 0.73rem;
  }
  .footer-logo {
    font-family: var(--font-display);
    font-size: 1.4rem;
    color: #fff;
    font-weight: 300;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }
  .footer-logo img {
    height: 34px;
    width: auto;
    opacity: 0.75;
    filter: brightness(0) invert(1);
  }
  footer a,
  .footer-link {
    color: var(--color-amber);
  }
  .footer-link {
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    padding: 0;
  }
  .footer-row {
    margin-top: 0.75rem;
  }
</style>
```

- [ ] **Step 3: Type-check (BaseLayout + Header + Footer now complete)**

```bash
pnpm astro check
```

Expected: 0 errors.

- [ ] **Step 4: Commit Tasks 10–12 together**

```bash
git add -A
git commit -m "feat: add BaseLayout, Header with language switcher, Footer with legal dialogs"
```

---

### Task 13: Locale pages and first full-build verification

**Files:**
- Create: `src/components/HomePage.astro`, `src/pages/es/index.astro`, `src/pages/en/index.astro`
- Modify: `src/pages/index.astro` (replace Task 1 placeholder)

**Interfaces:**
- Consumes: `BaseLayout` (Task 10).
- Produces: `<HomePage locale />` — the single shared home page body. **Tasks 14–24 each append their section component inside its `<BaseLayout>` in this exact final order:** `Hero`, `EcgDivider`, `About`, `Cardiorenal`, `DigitalHealth`, `Gallery`, `Collaborations`, `ContactForm`.

- [ ] **Step 1: Write `src/components/HomePage.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import type { Locale } from "../i18n";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
---

<BaseLayout locale={locale}>
  {/* Sections are appended here by Tasks 14-24 in this order:
      <Hero locale={locale} />
      <EcgDivider />
      <About locale={locale} />
      <Cardiorenal locale={locale} />
      <DigitalHealth locale={locale} />
      <Gallery locale={locale} />
      <Collaborations locale={locale} />
      <ContactForm locale={locale} /> */}
</BaseLayout>
```

- [ ] **Step 2: Replace `src/pages/index.astro`**

```astro
---
import HomePage from "../components/HomePage.astro";
---

<HomePage locale="ca" />
```

- [ ] **Step 3: Write `src/pages/es/index.astro`**

```astro
---
import HomePage from "../../components/HomePage.astro";
---

<HomePage locale="es" />
```

- [ ] **Step 4: Write `src/pages/en/index.astro`**

```astro
---
import HomePage from "../../components/HomePage.astro";
---

<HomePage locale="en" />
```

- [ ] **Step 5: Build and verify the shell**

```bash
pnpm astro check && pnpm build
grep -o 'hreflang' dist/index.html | wc -l
grep -o '<html lang="[a-z]*"' dist/index.html dist/es/index.html dist/en/index.html
grep -c 'rel="canonical" href="https://www.draestelamas.com/"' dist/index.html
grep -c 'Sobre jo' dist/index.html
grep -c 'Sobre mí' dist/es/index.html
grep -c 'About me' dist/en/index.html
grep -c 'application/ld+json' dist/index.html
ls dist/sitemap-index.xml
```

Expected output, in order: `4` (hreflang links) · `lang="ca"`, `lang="es"`, `lang="en"` · `1` · `1` · `1` · `1` · `1` · sitemap file listed.

- [ ] **Step 6: Verify no third-party scripts**

```bash
grep -rE '<script[^>]+src="http' dist/ | wc -l
```

Expected: `0`.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add three locale home pages sharing a HomePage shell"
```
