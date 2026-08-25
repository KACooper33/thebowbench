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
 * Phase 1 only. /strings/ and /tools/ arrive in Phase 2.
 */
export const HUBS = [
  { path: 'bows', label: 'Complete barebow setups' },
  { path: 'risers', label: 'Risers' },
  { path: 'limbs', label: 'Limbs' },
  { path: 'tabs', label: 'Tabs' },
  { path: 'plungers', label: 'Plungers' },
  { path: 'weights', label: 'Weight systems' },
  { path: 'arrows', label: 'Arrows' },
] as const;

/** Any link into one of these counts as a route to a comparison page. */
export const COMPARISON_ROUTE_PREFIXES = HUBS.map((hub) => `/${hub.path}/`);

/**
 * How the header nav is grouped.
 *
 * Seven hubs plus "Start here" made eight flat links, all competing. Grouping
 * takes the top level to five.
 *
 * This is a navigation layer and nothing more. The URLs do not change and must
 * not: section 3 of the plan says the URL uses the search term while the
 * navigation label uses the reader's word. People search "barebow riser". No
 * one searches "build by component", so that phrase belongs in the menu and
 * never in a path.
 *
 * Keeping it out of the URLs also keeps it cheap. `related_hub` is set on 20
 * pages against the hub paths below, COMPARISON_ROUTE_PREFIXES derives from
 * them, and GuideLayout throws for a `related_hub` it cannot find. Regrouping
 * here touches none of that.
 *
 * A group of one renders as a plain link rather than a menu with a single
 * child. Phase 2 adds /strings/ and /tools/, which belong in Accessories.
 */
export const NAV_GROUPS = [
  { label: 'Complete barebow setups', paths: ['bows'] },
  { label: 'Build by component', paths: ['risers', 'limbs'] },
  { label: 'Accessories', paths: ['tabs', 'plungers', 'weights'] },
  { label: 'Arrows', paths: ['arrows'] },
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

/** FTC requires a clear disclosure near every affiliate link. */
export const AFFILIATE_DISCLOSURE =
  'The Bow Bench earns a commission on some links on this page. This costs you nothing and does not change which products are recommended.';
