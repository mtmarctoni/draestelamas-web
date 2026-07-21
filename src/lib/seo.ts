/**
 * Resolves the `robots` meta directive for a page.
 *
 * - Non-indexable environments (staging / preview): everything is
 *   `noindex, nofollow`, regardless of per-page intent.
 * - Indexable environment (production): pages opt out of the index
 *   individually via `noindex` (e.g. legal / privacy) while staying
 *   crawlable so their links are still followed.
 */
export function robotsDirective(envIndexable: boolean, noindex?: boolean): string {
  if (!envIndexable) return "noindex, nofollow";
  return noindex ? "noindex, follow" : "index, follow";
}
