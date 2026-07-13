# 02 — i18n Types, Helpers & Content Dictionaries (Tasks 5–8)

> Part of the [Astro Rebuild plan](00-overview.md). The dictionaries below contain the site copy extracted **verbatim** from the live site (2026-07-13), with exactly two sanctioned edits: privacy §6 (Formspree → Resend) and §8 (cookies wording, since language preference now lives in the URL). Do not edit, re-translate, or "improve" any other string. Source typos (e.g. ES "El riñón florito") are intentional.

---

### Task 5: i18n types and URL helpers (TDD)

**Files:**
- Create: `src/i18n/types.ts`, `src/i18n/config.ts`
- Test: `tests/i18n-helpers.test.ts`

**Interfaces:**
- Produces:
  - `type Locale = "ca" | "es" | "en"`, `interface TranslationContent`, `interface Artwork { id, title, medium, technique, description }`, `interface LegalSection { heading, bodyHtml }` (from `types.ts`)
  - `locales: Locale[]`, `defaultLocale`, `localeHreflang: Record<Locale, string>`, `ogLocale: Record<Locale, string>`, `dateLocale: Record<Locale, string>`, `socialLinks`, `stripLocalePrefix(pathname: string): string`, `localizePath(basePath: string, locale: Locale): string`, `homePath(locale: Locale): string` (from `config.ts`)

- [ ] **Step 1: Write the failing test `tests/i18n-helpers.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { homePath, localizePath, stripLocalePrefix } from "../src/i18n/config";

describe("stripLocalePrefix", () => {
  it("returns / for the root of every locale", () => {
    expect(stripLocalePrefix("/")).toBe("/");
    expect(stripLocalePrefix("/es/")).toBe("/");
    expect(stripLocalePrefix("/en/")).toBe("/");
    expect(stripLocalePrefix("/es")).toBe("/");
  });

  it("strips the locale prefix from nested paths", () => {
    expect(stripLocalePrefix("/blog/salud-renal/")).toBe("/blog/salud-renal/");
    expect(stripLocalePrefix("/es/blog/salud-renal/")).toBe("/blog/salud-renal/");
    expect(stripLocalePrefix("/en/blog/salud-renal/")).toBe("/blog/salud-renal/");
  });

  it("does not strip lookalike segments", () => {
    expect(stripLocalePrefix("/essay/")).toBe("/essay/");
    expect(stripLocalePrefix("/enrol/")).toBe("/enrol/");
  });
});

describe("localizePath", () => {
  it("keeps the default locale unprefixed", () => {
    expect(localizePath("/", "ca")).toBe("/");
    expect(localizePath("/blog/salud-renal/", "ca")).toBe("/blog/salud-renal/");
  });

  it("prefixes non-default locales", () => {
    expect(localizePath("/", "es")).toBe("/es/");
    expect(localizePath("/", "en")).toBe("/en/");
    expect(localizePath("/blog/salud-renal/", "en")).toBe("/en/blog/salud-renal/");
  });
});

describe("homePath", () => {
  it("maps locales to home URLs", () => {
    expect(homePath("ca")).toBe("/");
    expect(homePath("es")).toBe("/es/");
    expect(homePath("en")).toBe("/en/");
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
pnpm test
```

Expected: FAIL — cannot resolve `../src/i18n/config`.

- [ ] **Step 3: Write `src/i18n/types.ts`**

```ts
export type Locale = "ca" | "es" | "en";

export type ArtworkId = "obra-01" | "obra-02" | "obra-03" | "obra-04" | "obra-05";

/**
 * One gallery artwork. `id` matches the image basenames in src/assets/img:
 * grid thumbnail `galeria-<n>.jpg`, lightbox full-size `obra-<n>.jpg`.
 * `medium` (grid caption) and `technique` (lightbox line) differ for obra-01
 * in the source site — both are preserved verbatim.
 */
export interface Artwork {
  id: ArtworkId;
  title: string;
  medium: string;
  technique: string;
  description: string;
}

export interface LegalSection {
  heading: string;
  /** Trusted first-party HTML copied from the source site (contains <strong>, <br/>). */
  bodyHtml: string;
}

export interface TranslationContent {
  meta: { title: string; description: string };
  nav: {
    homeLabel: string;
    aboutLabel: string;
    blogLabel: string;
    blogPill: string;
    digitalLabel: string;
    galleryLabel: string;
    collaborationsHtml: string;
    contactLabel: string;
  };
  hero: {
    eyebrowHtml: string;
    titleHtml: string;
    subtitle: string;
    ctaCollaborationsHtml: string;
    ctaContact: string;
    imageAlt: string;
  };
  about: {
    titleHtml: string;
    label: string;
    tags: { text: string; accent: boolean }[];
    bioHtml: string[];
    trainingLabel: string;
    training: string[];
    societiesLabel: string;
    societies: string[];
    portraitAlt: string;
  };
  blog: { eyebrow: string; titleHtml: string; back: string };
  digital: { titleHtml: string; intro: string; areasLabel: string; areas: string[] };
  gallery: { titleHtml: string; intro: string; artworks: Artwork[] };
  collaborations: {
    titleHtml: string;
    highlight: string;
    areasTitle: string;
    areas: string[];
    entitiesTitle: string;
    entities: string[];
    cta: string;
  };
  contact: {
    title: string;
    email: string;
    labels: { name: string; surname: string; email: string; message: string };
    gdpr: string;
    submit: string;
    sending: string;
    success: string;
    error: string;
  };
  footer: {
    name: string;
    specialty: string;
    privacyLabel: string;
    legalLabel: string;
  };
  privacy: { title: string; sections: LegalSection[]; updated: string };
  legal: { title: string; sections: LegalSection[]; updated: string };
}
```

- [ ] **Step 4: Write `src/i18n/config.ts`**

