# 05 — Blog: Content Collection, Section, Post Pages (Tasks 19–21)

> Part of the [Astro Rebuild plan](00-overview.md). The live site loads `/content/blog-posts.json` and renders Markdown client-side with marked.js from a CDN — the CSP forbids that. Here the blog becomes a build-time content collection: same copy, zero JS, real URLs (`/blog/[slug]/`, `/es/blog/[slug]/`, `/en/blog/[slug]/`). Post files were pre-extracted to `docs/plan/source-snapshot/blog/{ca,es,en}/`.

Current post inventory (1 post, trilingual):

| Locale | Title | Category |
|--------|-------|----------|
| ca | El futur de la nefrologia: cuidar els ronyons abans que emmalalteixin | Salut renal |
| es | El futuro de la nefrología: cuidar los riñones antes de que enfermen | Salud renal |
| en | The Future of Nephrology: Protecting Kidney Health Before Disease Develops | Kidney Health |

Slug (all locales): `salud-renal-prevencion-enfermedad-renal` · Date: `2026-07-12T11:00:00.000+02:00` · Image: `imageprimeraentradaweb.jpg`.

**Adding future posts:** drop a Markdown file with the same frontmatter shape into all three of `src/content/blog/{ca,es,en}/` using an identical filename (the filename is the slug, shared across locales so the language switcher stays on the same article).

---

### Task 19: Content collection config and post files

**Files:**
- Create: `src/content.config.ts`, `src/content/blog/{ca,es,en}/salud-renal-prevencion-enfermedad-renal.md` (copied from snapshot)

**Interfaces:**
- Produces: collection `blog` with entry ids `ca/salud-renal-prevencion-enfermedad-renal`, `es/…`, `en/…`; schema `{ title: string; summary: string; category: string; date: Date; image?: ImageMetadata }`. Consumed via `getCollection("blog", (entry) => entry.id.startsWith("<locale>/"))`.

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: z.string(),
      date: z.coerce.date(),
      image: image().optional(),
    }),
});

export const collections = { blog };
```

- [ ] **Step 2: Copy the post files from the snapshot and relativize the image path**

The snapshot frontmatter references the image by public URL; the `image()` schema helper needs a path relative to each Markdown file (`src/content/blog/<locale>/x.md` → `src/assets/uploads/` is three levels up).

```bash
mkdir -p src/content/blog
cp -R docs/plan/source-snapshot/blog/. src/content/blog/
sed -i '' 's|image: "/assets/uploads/|image: "../../../assets/uploads/|' src/content/blog/*/*.md
```

(On Linux/GNU sed drop the `''` after `-i`.)

- [ ] **Step 3: Verify**

```bash
ls src/content/blog/ca src/content/blog/es src/content/blog/en
grep -c 'image: "../../../assets/uploads/imageprimeraentradaweb.jpg"' src/content/blog/*/*.md
pnpm astro check
```

Expected: one `.md` per locale directory; the image-path grep prints `1` for each of the three files; `astro check` passes with 0 errors (collection types generate cleanly).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add blog content collection with trilingual source post"
```

---

### Task 20: Cardiorenal blog section

**Files:**
- Create: `src/components/Cardiorenal.astro`
- Modify: `src/components/HomePage.astro`

**Interfaces:**
- Consumes: collection `blog` (Task 19), `getTranslations`, `localizePath`, `Locale`.
- Produces: `<Cardiorenal locale />` (`<section id="cardiorenal">`) — blog card grid sorted newest-first, each card linking to the localized post URL.

- [ ] **Step 1: Write `src/components/Cardiorenal.astro`**

