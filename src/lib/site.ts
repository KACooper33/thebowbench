/**
 * One place for the facts that repeat across 27 pages.
 *
 * The author name is here, not in 26 frontmatter blocks, so it changes once.
 */

export const SITE = {
  /**
   * Renamed on 15 August 2026, before any domain was bought and before
   * launch. The old name was "Bowman's Bench". allow-old-brand
   *
   * Three reasons. The apostrophe could never appear in the domain, so the
   * brand and the URL never matched. "Bowman's Best" is a Topps trading-card
   * brand, which is the same possessive construction. And a heard name that
   * cannot be spelled costs type-in traffic.
   *
   * "The" is part of the name because it is part of the domain.
   */
  name: 'The Bow Bench',
  url: 'https://thebowbench.com',
  tagline: 'Archery gear for archers who shoot without a sight.',
  author: 'K. Adem Cooper',
  /**
   * The one-line bio in every page footer. The About page carries the longer
   * version.
   *
   * It admits newness on purpose. The authority this site claims is in its
   * method, not in the author's years, and a reader who finds out the truth
   * later trusts nothing else on the page.
   *
   * It says "learning barebow", not "shooting barebow", because as of
   * 18 August 2026 the author has not shot a recurve. This line renders in
   * every page footer, so it must not outrun the About page.
   */
  authorBio:
    'New to archery, learning barebow with my family, and measuring everything along the way.',
} as const;

/**
 * The comparison hubs. The URL uses the search term. The navigation label uses
 * the reader's word. PROJECT_PLAN.md section 3, naming rule.
 *
 * Cut to one hub on 6 September 2026. PROJECT_PLAN.md section 16.3.
 *
 * There were seven: bows, risers, limbs, tabs, plungers, weights, arrows. The
 * MVP keeps a section live only where the author could plausibly hold the
 * equipment within a year, and six of the seven failed that test. Their pages
 * are `draft: true`, not deleted, so a hub returns by adding its path back
 * here and to NAV_GROUPS and clearing the flag on its pages.
 *
 * Removing a hub from this list is what actually takes it off the site.
 * `draft: true` alone only unroutes the pages; the hub would stay in the
 * header, and navGroups() below would throw for a hub in no group.
 */
export const HUBS = [
  { path: 'bows', label: 'Bows' },
] as const;

/** Any link into one of these counts as a route to a comparison page. */
export const COMPARISON_ROUTE_PREFIXES = HUBS.map((hub) => `/${hub.path}/`);

/**
 * How the header nav is grouped.
 *
 * With one hub this is a single plain link, because a group of one renders as
 * a link rather than a menu with one child. The grouping layer stays because
 * it costs nothing and the hubs return: the seven-hub site needed it, and the
 * next one will.
 *
 * This is a navigation layer and nothing more. The URLs do not change and must
 * not: section 3 of the plan says the URL uses the search term while the
 * navigation label uses the reader's word. People search "barebow riser". No
 * one searches "build by component", so a phrase like that belongs in the menu
 * and never in a path.
 *
 * Every path here must also be in HUBS. navGroups() throws both ways: for a
 * group naming a hub that does not exist, and for a hub that no group lists.
 */
export const NAV_GROUPS = [
  { label: 'Bows', paths: ['bows'] },
] as const;

export interface NavGroup {
  label: string;
  hubs: { path: string; label: string }[];
}

/**
 * Resolves the groups against HUBS, and refuses to build on three mistakes:
 * a group naming a hub that does not exist, the same hub in two groups, and a
 * hub that no group lists. That last one is the one worth guarding. Adding a
 * hub to HUBS without adding it to a group would leave a live section with no
 * link to it from any page on the site, and nothing else would complain.
 */
export function navGroups(): NavGroup[] {
  const placed = new Set<string>();

  const groups = NAV_GROUPS.map((group) => ({
    label: group.label,
    hubs: group.paths.map((path) => {
      const hub = HUBS.find((candidate) => candidate.path === path);
      if (!hub) {
        throw new Error(
          `NAV_GROUPS names "${path}", which is not a hub in HUBS. Add the hub first, or fix the path.`,
        );
      }
      if (placed.has(path)) {
        throw new Error(`NAV_GROUPS lists "${path}" in more than one group.`);
      }
      placed.add(path);
      return { path: hub.path, label: hub.label };
    }),
  }));

  const orphans = HUBS.filter((hub) => !placed.has(hub.path));
  if (orphans.length > 0) {
    throw new Error(
      `These hubs are in HUBS but in no NAV_GROUP: ${orphans
        .map((hub) => hub.path)
        .join(', ')}. They would be unreachable from the header.`,
    );
  }

  return groups;
}

/**
 * FTC requires a clear disclosure near every affiliate link.
 *
 * Not rendered as of 6 September 2026. The site has no affiliate programme and
 * no paid link, so this sentence would assert a commission that is not earned.
 * PROJECT_PLAN.md section 16.4.
 *
 * Kept here, and not deleted, because the requirement returns with the first
 * commissioned link. Restoring means uncommenting one render in
 * BaseLayout.astro and one in ComparisonLayout.astro, and it happens BEFORE
 * that link goes live, not after.
 */
export const AFFILIATE_DISCLOSURE =
  'The Bow Bench earns a commission on some links on this page. This costs you nothing and does not change which products are recommended.';