```ts
import type { Locale } from "./types";

export const locales: Locale[] = ["ca", "es", "en"];
export const defaultLocale: Locale = "ca";

/** hreflang values — plain language codes, matching the live site. */
export const localeHreflang: Record<Locale, string> = { ca: "ca", es: "es", en: "en" };

export const ogLocale: Record<Locale, string> = { ca: "ca_ES", es: "es_ES", en: "en_GB" };

/** BCP 47 tags for date formatting (blog post dates). */
export const dateLocale: Record<Locale, string> = { ca: "ca-ES", es: "es-ES", en: "en-GB" };

/** Identical across locales; used by About and Footer. */
export const socialLinks = {
  linkedin: { href: "https://www.linkedin.com/in/estelamasrodenas/", label: "LinkedIn" },
  twitter: { href: "https://twitter.com/EstelaNefro", label: "@EstelaNefro" },
} as const;

/** "/es/blog/x/" -> "/blog/x/"; "/en/" -> "/"; "/blog/x/" -> "/blog/x/" */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(es|en)(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

/** localizePath("/blog/x/", "en") -> "/en/blog/x/"; default locale stays unprefixed. */
export function localizePath(basePath: string, locale: Locale): string {
  if (locale === defaultLocale) return basePath;
  return basePath === "/" ? `/${locale}/` : `/${locale}${basePath}`;
}

export function homePath(locale: Locale): string {
  return localizePath("/", locale);
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
pnpm test
```

Expected: all `i18n-helpers` tests PASS (plus the smoke test).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add i18n types and locale URL helpers with tests"
```

---

### Task 6: Catalan dictionary (default locale)

**Files:**
- Create: `src/i18n/content/ca.ts`

**Interfaces:**
- Consumes: `TranslationContent` from Task 5.
- Produces: default export `ca: TranslationContent` — the reference dictionary for structure parity.

- [ ] **Step 1: Write `src/i18n/content/ca.ts`** (copy exactly — this is the extracted source copy)

```ts
import type { TranslationContent } from "../types";

