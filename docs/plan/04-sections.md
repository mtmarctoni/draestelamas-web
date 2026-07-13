# 04 — Page Sections (Tasks 14–18)

> Part of the [Astro Rebuild plan](00-overview.md). Each task: create the section component, mount it in `src/components/HomePage.astro` (all three locale pages update automatically), build, verify with greps, commit. Section order inside `<BaseLayout>` must end up exactly: `Hero`, `EcgDivider`, `About`, `Cardiorenal` (Task 20), `DigitalHealth`, `Gallery`, `Collaborations`, `ContactForm` (Task 24).

---

### Task 14: Hero and ECG divider

**Files:**
- Create: `src/components/Hero.astro`, `src/components/EcgDivider.astro`
- Modify: `src/components/HomePage.astro`

**Interfaces:**
- Consumes: `getTranslations`, `Locale` from `../i18n`; `src/assets/img/hero-obra.png`.
- Produces: `<Hero locale />` (`<section id="inicio">`), `<EcgDivider />` (no props; its `.ecg-line` is animated by BaseLayout's script).

- [ ] **Step 1: Write `src/components/Hero.astro`**

```astro
---
import { Image } from "astro:assets";
import { getTranslations } from "../i18n";
import type { Locale } from "../i18n";
import heroObra from "../assets/img/hero-obra.png";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);
---

<section id="inicio">
  <div class="hero-text fade-up">
    <p class="hero-eyebrow" set:html={t.hero.eyebrowHtml} />
    <h1 class="hero-title" set:html={t.hero.titleHtml} />
    <p class="hero-subtitle">{t.hero.subtitle}</p>
    <div class="hero-btns">
      <a href="#colaboracions" class="btn btn-online" set:html={t.hero.ctaCollaborationsHtml} />
      <a href="#contacto" class="btn btn-outline">{t.hero.ctaContact}</a>
    </div>
  </div>
  <div class="hero-visual">
    <div class="hero-blob"></div>
    <Image
      class="hero-image fade-up"
      src={heroObra}
      alt={t.hero.imageAlt}
      widths={[420, 840]}
      sizes="420px"
      loading="eager"
      fetchpriority="high"
    />
  </div>
</section>

<style>
  #inicio {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding-top: var(--nav-h);
    max-width: var(--max-w);
    margin: 0 auto;
    padding-left: 2rem;
    padding-right: 2rem;
    gap: 4rem;
  }
  .hero-text {
    padding: 4rem 0;
  }
  .hero-eyebrow {
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--color-sky);
    margin-bottom: 1rem;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(2.6rem, 4.5vw, 4rem);
    font-weight: 300;
    color: var(--color-navy);
    line-height: 1.1;
    margin-bottom: 1.25rem;
  }
  .hero-title :global(em) {
    font-style: italic;
    color: var(--color-burnt);
  }
  .hero-subtitle {
    font-size: 0.97rem;
    color: var(--color-muted);
    font-weight: 300;
    max-width: 460px;
    margin-bottom: 2rem;
    line-height: 1.85;
  }
  .hero-btns {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .hero-visual {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hero-blob {
    width: 400px;
    height: 400px;
    background: linear-gradient(135deg, var(--color-navy), var(--color-sky));
    border-radius: 60% 40% 55% 45% / 45% 55% 40% 60%;
    opacity: 0.08;
    position: absolute;
  }
  .hero-image {
    width: 100%;
    max-width: 420px;
    border-radius: 4px;
    box-shadow: 0 8px 48px rgba(43, 74, 106, 0.15);
    position: relative;
    z-index: 1;
    transition-delay: 0.2s;
  }
  @media (max-width: 960px) {
    #inicio {
      grid-template-columns: 1fr;
      gap: 1.25rem;
      min-height: auto;
      padding: calc(var(--nav-h) + 0.75rem) 1.5rem 3rem;
    }
    .hero-visual {
      display: none;
    }
    .hero-text {
      padding: 1rem 0 0;
    }
    .hero-title {
      font-size: clamp(2rem, 7vw, 2.6rem);
      margin-bottom: 1rem;
    }
    .hero-subtitle {
      margin-bottom: 1.25rem;
    }
    .hero-eyebrow {
      margin-bottom: 0.6rem;
    }
    .hero-btns {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.6rem;
    }
  }
</style>
```

- [ ] **Step 2: Write `src/components/EcgDivider.astro`** (the SVG data URI is copied byte-for-byte from the source CSS — do not reformat it)

```astro
{/* Full-bleed cardiac-monitor line. Repeating SVG tile; horizontal position is
    driven by page scroll in BaseLayout's script (only animates while scrolling). */}
<div class="ecg-wrap" aria-hidden="true">
  <div class="ecg-line"></div>
</div>

<style>
  .ecg-wrap {
    background: #fff;
    height: 128px;
    overflow: hidden;
  }
  .ecg-line {
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='150'%20height='44'%3E%3Cpath%20d='M0,22%20L10,22%20L20,7%20L28,38%20L38,3%20L48,41%20L56,22%20L150,22'%20fill='none'%20stroke='%23B5622A'%20stroke-width='1.6'%20stroke-linecap='round'%20stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: repeat-x;
    background-position: center center;
    background-size: 150px 44px;
  }
  @media (max-width: 960px) {
    .ecg-wrap {
      height: 96px;
    }
  }
</style>
```

- [ ] **Step 3: Mount in `src/components/HomePage.astro`**

Add to the frontmatter:

```ts
import Hero from "./Hero.astro";
import EcgDivider from "./EcgDivider.astro";
```

Add inside `<BaseLayout locale={locale}>` (before the placeholder comment):

```astro
  <Hero locale={locale} />
  <EcgDivider />
```

- [ ] **Step 4: Build and verify**

```bash
pnpm astro check && pnpm build
grep -c "obra d'art" dist/index.html
grep -c "obra de arte" dist/es/index.html
grep -c "work of art" dist/en/index.html
grep -c 'ecg-line' dist/index.html
grep -c 'fetchpriority="high"' dist/index.html
```

Expected: `1` `1` `1` `1` `1` (hero title present per locale, ECG divider and eager hero image in place).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Hero section and ECG divider"
```

---

### Task 15: About section

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/components/HomePage.astro`

**Interfaces:**
- Consumes: `getTranslations`, `socialLinks`, `Locale`; `src/assets/img/sobre-retrat.jpg`.
- Produces: `<About locale />` (`<section id="sobre">`).

- [ ] **Step 1: Write `src/components/About.astro`**

```astro
---
import { Image } from "astro:assets";
import { getTranslations, socialLinks } from "../i18n";
import type { Locale } from "../i18n";
import portrait from "../assets/img/sobre-retrat.jpg";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);
---

<section id="sobre">
  <div class="section-inner">
    <div class="sobre-grid">
      <div class="sobre-photo-wrap fade-up">
        <Image src={portrait} alt={t.about.portraitAlt} widths={[400, 800]} sizes="(max-width: 960px) 100vw, 400px" loading="lazy" />
        <div class="sobre-accent"></div>
      </div>
      <div class="fade-up sobre-content-wrap">
        <h2 class="section-title sobre-title" set:html={t.about.titleHtml} />
        <p class="section-label sobre-label">{t.about.label}</p>
        <div class="sobre-tags">
          {t.about.tags.map((tag) => <span class:list={["tag", { accent: tag.accent }]}>{tag.text}</span>)}
        </div>
        <div class="sobre-content">
          {t.about.bioHtml.map((paragraph) => <p set:html={paragraph} />)}
        </div>
        <div class="social-links">
          <a href={socialLinks.linkedin.href} target="_blank" rel="noopener" class="social-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            {socialLinks.linkedin.label}
          </a>
          <a href={socialLinks.twitter.href} target="_blank" rel="noopener" class="social-link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
            {socialLinks.twitter.label}
          </a>
        </div>
        <p class="section-label list-label">{t.about.trainingLabel}</p>
        <ul class="formacion-list">
          {t.about.training.map((item) => (
            <li><span class="formacion-bullet">·</span><span>{item}</span></li>
          ))}
        </ul>
        <p class="section-label list-label">{t.about.societiesLabel}</p>
        <ul class="formacion-list">
          {t.about.societies.map((item) => (
            <li><span class="formacion-bullet">·</span><span>{item}</span></li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</section>

<style>
  #sobre {
    background: #fff;
  }
  /* The ECG band sits directly above — remove the section's own top gap. */
  #sobre .section-inner {
    padding-top: 0;
  }
  .sobre-grid {
    display: grid;
    grid-template-columns: 1fr 1.6fr;
    gap: 4rem;
    align-items: start;
  }
  .sobre-photo-wrap {
    position: relative;
  }
  .sobre-photo-wrap img {
    width: 100%;
    border-radius: 4px;
    display: block;
  }
  .sobre-accent {
    position: absolute;
    bottom: -14px;
    right: -14px;
    width: 80px;
    height: 80px;
    background: var(--color-sand);
    border-radius: 2px;
    z-index: -1;
  }
  .sobre-content-wrap {
    transition-delay: 0.15s;
  }
  .sobre-title {
    margin-bottom: 0.4rem;
  }
  .sobre-label {
    margin-bottom: 1.5rem;
  }
  .sobre-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .tag {
    display: inline-block;
    font-size: 0.67rem;
    padding: 0.3rem 0.75rem;
    border-radius: 2px;
    background: var(--color-sand);
    color: var(--color-navy);
    font-weight: 500;
    letter-spacing: 0.03em;
  }
  .tag.accent {
    background: rgba(181, 98, 42, 0.1);
    color: var(--color-burnt);
  }
  .sobre-content p {
    color: var(--color-muted);
    margin-bottom: 1.25rem;
    font-weight: 300;
    font-size: 0.96rem;
    line-height: 1.85;
  }
  .sobre-content p :global(strong) {
    color: var(--color-navy);
    font-weight: 500;
  }
  .social-links {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.75rem;
    flex-wrap: wrap;
  }
  .social-link {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.73rem;
    color: var(--color-sky);
    border: 1px solid rgba(74, 123, 155, 0.3);
    padding: 0.35rem 0.85rem;
    border-radius: 2px;
    font-weight: 500;
    transition: all 0.2s;
  }
  .social-link:hover {
    background: var(--color-sky);
    color: #fff;
    border-color: var(--color-sky);
  }
  .list-label {
    margin-top: 1.5rem;
  }
  .formacion-list {
    list-style: none;
    margin: 1.5rem 0 0;
    padding: 0;
  }
  .formacion-list li {
    display: flex;
    gap: 1rem;
    padding: 0.65rem 0;
    border-bottom: 1px solid var(--color-sand);
    font-size: 0.84rem;
    color: var(--color-muted);
    align-items: baseline;
    line-height: 1.5;
  }
  .formacion-bullet {
    color: var(--color-burnt);
    font-size: 1rem;
    flex-shrink: 0;
    margin-top: 2px;
  }
  @media (max-width: 960px) {
    .sobre-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Mount in `HomePage.astro`** — add `import About from "./About.astro";` and `<About locale={locale} />` directly after `<EcgDivider />`.

- [ ] **Step 3: Build and verify**

```bash
pnpm astro check && pnpm build
grep -c "Mayo Clinic" dist/index.html dist/es/index.html dist/en/index.html
grep -o 'formacion-list' dist/index.html | wc -l
grep -c "Societat Balear de Nefrologia" dist/en/index.html
```

Expected: each home page contains `Mayo Clinic` once; `formacion-list` appears 2 times (training + societies); SBN present in EN.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add About section with bio, training, and societies"
```

---

### Task 16: Digital Health section

**Files:**
- Create: `src/components/DigitalHealth.astro`
- Modify: `src/components/HomePage.astro`

**Interfaces:**
- Consumes: `getTranslations`, `Locale`.
- Produces: `<DigitalHealth locale />` (`<section id="digital">`). The 6 SVG icons are paired **by index** with `t.digital.areas` — the dictionary order is load-bearing.

- [ ] **Step 1: Write `src/components/DigitalHealth.astro`**

```astro
---
import { getTranslations } from "../i18n";
import type { Locale } from "../i18n";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);

// Icons from the source site, index-paired with t.digital.areas.
const icons = [
  "<svg viewBox='0 0 24 24'><path d='M22 12h-4l-3 9L9 3l-3 9H2'/></svg>",
  "<svg viewBox='0 0 24 24'><path d='M3 12h4l3 8 4-16 3 8h4'/></svg>",
  "<svg viewBox='0 0 24 24'><path d='M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z'/></svg>",
  "<svg viewBox='0 0 24 24'><rect x='4' y='4' width='16' height='16' rx='2'/><path d='M9 9h6v6H9z'/><path d='M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3'/></svg>",
  "<svg viewBox='0 0 24 24'><path d='M9 11l3 3L22 4'/><path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'/></svg>",
  "<svg viewBox='0 0 24 24'><circle cx='12' cy='12' r='3'/><path d='M12 1v6M12 17v6M4.2 4.2l4.3 4.3M15.5 15.5l4.3 4.3M1 12h6M17 12h6M4.2 19.8l4.3-4.3M15.5 8.5l4.3-4.3'/></svg>",
];
const delays = [0, 0.05, 0.1, 0.05, 0.1, 0.15];
---

<section id="digital">
  <div class="section-inner">
    <h2 class="section-title fade-up" set:html={t.digital.titleHtml} />
    <p class="digital-intro fade-up">{t.digital.intro}</p>
    <p class="section-label areas-label fade-up">{t.digital.areasLabel}</p>
    <div class="digital-grid">
      {
        t.digital.areas.map((area, i) => (
          <div class="digital-card fade-up" style={`transition-delay:${delays[i]}s`}>
            <div class="digital-card-icon" set:html={icons[i]} />
            <p>{area}</p>
          </div>
        ))
      }
    </div>
  </div>
</section>

<style>
  #digital {
    background: var(--color-ivory);
  }
  .digital-intro {
    font-size: 0.97rem;
    color: var(--color-muted);
    font-weight: 300;
    line-height: 1.85;
    max-width: 720px;
    margin-bottom: 2.5rem;
  }
  .areas-label {
    margin-bottom: 0.5rem;
  }
  .digital-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
    margin-top: 2rem;
  }
  .digital-card {
    background: #fff;
    border-radius: 4px;
    padding: 1.5rem;
    border: 1px solid rgba(43, 74, 106, 0.07);
    display: flex;
    align-items: flex-start;
    gap: 0.85rem;
    transition: transform 0.25s, box-shadow 0.25s;
  }
  .digital-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px rgba(43, 74, 106, 0.08);
  }
  .digital-card-icon {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    background: linear-gradient(135deg, var(--color-sky), var(--color-navy));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .digital-card-icon :global(svg) {
    width: 17px;
    height: 17px;
    stroke: #fff;
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .digital-card p {
    font-size: 0.85rem;
    color: var(--color-ink);
    font-weight: 400;
    line-height: 1.5;
    margin: 0;
  }
  @media (max-width: 900px) {
    .digital-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Mount in `HomePage.astro`** — add `import DigitalHealth from "./DigitalHealth.astro";` and `<DigitalHealth locale={locale} />` directly after `<About locale={locale} />` (Task 20 later inserts `<Cardiorenal />` between them).

- [ ] **Step 3: Build and verify**

```bash
pnpm astro check && pnpm build
grep -o 'digital-card ' dist/index.html | wc -l
grep -c "Monitorització remota de pacients" dist/index.html
grep -c "Monitorización remota de pacientes" dist/es/index.html
grep -c "Remote patient monitoring" dist/en/index.html
```

Expected: `6` cards; each locale shows its first area string once.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Digital Health and AI section"
```

---

### Task 17: Gallery with lightbox

**Files:**
- Create: `src/components/Gallery.astro`
- Modify: `src/components/HomePage.astro`

**Interfaces:**
- Consumes: `getTranslations`, `Locale`; `src/assets/img/galeria-01..05.jpg` (grid), `src/assets/img/obra-01..05.jpg` (lightbox full-size); `Artwork.id` keys.
- Produces: `<Gallery locale />` (`<section id="galeria">`) with a `<dialog id="lightbox">` driven by its own script (click item to open, arrow keys / buttons to navigate, Escape / backdrop click to close).

- [ ] **Step 1: Write `src/components/Gallery.astro`**

```astro
---
import { Image, getImage } from "astro:assets";
import { getTranslations } from "../i18n";
import type { ArtworkId, Locale } from "../i18n";
import type { ImageMetadata } from "astro";
import galeria01 from "../assets/img/galeria-01.jpg";
import galeria02 from "../assets/img/galeria-02.jpg";
import galeria03 from "../assets/img/galeria-03.jpg";
import galeria04 from "../assets/img/galeria-04.jpg";
import galeria05 from "../assets/img/galeria-05.jpg";
import obra01 from "../assets/img/obra-01.jpg";
import obra02 from "../assets/img/obra-02.jpg";
import obra03 from "../assets/img/obra-03.jpg";
import obra04 from "../assets/img/obra-04.jpg";
import obra05 from "../assets/img/obra-05.jpg";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);

const thumbs: Record<ArtworkId, ImageMetadata> = {
  "obra-01": galeria01,
  "obra-02": galeria02,
  "obra-03": galeria03,
  "obra-04": galeria04,
  "obra-05": galeria05,
};
const fulls: Record<ArtworkId, ImageMetadata> = {
  "obra-01": obra01,
  "obra-02": obra02,
  "obra-03": obra03,
  "obra-04": obra04,
  "obra-05": obra05,
};

const items = await Promise.all(
  t.gallery.artworks.map(async (artwork) => ({
    ...artwork,
    thumb: thumbs[artwork.id],
    full: await getImage({ src: fulls[artwork.id], width: 1600, format: "webp" }),
  }))
);
---

<section id="galeria">
  <div class="section-inner">
    <h2 class="section-title fade-up" set:html={t.gallery.titleHtml} />
    <p class="galeria-intro fade-up">{t.gallery.intro}</p>
    <div class="galeria-grid">
      {
        items.map((item, i) => (
          <button
            type="button"
            class="galeria-item fade-up"
            style={`transition-delay:${i * 0.08}s`}
            data-lightbox-index={i}
            data-full={item.full.src}
            data-title={item.title}
            data-caption={`${item.description} · ${item.technique}`}
          >
            <Image
              class="galeria-img"
              src={item.thumb}
              alt={item.title}
              widths={[400, 800]}
              sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 350px"
              loading="lazy"
            />
            <span class="galeria-caption">
              <span class="galeria-title">{item.title}</span>
              <span class="galeria-medium">{item.medium}</span>
            </span>
          </button>
        ))
      }
    </div>
  </div>
</section>

<dialog id="lightbox" class="lightbox">
  <button type="button" class="lightbox-close" data-lightbox-close aria-label="Tancar">×</button>
  <button type="button" class="lightbox-prev" data-lightbox-dir="-1" aria-label="Anterior">‹</button>
  <div class="lightbox-inner">
    <img id="lightbox-img" src="" alt="" />
    <div class="lightbox-caption">
      <h4 id="lightbox-title"></h4>
      <p id="lightbox-desc"></p>
    </div>
  </div>
  <button type="button" class="lightbox-next" data-lightbox-dir="1" aria-label="Següent">›</button>
</dialog>

<script>
  const dialog = document.getElementById("lightbox") as HTMLDialogElement | null;
  const img = document.getElementById("lightbox-img") as HTMLImageElement | null;
  const title = document.getElementById("lightbox-title");
  const desc = document.getElementById("lightbox-desc");
  const items = [...document.querySelectorAll<HTMLElement>("[data-lightbox-index]")];
  let index = 0;

  function show(i: number) {
    index = (i + items.length) % items.length;
    const item = items[index];
    if (!img || !title || !desc || !item) return;
    img.src = item.dataset.full ?? "";
    img.alt = item.dataset.title ?? "";
    title.textContent = item.dataset.title ?? "";
    desc.textContent = item.dataset.caption ?? "";
  }

  items.forEach((item) => {
    item.addEventListener("click", () => {
      show(Number(item.dataset.lightboxIndex));
      dialog?.showModal();
    });
  });
  dialog?.querySelectorAll<HTMLElement>("[data-lightbox-dir]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      show(index + Number(button.dataset.lightboxDir));
    });
  });
  dialog?.querySelector("[data-lightbox-close]")?.addEventListener("click", () => dialog.close());
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") show(index + 1);
    if (event.key === "ArrowLeft") show(index - 1);
  });
</script>

<style>
  #galeria {
    background: #fff;
  }
  .galeria-intro {
    font-size: 0.95rem;
    color: var(--color-muted);
    font-weight: 300;
    line-height: 1.85;
    max-width: 700px;
    margin-bottom: 2.5rem;
  }
  .galeria-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  .galeria-item {
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(43, 74, 106, 0.07);
    transition: transform 0.25s, box-shadow 0.25s;
    cursor: zoom-in;
    background: #fff;
    padding: 0;
    text-align: left;
    font: inherit;
  }
  .galeria-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(43, 74, 106, 0.12);
  }
  .galeria-img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    display: block;
  }
  .galeria-caption {
    display: block;
    padding: 0.9rem 1rem;
    background: #fff;
  }
  .galeria-title {
    display: block;
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 400;
    color: var(--color-navy);
    margin-bottom: 0.15rem;
  }
  .galeria-medium {
    display: block;
    font-size: 0.7rem;
    color: var(--color-muted);
    font-weight: 300;
  }
  @media (max-width: 960px) {
    .galeria-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  @media (max-width: 600px) {
    .galeria-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ── Lightbox ── */
  .lightbox {
    margin: auto;
    border: none;
    background: transparent;
    padding: 1rem;
    max-width: 100vw;
    max-height: 100vh;
  }
  .lightbox::backdrop {
    background: rgba(37, 40, 48, 0.92);
    backdrop-filter: blur(6px);
  }
  .lightbox-inner {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  .lightbox-inner img {
    max-width: 90vw;
    max-height: 80vh;
    width: auto;
    object-fit: contain;
    border-radius: 3px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
  }
  .lightbox-caption {
    text-align: center;
  }
  .lightbox-caption h4 {
    font-family: var(--font-display);
    font-size: 1.2rem;
    font-weight: 400;
    color: #fff;
    margin-bottom: 0.25rem;
  }
  .lightbox-caption p {
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.55);
    font-weight: 300;
    font-style: italic;
  }
  .lightbox-close {
    position: fixed;
    top: 1.25rem;
    right: 1.5rem;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
    transition: color 0.2s;
    z-index: 1;
  }
  .lightbox-close:hover {
    color: var(--color-burnt);
  }
  .lightbox-prev,
  .lightbox-next {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem 0.9rem;
    border-radius: 2px;
    transition: all 0.2s;
    z-index: 1;
  }
  .lightbox-prev {
    left: 1rem;
  }
  .lightbox-next {
    right: 1rem;
  }
  .lightbox-prev:hover,
  .lightbox-next:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
  }
  @media (max-width: 600px) {
    .lightbox-prev,
    .lightbox-next {
      display: none;
    }
  }
</style>
```

- [ ] **Step 2: Mount in `HomePage.astro`** — add `import Gallery from "./Gallery.astro";` and `<Gallery locale={locale} />` directly after `<DigitalHealth locale={locale} />`.

- [ ] **Step 3: Build and verify**

```bash
pnpm astro check && pnpm build
grep -o 'data-lightbox-index' dist/index.html | wc -l
grep -o "The Blooming Glomerulus" dist/index.html | wc -l
grep -o "El riñón florito" dist/es/index.html | wc -l
grep -o 'data-full="[^"]*webp[^"]*"' dist/index.html | wc -l
```

Expected: `5` items; `3` occurrences of the Glomerulus title (caption + `data-title` + img alt); `3` occurrences of the preserved ES source typo; `5` full-size webp lightbox URLs.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Medical Humanism gallery with dialog lightbox"
```

---

### Task 18: Collaborations section

**Files:**
- Create: `src/components/Collaborations.astro`
- Modify: `src/components/HomePage.astro`

**Interfaces:**
- Consumes: `getTranslations`, `Locale`.
- Produces: `<Collaborations locale />` (`<section id="colaboracions">`, navy background).

- [ ] **Step 1: Write `src/components/Collaborations.astro`**

```astro
---
import { getTranslations } from "../i18n";
import type { Locale } from "../i18n";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);
const columns = [
  { title: t.collaborations.areasTitle, items: t.collaborations.areas, delay: 0 },
  { title: t.collaborations.entitiesTitle, items: t.collaborations.entities, delay: 0.1 },
];
---