```astro
---
import { Image } from "astro:assets";
import { getCollection } from "astro:content";
import { getTranslations, localizePath } from "../i18n";
import type { Locale } from "../i18n";

interface Props {
  locale: Locale;
}

const { locale } = Astro.props;
const t = getTranslations(locale);
const posts = (await getCollection("blog", (entry) => entry.id.startsWith(`${locale}/`))).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);
const postUrl = (id: string) => localizePath(`/blog/${id.split("/")[1]}/`, locale);
---

<section id="cardiorenal">
  <div class="section-inner">
    <p class="section-label blog-eyebrow fade-up">{t.blog.eyebrow}</p>
    <h2 class="section-title fade-up" set:html={t.blog.titleHtml} />
    <div class="blog-grid">
      {
        posts.map((post, i) => (
          <a class="blog-card fade-up" href={postUrl(post.id)} style={`transition-delay:${(i % 4) * 0.04}s`}>
            <div class:list={["blog-img", { warm: i % 2 === 1 }]}>
              {post.data.image ? (
                <Image
                  src={post.data.image}
                  alt=""
                  widths={[600, 1200]}
                  sizes="(max-width: 960px) 100vw, 520px"
                  loading="lazy"
                />
              ) : (
                "◆"
              )}
            </div>
            <div class="blog-body">
              <p class="blog-cat">{post.data.category}</p>
              <h3>{post.data.title}</h3>
              <p>{post.data.summary}</p>
            </div>
          </a>
        ))
      }
    </div>
  </div>
</section>

<style>
  #cardiorenal {
    background: var(--color-ivory);
  }
  .blog-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    border: 1px solid rgba(181, 98, 42, 0.35);
    border-radius: 20px;
    padding: 0.35rem 0.9rem;
    margin-bottom: 1.25rem;
  }
  .blog-eyebrow::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-burnt);
    flex-shrink: 0;
  }
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin-top: 2rem;
  }
  .blog-card {
    background: #fff;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(43, 74, 106, 0.07);
    transition: box-shadow 0.25s;
    cursor: pointer;
  }
  .blog-card:hover {
    box-shadow: 0 8px 32px rgba(43, 74, 106, 0.1);
  }
  .blog-img {
    aspect-ratio: 12 / 5;
    background: linear-gradient(135deg, var(--color-navy), var(--color-sky));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.2);
  }
  .blog-img.warm {
    background: linear-gradient(135deg, var(--color-burnt), var(--color-amber));
  }
  .blog-img :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .blog-body {
    padding: 1.4rem;
  }
  .blog-cat {
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-burnt);
    font-weight: 500;
    margin-bottom: 0.4rem;
  }
  .blog-card h3 {
    font-family: var(--font-display);
    font-size: 1.18rem;
    font-weight: 400;
    color: var(--color-navy);
    margin-bottom: 0.4rem;
    line-height: 1.25;
  }
  .blog-card .blog-body p:last-child {
    font-size: 0.81rem;
    color: var(--color-muted);
    font-weight: 300;
  }
  @media (max-width: 960px) {
    .blog-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 2: Mount in `HomePage.astro`** — add `import Cardiorenal from "./Cardiorenal.astro";` and insert `<Cardiorenal locale={locale} />` **between** `<About locale={locale} />` and `<DigitalHealth locale={locale} />` (matching the source page order).

- [ ] **Step 3: Build and verify**

```bash
pnpm astro check && pnpm build
grep -c "El futur de la nefrologia" dist/index.html
grep -c "El futuro de la nefrología" dist/es/index.html
grep -c "The Future of Nephrology" dist/en/index.html
grep -c 'href="/blog/salud-renal-prevencion-enfermedad-renal/"' dist/index.html
grep -c 'href="/en/blog/salud-renal-prevencion-enfermedad-renal/"' dist/en/index.html
```

Expected: `1` for every command — each locale home shows its post card linking to its localized post URL.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Cardiorenal blog section with localized post cards"
```

---

### Task 21: Blog post pages (three locale routes)

**Files:**
- Create: `src/components/BlogPostArticle.astro`, `src/pages/blog/[slug].astro`, `src/pages/es/blog/[slug].astro`, `src/pages/en/blog/[slug].astro`

**Interfaces:**
- Consumes: `BaseLayout`, collection `blog`, `getTranslations`, `dateLocale`, `homePath`, `CollectionEntry<"blog">`.
- Produces: static routes `/blog/[slug]/`, `/es/blog/[slug]/`, `/en/blog/[slug]/`. `<BlogPostArticle locale post />` renders the article body.

- [ ] **Step 1: Write `src/components/BlogPostArticle.astro`**

```astro
---
import { Image } from "astro:assets";
import { render } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { dateLocale, getTranslations, homePath } from "../i18n";
import type { Locale } from "../i18n";

interface Props {
  locale: Locale;
  post: CollectionEntry<"blog">;
}

const { locale, post } = Astro.props;
const t = getTranslations(locale);
const { Content } = await render(post);
const formattedDate = new Intl.DateTimeFormat(dateLocale[locale], {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(post.data.date);
---

<article class="post">
  <div class="section-inner post-inner">
    <a class="post-back" href={`${homePath(locale)}#cardiorenal`}>{t.blog.back}</a>
    <p class="blog-cat">{post.data.category}</p>
    <h1 class="section-title">{post.data.title}</h1>
    {
      post.data.image && (
        <Image
          class="post-image"
          src={post.data.image}
          alt={post.data.title}
          widths={[700, 1400]}
          sizes="(max-width: 960px) 100vw, 716px"
          loading="eager"
          fetchpriority="high"
        />
      )
    }
    <div class="post-body">
      <Content />
    </div>
    <p class="post-date">{formattedDate}</p>
  </div>
</article>