const ca: TranslationContent = {
  meta: {
    title: "Dra. Estela Mas | Nefròloga",
    description:
      "Nefròloga especialista en salut cardiorenometabòlica i prevenció del risc cardiovascular. Consulta nefrològica online amb un enfocament humanista i basat en l'evidència.",
  },
  nav: {
    homeLabel: "Inici",
    aboutLabel: "Sobre jo",
    blogLabel: "Salut Cardiorenal",
    blogPill: "Blog",
    digitalLabel: "Salut Digital i IA",
    galleryLabel: "Humanisme Mèdic",
    collaborationsHtml: "Col<span class='l-geminada'>·</span>laboracions",
    contactLabel: "Contacte",
  },
  hero: {
    eyebrowHtml:
      "Especialista en Nefrologia<br />Salut cardiorenometabòlica<br />Prevenció del risc cardiovascular",
    titleHtml:
      "Darrere de cada pacient,<br />hi ha una <em>obra d'art</em><br />irrepetible.",
    subtitle:
      "Nefròloga especialitzada en salut cardiorenometabòlica i prevenció del risc cardiovascular. Uneixo la medicina basada en l'evidència, la innovació en salut digital i IA, i una mirada humanista centrada en la persona.",
    ctaCollaborationsHtml: "Col<span class='l-geminada'>·</span>laboracions",
    ctaContact: "Contacte",
    imageAlt: "Obra d'art — dos ronyons amb paisatge de posta de sol",
  },
  about: {
    titleHtml: "Sobre <em>jo</em>",
    label: "Recerca, formació contínua i humanisme mèdic",
    tags: [
      { text: "Salut cardiorenometabòlica", accent: false },
      { text: "Risc cardiovascular", accent: false },
      { text: "Art renal", accent: true },
      { text: "Humanisme mèdic", accent: true },
    ],
    bioHtml: [
      "Soc <strong>nefròloga, investigadora i artista</strong>. La meva activitat se centra en l'<strong>atenció integral de les persones amb malaltia renal crònica, hipertensió arterial i síndrome cardiorenometabòlica</strong>, amb un enfocament orientat a la prevenció i a la medicina basada en l'evidència. La meva trajectòria professional combina l'activitat assistencial, la participació en recerca clínica i la formació continuada, amb un interès creixent per la <strong>salut digital, la intel·ligència artificial i la innovació en HealthTech</strong>.",
      "Compagino la meva activitat assistencial amb la formació contínua en innovació aplicada a la medicina i amb la divulgació científica, participant en xerrades i activitats formatives sobre prevenció cardiorenal, risc cardiovascular en la malaltia renal crònica i síndrome cardiorenometabòlica.",
      "Paral·lelament, he completat una formació de postgrau en <strong>artteràpia</strong>, una disciplina que ha enriquit la meva visió humanista de la medicina i que reforça la meva manera d'entendre l'atenció sanitària: <strong>rigorosa des del punt de vista científic, però també propera i centrada en la persona</strong>.",
      "He realitzat estades formatives a la <strong>Unitat Cardiorrenal de l'Hospital Puerta de Hierro</strong> (Madrid) i a la <strong>Mayo Clinic de Rochester</strong> (Estats Units), experiències que han ampliat la meva perspectiva clínica i científica.",
      "La meva vocació és contribuir a una medicina més <strong>preventiva, innovadora i humana</strong>, oferint una atenció basada en l'evidència i adaptada a les necessitats de cada persona.",
    ],
    trainingLabel: "Formació i activitat acadèmica",
    training: [
      "Llicenciada en Medicina per la Universitat Autònoma de Barcelona",
      "Especialista en Nefrologia per l'Hospital Universitari Son Espases",
      "Màster en Investigació Mèdica",
      "Formació en nutrició clínica",
      "Màster en Hemodiàlisi",
      "Màster en Maneig de Fluids i Electròlits",
      "Formació continuada en síndrome cardiorenometabòlica, lipidologia clínica, risc cardiovascular i cardionefrologia",
      "Autora de publicacions en revistes científiques nacionals i internacionals",
      "Idiomes: català, castellà i anglès",
    ],
    societiesLabel: "Societats científiques",
    societies: [
      "Sociedad Española de Nefrología (SEN)",
      "European Renal Association (ERA)",
      "American Society of Nephrology (ASN)",
      "International Society of Nephrology (ISN)",
      "Sociedad Española de Arteriosclerosis (SEA)",
      "Societat Balear de Nefrologia (SBN)",
    ],
    portraitAlt: "Dra. Estela Mas Ródenas, nefròloga",
  },
  blog: {
    eyebrow: "Blog · Articles de la doctora",
    titleHtml: "Salut <em>Cardiorenal</em>",
    back: "← Tornar",
  },
  digital: {
    titleHtml: "Salut Digital <em>i IA</em>",
    intro:
      "La salut digital i la intel·ligència artificial estan transformant la manera en què prevenim, diagnostiquem i fem el seguiment de les malalties cròniques. El meu interès se centra en com aquestes eines poden contribuir a millorar la prevenció cardiorenal, el control de la hipertensió, la malaltia renal crònica i la presa de decisions clíniques basada en dades. Actualment estic ampliant la meva formació en aquest àmbit i seguint de prop els avenços científics i tecnològics, amb l'objectiu d'integrar la innovació digital en la pràctica clínica i participar en projectes que millorin l'atenció a pacients i professionals.",
    areasLabel: "Àrees d'interès",
    areas: [
      "Monitorització remota de pacients",
      "Hipertensió i seguiment digital",
      "Prevenció cardiorenal",
      "Intel·ligència artificial aplicada a la pràctica clínica",
      "Suport a la presa de decisions clíniques",
      "Medicina personalitzada basada en dades",
    ],
  },
  gallery: {
    titleHtml: "Humanisme <em>Mèdic</em>",
    intro:
      "A través de l'art, exploro l'experiència humana de la malaltia renal i la seva repercussió en la vida de les persones. Aquest projecte neix de la voluntat d'apropar la medicina, la ciència i les humanitats, generant espais de reflexió, divulgació i sensibilització al voltant de la salut renal.",
    artworks: [
      {
        id: "obra-01",
        title: "El ronyó florit",
        medium: "Acrílic i pastel sobre paper",
        technique: "Acrílic sobre tela",
        description: "Un ronyó com a jardí interior: la vida que persisteix dins la malaltia.",
      },
      {
        id: "obra-02",
        title: "Ciència i paisatge",
        medium: "Llapis sobre paper",
        technique: "Llapis sobre paper",
        description: "La mirada científica i la dimensió humana de la medicina renal, retratades juntes.",
      },
      {
        id: "obra-03",
        title: "The Blooming Glomerulus",
        medium: "Oli sobre tela · Portada NDT, febrer 2026",
        technique: "Oli sobre tela · Portada NDT, febrer 2026",
        description:
          "Obra seleccionada com a portada de la revista Nephrology Dialysis Transplantation (Oxford University Press), febrer 2026.",
      },
      {
        id: "obra-04",
        title: "Ronyons al capvespre",
        medium: "Acrílic sobre tela",
        technique: "Acrílic sobre tela",
        description:
          "La posta de sol com a metàfora de la resiliència: la bellesa que existeix fins i tot en els moments difícils.",
      },
      {
        id: "obra-05",
        title: "Far interior",
        medium: "Oli sobre tela",
        technique: "Oli sobre tela",
        description:
          "El far simbolitza l'esperança, la guia i la resiliència davant la malaltia, mentre que el mar evoca la serenitat i el pas del temps.",
      },
    ],
  },
  collaborations: {
    titleHtml: "Col<span class='l-geminada'>·</span>laboracions",
    highlight: "Si creus que podem treballar junts, estaré encantada de conèixer la teva proposta.",
    areasTitle: "Àrees",
    areas: [
      "Recerca clínica",
      "Prevenció cardiorenal",
      "Salut digital i IA",
      "Docència i conferències",
      "Divulgació mèdica",
    ],
    entitiesTitle: "Entitats",
    entities: [
      "Hospitals i centres sanitaris",
      "Universitats i centres de recerca",
      "Empreses de salut digital",
      "Societats científiques",
      "Mitjans de comunicació",
    ],
    cta: "Enviar una proposta",
  },
  contact: {
    title: "Contacte",
    email: "info@draestelamas.com",
    labels: { name: "Nom", surname: "Cognoms", email: "Email", message: "Missatge" },
    gdpr: "Les seves dades seran tractades amb total confidencialitat d'acord amb el RGPD. No es cediran a tercers.",
    submit: "Enviar",
    sending: "Enviant...",
    success: "✓ Missatge enviat. La Dra. Mas Ródenas es posarà en contacte amb vostè en breu.",
    error: "Hi ha hagut un error. Contacti per correu electrònic.",
  },
  footer: {
    name: "Dra. Estela Mas Ródenas",
    specialty: "Especialista en Nefrologia · Salut cardiorenometabòlica · Mallorca",
    privacyLabel: "Política de privacitat",
    legalLabel: "Avís legal",
  },
  privacy: {
    title: "Política de Privacitat",
    sections: [
      {
        heading: "1. Responsable del tractament",
        bodyHtml:
          "<strong>Estela de los Ángeles Mas Ródenas</strong><br />Nefròloga col·legiada nº 070711336<br />Mallorca, Illes Balears, Espanya<br />Email: info@draestelamas.com<br />Web: www.draestelamas.com",
      },
      {
        heading: "2. Dades que recollim",
        bodyHtml:
          "A través del formulari de contacte recollim: nom, cognoms i adreça de correu electrònic. De manera opcional, un missatge.",
      },
      {
        heading: "3. Finalitat del tractament",
        bodyHtml:
          "Les dades recollides s'utilitzen exclusivament per respondre a les sol·licituds de consulta o contacte enviades a través del formulari web. No s'utilitzen per a cap altra finalitat.",
      },
      {
        heading: "4. Base legal",
        bodyHtml:
          "El tractament es basa en el <strong>consentiment exprés</strong> de la persona interessada, atorgat en el moment d'enviar el formulari (art. 6.1.a del RGPD).",
      },
      {
        heading: "5. Conservació de les dades",
        bodyHtml:
          "Les dades es conserven durant el temps estrictament necessari per atendre la sol·licitud i, en cas de relació assistencial, durant el termini legalment establert per a la documentació clínica.",
      },
      {
        heading: "6. Destinataris",
        bodyHtml:
          "Les dades no es cedeixen a tercers, excepte obligació legal. El formulari de contacte utilitza el servei <strong>Resend</strong> per a la tramesa del missatge, amb garanties adequades de protecció de dades.",
      },
      {
        heading: "7. Drets de la persona interessada",
        bodyHtml:
          "Pot exercir els drets d'accés, rectificació, supressió, oposició, limitació i portabilitat de les seves dades dirigint-se a <strong>info@draestelamas.com</strong>, indicant el seu nom i la sol·licitud concreta. Té dret a presentar una reclamació davant l'<strong>Agència Espanyola de Protecció de Dades</strong> (www.aepd.es).",
      },
      {
        heading: "8. Cookies",
        bodyHtml:
          "Aquesta web no utilitza galetes de seguiment ni analítiques, ni cap mecanisme d'emmagatzematge local. La preferència d'idioma es reflecteix únicament a l'adreça de la pàgina (/, /es/, /en/), sense recollir dades personals.",
      },
    ],
    updated: "Darrera actualització: Juliol de 2026",
  },
  legal: {
    title: "Avís Legal",
    sections: [
      {
        heading: "1. Titular del lloc web",
        bodyHtml:
          "<strong>Estela de los Ángeles Mas Ródenas</strong><br />Nefròloga. Número de col·legiada: <strong>070711336</strong><br />Mallorca, Illes Balears, Espanya<br />Email: info@draestelamas.com<br />Web: www.draestelamas.com",
      },
      {
        heading: "2. Objecte i àmbit d'aplicació",
        bodyHtml:
          "Aquest avís legal regula l'ús del lloc web www.draestelamas.com, titularitat de la Dra. Estela de los Ángeles Mas Ródenas. L'accés i l'ús d'aquest lloc web impliquen l'acceptació d'aquestes condicions.",
      },
      {
        heading: "3. Caràcter informatiu",
        bodyHtml:
          "Els continguts d'aquesta web tenen caràcter exclusivament informatiu i divulgatiu. <strong>No substitueixen en cap cas la consulta mèdica presencial ni el diagnòstic clínic individualitzat.</strong> Per a qualsevol decisió relacionada amb la salut, es recomana consultar un professional sanitari.",
      },
      {
        heading: "4. Propietat intel·lectual",
        bodyHtml:
          "Tots els continguts d'aquesta web (textos, imatges, obres d'art, disseny i codi) són propietat de la Dra. Estela de los Ángeles Mas Ródenas o estan degudament autoritzats. Queda prohibida la seva reproducció, distribució o comunicació pública sense autorització expressa.",
      },
      {
        heading: "5. Responsabilitat",
        bodyHtml:
          "La titular no es fa responsable dels danys que puguin derivar-se de l'ús de la informació continguda en aquest lloc web, ni de les interrupcions del servei per causes tècniques alienes al seu control.",
      },
      {
        heading: "6. Legislació aplicable",
        bodyHtml:
          "Aquest avís legal es regeix per la legislació espanyola vigent, en particular per la Llei 34/2002, d'11 de juliol, de Serveis de la Societat de la Informació i de Comerç Electrònic (LSSI-CE), i pel Reglament (UE) 2016/679 (RGPD).",
      },
    ],
    updated: "Darrera actualització: Juny de 2025",
  },
};

