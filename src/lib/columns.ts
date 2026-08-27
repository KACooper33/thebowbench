/**
 * The comparison table columns are fixed by PROJECT_PLAN.md section 4.
 *
 * Tables render from these lists, never by hand, so every page in a category
 * shows the same columns in the same order.
 *
 * Each string matches a spec `label` on the product record. A product with no
 * spec for a column renders an em dash, which makes the gap visible.
 */
export const SPEC_COLUMNS: Record<string, readonly string[]> = {
  riser: ['Length', 'Mass weight', 'Weight system', 'Passes 12.2 cm ring'],
  tab: ['Material', 'Face plate', 'Stringwalking marks', 'Left/right'],
  plunger: ['Adjustment type', 'Click detents', 'Spring range'],
  limb: ['Length', 'Draw weight', 'Material'],
  weight: ['Mass weight', 'Thread', 'Material'],
  arrow: ['Spine', 'Diameter', 'Grains per inch'],
  /**
   * Youth and beginner bows, which are bought whole rather than as a riser
   * and limbs.
   *
   * "Takedown" and "Plunger threaded" are here because they answer the two
   * questions a parent actually has. Takedown decides whether heavier limbs
   * can be fitted as a child grows, on the same riser. Plunger threaded
   * decides whether the bow can take the one piece of barebow tuning gear
   * that is legal. No retail listing frames either as a buying decision.
   *
   * "Mass weight" is here for the opposite reason: almost nobody publishes it.
   * Of the eleven bows on this site, one maker states it and one figure was
   * weighed here. The column is mostly em dashes on purpose. A row of gaps is
   * the finding, and it is the same column the riser table leads with, so a
   * reader moving between the two tables compares like with like.
   *
   * It sits after "Draw weight" rather than second, as it does for risers,
   * because a bow buyer decides on draw weight first and a riser has none.
   *
   * "Takedown" and "Limb fitting" are two questions, and they were being
   * answered in one cell. Takedown asks whether the bow comes apart. Limb
   * fitting asks whose limbs go back on, which is the question the beginner
   * takedown page is built around and the one that decides what an upgrade
   * costs. Every row answers Takedown with Yes or No and nothing else.
   *
   * A listing that never mentions a fitting reads "Not stated", not "Not
   * ILF". An omission is not a denial, and the difference is the whole
   * distance between reporting and guessing.
   *
   * "Warranty" is last because it is a commercial fact rather than a physical
   * one, so it sits beside Price and Buy. Like "Mass weight" it is mostly
   * "Not stated", and like "Mass weight" that absence is the finding: of the
   * eight bows on the beginner takedown page, one seller publishes a bow
   * warranty at all. The cell is kept short deliberately. Exclusions, policy
   * wording and the date read live in the support section and the sources,
   * because a table cell is for scanning and a policy is not.
   */
  bow: [
    'Length',
    'Draw weight',
    'Mass weight',
    'Takedown',
    'Limb fitting',
    'Plunger threaded',
    'Warranty',
  ],
};

/** Used when a category has no column list yet. */
export const FALLBACK_COLUMNS: readonly string[] = [];