<section id="colaboracions">
  <div class="section-inner">
    <h2 class="section-title colab-title fade-up" set:html={t.collaborations.titleHtml} />
    <p class="colab-highlight fade-up">{t.collaborations.highlight}</p>
    <div class="colab-cols">
      {
        columns.map((column) => (
          <div class="colab-col fade-up" style={`transition-delay:${column.delay}s`}>
            <h3>{column.title}</h3>
            <ul class="colab-list">
              {column.items.map((item) => (
                <li>{item}</li>
              ))}
            </ul>
          </div>
        ))
      }
    </div>
    <div class="colab-cta fade-up">
      <a href="#contacto" class="btn-online-lg">{t.collaborations.cta}</a>
    </div>
  </div>
</section>

<style>
  #colaboracions {
    background: var(--color-navy);
  }
  .colab-title {
    color: #fff;
    margin-bottom: 0.4rem;
  }
  .colab-highlight {
    font-size: 1.05rem;
    color: #fff;
    font-weight: 300;
    font-style: italic;
    font-family: var(--font-display);
    max-width: 720px;
    margin-bottom: 2.5rem;
  }
  .colab-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-top: 1rem;
  }
  .colab-col h3 {
    font-family: var(--font-display);
    font-size: 1.3rem;
    font-weight: 400;
    color: var(--color-amber);
    margin-bottom: 1.25rem;
  }
  .colab-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .colab-list li {
    display: flex;
    gap: 0.75rem;
    padding: 0.55rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.88rem;
    color: rgba(255, 255, 255, 0.75);
    font-weight: 300;
  }
  .colab-list li::before {
    content: "—";
    color: var(--color-amber);
    flex-shrink: 0;
  }
  .colab-cta {
    margin-top: 2.5rem;
  }
  @media (max-width: 900px) {
    .colab-cols {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }
</style>
```

- [ ] **Step 2: Mount in `HomePage.astro`** — add `import Collaborations from "./Collaborations.astro";` and `<Collaborations locale={locale} />` directly after `<Gallery locale={locale} />`. The frontmatter and body should now read (Cardiorenal and ContactForm still pending):

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "./Hero.astro";
import EcgDivider from "./EcgDivider.astro";
import About from "./About.astro";
import DigitalHealth from "./DigitalHealth.astro";
import Gallery from "./Gallery.astro";
import Collaborations from "./Collaborations.astro";
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
  <DigitalHealth locale={locale} />
  <Gallery locale={locale} />
  <Collaborations locale={locale} />
</BaseLayout>
```

- [ ] **Step 3: Build and verify**

```bash
pnpm astro check && pnpm build
grep -c "Enviar una proposta" dist/index.html
grep -c "Send a proposal" dist/en/index.html
grep -o "class='l-geminada'" dist/index.html | wc -l
grep -o "class='l-geminada'" dist/en/index.html | wc -l
```

Expected: `1` · `1` · `3` (nav + hero CTA + section title use the ela geminada span in Catalan) · `0` (EN has none). The class grep uses single quotes because `set:html` injects the dictionary HTML verbatim.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Collaborations section"
```