export default ca;
```

- [ ] **Step 2: Type-check**

```bash
pnpm astro check
```

Expected: 0 errors (the dictionary satisfies `TranslationContent`).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Catalan content dictionary (verbatim source copy)"
```

---

### Task 7: Spanish dictionary

**Files:**
- Create: `src/i18n/content/es.ts`

**Interfaces:**
- Consumes: `TranslationContent` from Task 5.
- Produces: default export `es: TranslationContent`.

- [ ] **Step 1: Write `src/i18n/content/es.ts`** (copy exactly)

```ts
import type { TranslationContent } from "../types";

const es: TranslationContent = {
  meta: {
    title: "Dra. Estela Mas | Nefróloga",
    description:
      "Nefróloga especialista en salud cardiorrenal metabólica y prevención del riesgo cardiovascular. Consulta nefrológica online con un enfoque humanista y basado en la evidencia.",
  },
  nav: {
    homeLabel: "Inicio",
    aboutLabel: "Sobre mí",
    blogLabel: "Salud Cardiorrenal",
    blogPill: "Blog",
    digitalLabel: "Salud Digital e IA",
    galleryLabel: "Humanismo Médico",
    collaborationsHtml: "Colaboraciones",
    contactLabel: "Contacto",
  },
  hero: {
    eyebrowHtml:
      "Especialista en Nefrología<br />Salud cardiorrenal metabólica<br />Prevención del riesgo cardiovascular",
    titleHtml:
      "Detrás de cada paciente,<br />hay una <em>obra de arte</em><br />irrepetible.",
    subtitle:
      "Nefróloga especializada en salud cardiorrenal metabólica y prevención del riesgo cardiovascular. Uno la medicina basada en la evidencia, la innovación en salud digital e IA, y una mirada humanista centrada en la persona.",
    ctaCollaborationsHtml: "Colaboraciones",
    ctaContact: "Contacto",
    imageAlt: "Obra de arte — dos riñones con paisaje de atardecer",
  },
  about: {
    titleHtml: "Sobre <em>mí</em>",
    label: "Investigación, formación continua y humanismo médico",
    tags: [
      { text: "Salud cardiorrenal metabólica", accent: false },
      { text: "Riesgo cardiovascular", accent: false },
      { text: "Arte renal", accent: true },
      { text: "Humanismo médico", accent: true },
    ],
    bioHtml: [
      "Soy <strong>nefróloga, investigadora y artista</strong>. Mi actividad se centra en la <strong>atención integral de las personas con enfermedad renal crónica, hipertensión arterial y síndrome cardiorrenometabólico</strong>, con un enfoque orientado a la prevención y a la medicina basada en la evidencia. Mi trayectoria profesional combina la actividad asistencial, la participación en investigación clínica y la formación continuada, con un creciente interés por la <strong>salud digital, la inteligencia artificial y la innovación en HealthTech</strong>.",
      "Compagino mi actividad asistencial con la formación continua en innovación aplicada a la medicina y con la divulgación científica, participando en charlas y actividades formativas sobre prevención cardiorrenal, riesgo cardiovascular en la enfermedad renal crónica y síndrome cardiorrenometabólico.",
      "Paralelamente, he completado una formación de posgrado en <strong>arteterapia</strong>, una disciplina que ha enriquecido mi visión humanista de la medicina y que refuerza mi forma de entender la atención sanitaria: <strong>rigurosa desde el punto de vista científico, pero también cercana y centrada en la persona</strong>.",
      "He realizado estancias formativas en la <strong>Unidad Cardiorrenal del Hospital Puerta de Hierro</strong> (Madrid) y en la <strong>Mayo Clinic de Rochester</strong> (Estados Unidos), experiencias que han ampliado mi perspectiva clínica y científica.",
      "Mi vocación es contribuir a una medicina más <strong>preventiva, innovadora y humana</strong>, ofreciendo una atención basada en la evidencia y adaptada a las necesidades de cada persona.",
    ],
    trainingLabel: "Formación y actividad académica",
    training: [
      "Licenciada en Medicina por la Universitat Autònoma de Barcelona",
      "Especialista en Nefrología por el Hospital Universitario Son Espases",
      "Máster en Investigación Médica",
      "Formación en nutrición clínica",
      "Máster en Hemodiálisis",
      "Máster en Manejo de Fluidos y Electrolitos",
      "Formación continuada en síndrome cardiorrenal metabólico, lipidología clínica, riesgo cardiovascular y cardionefrología",
      "Autora de publicaciones en revistas científicas nacionales e internacionales",
      "Idiomas: catalán, castellano e inglés",
    ],
    societiesLabel: "Sociedades científicas",
    societies: [
      "Sociedad Española de Nefrología (SEN)",
      "European Renal Association (ERA)",
      "American Society of Nephrology (ASN)",
      "International Society of Nephrology (ISN)",
      "Sociedad Española de Arteriosclerosis (SEA)",
      "Societat Balear de Nefrologia (SBN)",
    ],
    portraitAlt: "Dra. Estela Mas Ródenas, nefróloga",
  },
  blog: {
    eyebrow: "Blog · Artículos de la doctora",
    titleHtml: "Salud <em>Cardiorrenal</em>",
    back: "← Volver",
  },
  digital: {
    titleHtml: "Salud Digital <em>e IA</em>",
    intro:
      "La salud digital y la inteligencia artificial están transformando la forma en que prevenimos, diagnosticamos y hacemos el seguimiento de las enfermedades crónicas. Mi interés se centra en cómo estas herramientas pueden contribuir a mejorar la prevención cardiorrenal, el control de la hipertensión, la enfermedad renal crónica y la toma de decisiones clínicas basada en datos. Actualmente estoy ampliando mi formación en este ámbito y siguiendo de cerca los avances científicos y tecnológicos, con el objetivo de integrar la innovación digital en la práctica clínica y participar en proyectos que mejoren la atención a pacientes y profesionales.",
    areasLabel: "Áreas de interés",
    areas: [
      "Monitorización remota de pacientes",
      "Hipertensión y seguimiento digital",
      "Prevención cardiorrenal",
      "Inteligencia artificial aplicada a la práctica clínica",
      "Apoyo a la toma de decisiones clínicas",
      "Medicina personalizada basada en datos",
    ],
  },
  gallery: {
    titleHtml: "Humanismo <em>Médico</em>",
    intro:
      "A través del arte, exploro la experiencia humana de la enfermedad renal y su repercusión en la vida de las personas. Este proyecto nace de la voluntad de acercar la medicina, la ciencia y las humanidades, generando espacios de reflexión, divulgación y sensibilización en torno a la salud renal.",
    artworks: [
      {
        id: "obra-01",
        title: "El riñón florito",
        medium: "Acrílico y pastel sobre papel",
        technique: "Acrílico sobre tela",
        description: "Un riñón como jardín interior: la vida que persiste dentro de la enfermedad.",
      },
      {
        id: "obra-02",
        title: "Ciencia y paisaje",
        medium: "Lápiz sobre papel",
        technique: "Lápiz sobre papel",
        description: "La mirada científica y la dimensión humana de la medicina renal, retratadas juntas.",
      },
      {
        id: "obra-03",
        title: "The Blooming Glomerulus",
        medium: "Óleo sobre tela · Portada NDT, febrero 2026",
        technique: "Óleo sobre tela · Portada NDT, febrero 2026",
        description:
          "Obra seleccionada como portada de la revista Nephrology Dialysis Transplantation (Oxford University Press), febrero 2026.",
      },
      {
        id: "obra-04",
        title: "Riñones al atardecer",
        medium: "Acrílico sobre tela",
        technique: "Acrílico sobre tela",
        description:
          "El atardecer como metáfora de la resiliencia: la belleza que existe incluso en los momentos difíciles.",
      },
      {
        id: "obra-05",
        title: "Faro interior",
        medium: "Óleo sobre tela",
        technique: "Óleo sobre tela",
        description:
          "El faro simboliza la esperanza, la guía y la resiliencia ante la enfermedad, mientras que el mar evoca la serenidad y el paso del tiempo.",
      },
    ],
  },
  collaborations: {
    titleHtml: "Colaboraciones",
    highlight: "Si crees que podemos trabajar juntos, estaré encantada de conocer tu propuesta.",
    areasTitle: "Áreas",
    areas: [
      "Investigación clínica",
      "Prevención cardiorrenal",
      "Salud digital e IA",
      "Docencia y conferencias",
      "Divulgación médica",
    ],
    entitiesTitle: "Entidades",
    entities: [
      "Hospitales y centros sanitarios",
      "Universidades y centros de investigación",
      "Empresas de salud digital",
      "Sociedades científicas",
      "Medios de comunicación",
    ],
    cta: "Enviar una propuesta",
  },
  contact: {
    title: "Contacto",
    email: "info@draestelamas.com",
    labels: { name: "Nombre", surname: "Apellidos", email: "Email", message: "Mensaje" },
    gdpr: "Sus datos serán tratados con total confidencialidad conforme al RGPD. No serán cedidos a terceros.",
    submit: "Enviar",
    sending: "Enviando...",
    success: "✓ Mensaje enviado. La Dra. Mas Ródenas se pondrá en contacto con usted en breve.",
    error: "Ha ocurrido un error. Contacte por correo electrónico.",
  },
  footer: {
    name: "Dra. Estela Mas Ródenas",
    specialty: "Especialista en Nefrología · Salud cardiorrenal metabólica · Mallorca",
    privacyLabel: "Política de privacidad",
    legalLabel: "Aviso legal",
  },
  privacy: {
    title: "Política de Privacidad",
    sections: [
      {
        heading: "1. Responsable del tratamiento",
        bodyHtml:
          "<strong>Estela de los Ángeles Mas Ródenas</strong><br />Nefróloga colegiada nº 070711336<br />Mallorca, Illes Balears, España<br />Email: info@draestelamas.com<br />Web: www.draestelamas.com",
      },
      {
        heading: "2. Datos que recogemos",
        bodyHtml:
          "A través del formulario de contacto recogemos: nombre, apellidos y dirección de correo electrónico. De manera opcional, un mensaje.",
      },
      {
        heading: "3. Finalidad del tratamiento",
        bodyHtml:
          "Los datos recogidos se utilizan exclusivamente para responder a las solicitudes de consulta o contacto enviadas a través del formulario web. No se utilizan para ninguna otra finalidad.",
      },
      {
        heading: "4. Base legal",
        bodyHtml:
          "El tratamiento se basa en el <strong>consentimiento expreso</strong> de la persona interesada, otorgado en el momento de enviar el formulario (art. 6.1.a del RGPD).",
      },
      {
        heading: "5. Conservación de los datos",
        bodyHtml:
          "Los datos se conservan durante el tiempo estrictamente necesario para atender la solicitud y, en caso de relación asistencial, durante el plazo legalmente establecido para la documentación clínica.",
      },
      {
        heading: "6. Destinatarios",
        bodyHtml:
          "Los datos no se ceden a terceros, salvo obligación legal. El formulario de contacto utiliza el servicio <strong>Resend</strong> para el envío del mensaje, con garantías adecuadas de protección de datos.",
      },
      {
        heading: "7. Derechos de la persona interesada",
        bodyHtml:
          "Puede ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad de sus datos dirigiéndose a <strong>info@draestelamas.com</strong>, indicando su nombre y la solicitud concreta. Tiene derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos</strong> (www.aepd.es).",
      },
      {
        heading: "8. Cookies",
        bodyHtml:
          "Este sitio web no utiliza cookies de seguimiento ni analíticas, ni ningún mecanismo de almacenamiento local. La preferencia de idioma se refleja únicamente en la dirección de la página (/, /es/, /en/), sin recoger datos personales.",
      },
    ],
    updated: "Última actualización: Julio de 2026",
  },
  legal: {
    title: "Aviso Legal",
    sections: [
      {
        heading: "1. Titular del sitio web",
        bodyHtml:
          "<strong>Estela de los Ángeles Mas Ródenas</strong><br />Nefróloga. Número de colegiada: <strong>070711336</strong><br />Mallorca, Illes Balears, España<br />Email: info@draestelamas.com<br />Web: www.draestelamas.com",
      },
      {
        heading: "2. Objeto y ámbito de aplicación",
        bodyHtml:
          "Este aviso legal regula el uso del sitio web www.draestelamas.com, titularidad de la Dra. Estela de los Ángeles Mas Ródenas. El acceso y uso de este sitio web implican la aceptación de estas condiciones.",
      },
      {
        heading: "3. Carácter informativo",
        bodyHtml:
          "Los contenidos de esta web tienen carácter exclusivamente informativo y divulgativo. <strong>No sustituyen en ningún caso la consulta médica presencial ni el diagnóstico clínico individualizado.</strong> Para cualquier decisión relacionada con la salud, se recomienda consultar a un profesional sanitario.",
      },
      {
        heading: "4. Propiedad intelectual",
        bodyHtml:
          "Todos los contenidos de esta web (textos, imágenes, obras de arte, diseño y código) son propiedad de la Dra. Estela de los Ángeles Mas Ródenas o están debidamente autorizados. Queda prohibida su reproducción, distribución o comunicación pública sin autorización expresa.",
      },
      {
        heading: "5. Responsabilidad",
        bodyHtml:
          "La titular no se hace responsable de los daños que puedan derivarse del uso de la información contenida en este sitio web, ni de las interrupciones del servicio por causas técnicas ajenas a su control.",
      },
      {
        heading: "6. Legislación aplicable",
        bodyHtml:
          "Este aviso legal se rige por la legislación española vigente, en particular por la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), y por el Reglamento (UE) 2016/679 (RGPD).",
      },
    ],
    updated: "Última actualización: Junio de 2025",
  },
};

export default es;
```

