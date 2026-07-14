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
    privacyLink: string;
    art13: string;
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
  privacy: { title: string; back: string; sections: LegalSection[]; updated: string };
  legal: { title: string; back: string; sections: LegalSection[]; updated: string };
}
