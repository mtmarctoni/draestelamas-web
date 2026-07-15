import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import type { Locale } from "../i18n";
import { localizePath } from "../i18n";

/** Collection ids are `<locale>/<slug>`; every locale carries the same slugs. */
function blogSlug(post: CollectionEntry<"blog">): string {
  return post.id.split("/")[1] ?? post.id;
}

export function blogPostPath(post: CollectionEntry<"blog">, locale: Locale): string {
  return localizePath(`/blog/${blogSlug(post)}/`, locale);
}

/** Posts for one locale, newest first. */
export async function getBlogPosts(locale: Locale): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog", (entry) => entry.id.startsWith(`${locale}/`));
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Shared getStaticPaths body for the per-locale blog routes. */
export async function getBlogStaticPaths(locale: Locale) {
  const posts = await getBlogPosts(locale);
  return posts.map((post) => ({ params: { slug: blogSlug(post) }, props: { post } }));
}