- [ ] **Step 2: Type-check**

```bash
pnpm astro check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add Spanish content dictionary (verbatim source copy)"
```

---

### Task 8: English dictionary, i18n entrypoint, parity test

**Files:**
- Create: `src/i18n/content/en.ts`, `src/i18n/index.ts`
- Test: `tests/i18n-parity.test.ts`

**Interfaces:**
- Consumes: dictionaries from Tasks 6–7, types/helpers from Task 5.
- Produces: `getTranslations(locale: Locale): TranslationContent` from `src/i18n` (also re-exports everything from `./config` and the types). All later components import from `"../i18n"`.

- [ ] **Step 1: Write `src/i18n/content/en.ts`** (copy exactly)

```ts
import type { TranslationContent } from "../types";

const en: TranslationContent = {
  meta: {
    title: "Dra. Estela Mas | Nephrologist",
    description:
      "Nephrologist specialising in cardiorenal metabolic health and cardiovascular risk prevention. Online nephrology consultation with a humanistic, evidence-based approach.",
  },
  nav: {
    homeLabel: "Home",
    aboutLabel: "About me",
    blogLabel: "Cardiorenal Health",
    blogPill: "Blog",
    digitalLabel: "Digital Health & AI",
    galleryLabel: "Medical Humanism",
    collaborationsHtml: "Collaborations",
    contactLabel: "Contact",
  },
  hero: {
    eyebrowHtml:
      "Specialist in Nephrology<br />Cardiorenal metabolic health<br />Cardiovascular risk prevention",
    titleHtml:
      "Behind every patient,<br />lies an <em>irreplaceable</em><br />work of art.",
    subtitle:
      "Nephrologist specialising in cardiorenal metabolic health and cardiovascular risk prevention. I combine evidence-based medicine, digital health and AI innovation, and a humanistic, person-centred approach.",
    ctaCollaborationsHtml: "Collaborations",
    ctaContact: "Contact",
    imageAlt: "Artwork — two kidneys with a sunset landscape",
  },
  about: {
    titleHtml: "About <em>me</em>",
    label: "Research, continuous training and medical humanism",
    tags: [
      { text: "Cardiorenal metabolic health", accent: false },
      { text: "Cardiovascular risk", accent: false },
      { text: "Renal art", accent: true },
      { text: "Medical humanism", accent: true },
    ],
    bioHtml: [
      "I am a <strong>nephrologist, researcher and artist</strong>. My work focuses on the <strong>comprehensive care of people with chronic kidney disease, arterial hypertension and cardiorenal metabolic syndrome</strong>, with an approach oriented towards prevention and evidence-based medicine. My professional career combines clinical practice, participation in clinical research and continuous training, with a growing interest in <strong>digital health, artificial intelligence and HealthTech innovation</strong>.",
      "I combine my clinical practice with continuous training in innovation applied to medicine and with scientific outreach, participating in talks and educational activities on cardiorenal prevention, cardiovascular risk in chronic kidney disease and cardiorenal metabolic syndrome.",
      "In parallel, I have completed postgraduate training in <strong>art therapy</strong>, a discipline that has enriched my humanistic vision of medicine and reinforces my way of understanding healthcare: <strong>scientifically rigorous, but also close and person-centred</strong>.",
      "I have completed training stays at the <strong>Cardiorenal Unit of Hospital Puerta de Hierro</strong> (Madrid) and at <strong>Mayo Clinic Rochester</strong> (United States), experiences that have broadened my clinical and scientific perspective.",
      "My vocation is to contribute to a more <strong>preventive, innovative and human</strong> medicine, offering evidence-based care adapted to the needs of each individual.",
    ],
    trainingLabel: "Training and academic activity",
    training: [
      "Medical degree from the Universitat Autònoma de Barcelona",
      "Specialist in Nephrology, Hospital Universitari Son Espases",
      "Master's in Medical Research",
      "Training in clinical nutrition",
      "Master's in Haemodialysis",
      "Master's in Fluid and Electrolyte Management",
      "Continuous training in cardiorenal metabolic syndrome, clinical lipidology, cardiovascular risk and cardiorenal medicine",
      "Author of publications in national and international scientific journals",
      "Languages: Catalan, Spanish and English",
    ],
    societiesLabel: "Scientific societies",
    societies: [
      "Sociedad Española de Nefrología (SEN)",
      "European Renal Association (ERA)",
      "American Society of Nephrology (ASN)",
      "International Society of Nephrology (ISN)",
      "Sociedad Española de Arteriosclerosis (SEA)",
      "Societat Balear de Nefrologia (SBN)",
    ],
    portraitAlt: "Dr. Estela Mas Ródenas, nephrologist",
  },
  blog: {
    eyebrow: "Blog · Articles by the doctor",
    titleHtml: "Cardiorenal <em>Health</em>",
    back: "← Back",
  },
  digital: {
    titleHtml: "Digital Health <em>&amp; AI</em>",
    intro:
      "Digital health and artificial intelligence are transforming the way we prevent, diagnose and monitor chronic diseases. My interest focuses on how these tools can help improve cardiorenal prevention, hypertension control, chronic kidney disease and data-driven clinical decision-making. I am currently expanding my training in this field and closely following scientific and technological advances, with the aim of integrating digital innovation into clinical practice and participating in projects that improve care for patients and professionals.",
    areasLabel: "Areas of interest",
    areas: [
      "Remote patient monitoring",
      "Hypertension and digital follow-up",
      "Cardiorenal prevention",
      "Artificial intelligence applied to clinical practice",
      "Clinical decision-making support",
      "Data-driven personalised medicine",
    ],
  },
  gallery: {
    titleHtml: "Medical <em>Humanism</em>",
    intro:
      "Through art, I explore the human experience of kidney disease and its impact on people's lives. This project is born from the desire to bring together medicine, science and the humanities, creating spaces for reflection, outreach and awareness around kidney health.",
    artworks: [
      {
        id: "obra-01",
        title: "The Blooming Kidney",
        medium: "Acrylic and pastel on paper",
        technique: "Acrylic on canvas",
        description: "A kidney as inner garden: the life that persists within disease.",
      },
      {
        id: "obra-02",
        title: "Science and Landscape",
        medium: "Pencil on paper",
        technique: "Pencil on paper",
        description: "The scientific gaze and the human dimension of renal medicine, portrayed together.",
      },
      {
        id: "obra-03",
        title: "The Blooming Glomerulus",
        medium: "Oil on canvas · NDT cover, February 2026",
        technique: "Oil on canvas · NDT cover, February 2026",
        description:
          "Artwork selected as the cover of Nephrology Dialysis Transplantation journal (Oxford University Press), February 2026.",
      },
      {
        id: "obra-04",
        title: "Kidneys at Dusk",
        medium: "Acrylic on canvas",
        technique: "Acrylic on canvas",
        description: "Sunset as a metaphor for resilience: the beauty that exists even in difficult moments.",
      },
      {
        id: "obra-05",
        title: "Inner Lighthouse",
        medium: "Oil on canvas",
        technique: "Oil on canvas",
        description:
          "The lighthouse symbolises hope, guidance and resilience in the face of illness, while the sea evokes serenity and the passing of time.",
      },
    ],
  },
  collaborations: {
    titleHtml: "Collaborations",
    highlight: "If you think we can work together, I would be delighted to hear your proposal.",
    areasTitle: "Areas",
    areas: [
      "Clinical research",
      "Cardiorenal prevention",
      "Digital health & AI",
      "Teaching and conferences",
      "Medical outreach",
    ],
    entitiesTitle: "Entities",
    entities: [
      "Hospitals and healthcare centres",
      "Universities and research centres",
      "Digital health companies",
      "Scientific societies",
      "Media",
    ],
    cta: "Send a proposal",
  },
  contact: {
    title: "Contact",
    email: "info@draestelamas.com",
    labels: { name: "Name", surname: "Surname", email: "Email", message: "Message" },
    gdpr: "Your data will be treated with full confidentiality in accordance with GDPR. It will not be shared with third parties.",
    submit: "Send",
    sending: "Sending...",
    success: "✓ Message sent. Dr. Mas Ródenas will be in touch with you shortly.",
    error: "An error occurred. Please contact us by email.",
  },
  footer: {
    name: "Dra. Estela Mas Ródenas",
    specialty: "Specialist in Nephrology · Cardiorenal metabolic health · Mallorca",
    privacyLabel: "Privacy policy",
    legalLabel: "Legal notice",
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "1. Data controller",
        bodyHtml:
          "<strong>Estela de los Ángeles Mas Ródenas</strong><br />Nephrologist, registration nº 070711336<br />Mallorca, Balearic Islands, Spain<br />Email: info@draestelamas.com<br />Web: www.draestelamas.com",
      },
      {
        heading: "2. Data we collect",
        bodyHtml:
          "Through the contact form we collect: first name, surname and email address. Optionally, a message.",
      },
      {
        heading: "3. Purpose of processing",
        bodyHtml:
          "The data collected is used exclusively to respond to consultation or contact requests submitted through the web form. It is not used for any other purpose.",
      },
      {
        heading: "4. Legal basis",
        bodyHtml:
          "Processing is based on the <strong>explicit consent</strong> of the data subject, given at the time of submitting the form (Art. 6.1.a GDPR).",
      },
      {
        heading: "5. Data retention",
        bodyHtml:
          "Data is retained for the time strictly necessary to address the request and, in the case of a healthcare relationship, for the legally established period for clinical documentation.",
      },
      {
        heading: "6. Recipients",
        bodyHtml:
          "Data is not shared with third parties, except where legally required. The contact form uses the <strong>Resend</strong> service for message delivery, with appropriate data protection guarantees.",
      },
      {
        heading: "7. Data subject rights",
        bodyHtml:
          "You may exercise your rights of access, rectification, erasure, objection, restriction and portability by contacting <strong>info@draestelamas.com</strong>, stating your name and specific request. You have the right to lodge a complaint with the <strong>Spanish Data Protection Agency</strong> (www.aepd.es).",
      },
      {
        heading: "8. Cookies",
        bodyHtml:
          "This website does not use tracking or analytical cookies, nor any local storage mechanism. Language preference is reflected only in the page address (/, /es/, /en/), without collecting personal data.",
      },
    ],
    updated: "Last updated: July 2026",
  },
  legal: {
    title: "Legal Notice",
    sections: [
      {
        heading: "1. Website owner",
        bodyHtml:
          "<strong>Estela de los Ángeles Mas Ródenas</strong><br />Nephrologist. Registration number: <strong>070711336</strong><br />Mallorca, Balearic Islands, Spain<br />Email: info@draestelamas.com<br />Web: www.draestelamas.com",
      },
      {
        heading: "2. Purpose and scope",
        bodyHtml:
          "This legal notice governs the use of the website www.draestelamas.com, owned by Dr. Estela de los Ángeles Mas Ródenas. Accessing and using this website implies acceptance of these terms.",
      },
      {
        heading: "3. Informational nature",
        bodyHtml:
          "The contents of this website are exclusively informational and educational in nature. <strong>They do not replace in any case an in-person medical consultation or individualised clinical diagnosis.</strong> For any health-related decision, consulting a healthcare professional is recommended.",
      },
      {
        heading: "4. Intellectual property",
        bodyHtml:
          "All content on this website (texts, images, artworks, design and code) is the property of Dr. Estela de los Ángeles Mas Ródenas or is duly authorised. Reproduction, distribution or public communication without express authorisation is prohibited.",
      },
      {
        heading: "5. Liability",
        bodyHtml:
          "The owner is not liable for any damages arising from the use of the information contained on this website, nor for service interruptions due to technical causes beyond their control.",
      },
      {
        heading: "6. Applicable law",
        bodyHtml:
          "This legal notice is governed by current Spanish legislation, in particular Law 34/2002 of 11 July on Information Society Services and Electronic Commerce (LSSI-CE), and Regulation (EU) 2016/679 (GDPR).",
      },
    ],
    updated: "Last updated: June 2025",
  },
};

export default en;
```