<style>
  .post {
    padding-top: var(--nav-h);
    background: #fff;
  }
  .post-inner {
    max-width: 780px;
  }
  .post-back {
    display: inline-block;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--color-sky);
    margin-bottom: 2rem;
    transition: color 0.2s;
  }
  .post-back:hover {
    color: var(--color-burnt);
  }
  .blog-cat {
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-burnt);
    font-weight: 500;
    margin-bottom: 0.4rem;
  }
  .post-image {
    width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 1rem 0 2rem;
  }
  .post-body :global(p) {
    font-size: 0.9rem;
    color: var(--color-ink);
    line-height: 1.85;
    font-weight: 300;
    margin-bottom: 1rem;
  }
  .post-body :global(strong) {
    font-weight: 600;
    color: var(--color-navy);
  }
  .post-body :global(em) {
    font-style: italic;
  }
  .post-body :global(ul),
  .post-body :global(ol) {
    margin: 0 0 1rem 1.25rem;
  }
  .post-body :global(li) {
    font-size: 0.9rem;
    color: var(--color-ink);
    line-height: 1.85;
    font-weight: 300;
    margin-bottom: 0.35rem;
  }
  .post-body :global(h1),
  .post-body :global(h2),
  .post-body :global(h3) {
    font-family: var(--font-display);
    font-weight: 400;
    color: var(--color-navy);
    margin: 1.25rem 0 0.6rem;
  }
  .post-body :global(a) {
    color: var(--color-sky);
    text-decoration: underline;
  }
  .post-body :global(img) {
    border-radius: 4px;
    margin: 1rem 0;
  }
  .post-date {
    font-size: 0.75rem;
    color: var(--color-muted);
    opacity: 0.6;
    margin-top: 2rem;
    border-top: 1px solid var(--color-sand);
    padding-top: 1rem;
  }
</style>
```

- [ ] **Step 2: Write `src/pages/blog/[slug].astro`** (Catalan, root)

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import BlogPostArticle from "../../components/BlogPostArticle.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog", (entry) => entry.id.startsWith("ca/"));
  return posts.map((post) => ({
    params: { slug: post.id.split("/")[1] },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<BaseLayout
  locale="ca"
  title={`${post.data.title} | Dra. Estela Mas`}
  description={post.data.summary.split("\n")[0]}
>
  <BlogPostArticle locale="ca" post={post} />
</BaseLayout>
```

- [ ] **Step 3: Write `src/pages/es/blog/[slug].astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../../layouts/BaseLayout.astro";
import BlogPostArticle from "../../../components/BlogPostArticle.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog", (entry) => entry.id.startsWith("es/"));
  return posts.map((post) => ({
    params: { slug: post.id.split("/")[1] },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<BaseLayout
  locale="es"
  title={`${post.data.title} | Dra. Estela Mas`}
  description={post.data.summary.split("\n")[0]}
>
  <BlogPostArticle locale="es" post={post} />
</BaseLayout>
```

- [ ] **Step 4: Write `src/pages/en/blog/[slug].astro`**

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../../layouts/BaseLayout.astro";
import BlogPostArticle from "../../../components/BlogPostArticle.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog", (entry) => entry.id.startsWith("en/"));
  return posts.map((post) => ({
    params: { slug: post.id.split("/")[1] },
    props: { post },
  }));
}

const { post } = Astro.props;
---

<BaseLayout
  locale="en"
  title={`${post.data.title} | Dra. Estela Mas`}
  description={post.data.summary.split("\n")[0]}
>
  <BlogPostArticle locale="en" post={post} />
</BaseLayout>
```

- [ ] **Step 5: Build and verify**

```bash
pnpm astro check && pnpm build
ls dist/blog/salud-renal-prevencion-enfermedad-renal/index.html \
   dist/es/blog/salud-renal-prevencion-enfermedad-renal/index.html \
   dist/en/blog/salud-renal-prevencion-enfermedad-renal/index.html
grep -o 'hreflang' dist/blog/salud-renal-prevencion-enfermedad-renal/index.html | wc -l
grep -c 'rel="canonical" href="https://www.draestelamas.com/es/blog/salud-renal-prevencion-enfermedad-renal/"' dist/es/blog/salud-renal-prevencion-enfermedad-renal/index.html
grep -o "El futur de la nefrologia" dist/blog/salud-renal-prevencion-enfermedad-renal/index.html | wc -l
grep -c "July 2026" dist/en/blog/salud-renal-prevencion-enfermedad-renal/index.html
grep -c '/blog/salud-renal-prevencion-enfermedad-renal/' dist/sitemap-0.xml
```

Expected: three files listed · `4` hreflang attributes on the post page · `1` correct ES canonical · `4+` occurrences of the CA title (`<title>`, OG/Twitter metas, `<h1>`) · `1` formatted date "12 July 2026" in the EN post · sitemap contains the post URLs (count >= 1; sitemap file may be named `sitemap-0.xml` — check `dist/sitemap-index.xml` for the actual name if the grep finds nothing).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add static blog post pages for all three locales"
```