- [ ] **Step 2: Write `src/i18n/index.ts`**

```ts
import type { Locale, TranslationContent } from "./types";
import ca from "./content/ca";
import es from "./content/es";
import en from "./content/en";

const dictionaries: Record<Locale, TranslationContent> = { ca, es, en };

export function getTranslations(locale: Locale): TranslationContent {
  return dictionaries[locale];
}

export * from "./config";
export type * from "./types";
```

- [ ] **Step 3: Write the parity test `tests/i18n-parity.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import ca from "../src/i18n/content/ca";
import es from "../src/i18n/content/es";
import en from "../src/i18n/content/en";
import type { TranslationContent } from "../src/i18n/types";

/** Replace every leaf with its type name so structures can be compared across locales. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, shape(v)])
    );
  }
  return typeof value;
}

const all: [string, TranslationContent][] = [
  ["ca", ca],
  ["es", es],
  ["en", en],
];

describe("dictionary parity", () => {
  it("es and en mirror the structure of ca exactly", () => {
    expect(shape(es)).toEqual(shape(ca));
    expect(shape(en)).toEqual(shape(ca));
  });

  it.each(all)("%s has the exact source-site item counts", (_name, t) => {
    expect(t.about.tags).toHaveLength(4);
    expect(t.about.bioHtml).toHaveLength(5);
    expect(t.about.training).toHaveLength(9);
    expect(t.about.societies).toHaveLength(6);
    expect(t.digital.areas).toHaveLength(6);
    expect(t.gallery.artworks).toHaveLength(5);
    expect(t.collaborations.areas).toHaveLength(5);
    expect(t.collaborations.entities).toHaveLength(5);
    expect(t.privacy.sections).toHaveLength(8);
    expect(t.legal.sections).toHaveLength(6);
  });

  it("artwork ids are aligned across locales", () => {
    const ids = ca.gallery.artworks.map((a) => a.id);
    expect(es.gallery.artworks.map((a) => a.id)).toEqual(ids);
    expect(en.gallery.artworks.map((a) => a.id)).toEqual(ids);
  });

  it("privacy policy references Resend, not Formspree", () => {
    for (const [, t] of all) {
      const text = JSON.stringify(t.privacy.sections);
      expect(text).toContain("Resend");
      expect(text).not.toContain("Formspree");
    }
  });
});
```

- [ ] **Step 4: Run all tests and type-check**

```bash
pnpm test && pnpm astro check
```

Expected: all suites PASS, 0 type errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add English dictionary, i18n entrypoint, and cross-locale parity tests"
```
