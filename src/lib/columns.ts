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
   * The cell uses the sport's own vocabulary for limb fittings: "ILF",
   * "Formula" and "Bolt-down", plus "Not stated" where a seller names none.
   *
   * ILF and Formula are interchange standards, so limbs cross between makers.
   * Bolt-down is not a standard at all: it is the category for limbs that bolt
   * straight to the riser on a pattern the maker chose. Formula appears here
   * for completeness and is not yet used, because it is a high end Hoyt
   * fitting and nothing on the beginner page carries it.
   *
   * "Bolt-down" replaced "Proprietary" on 2 September 2026, and the change
   * fixed an error rather than only renaming things. Proprietary asserts that
   * limbs come from one maker. Bolt-down describes how they attach. Those are
   * not the same claim, and the Southwest Spyder is the proof: it is bolt-down
   * and Southwest publishes that Samick Sage and Journey limbs fit it, so
   * calling it proprietary contradicted its own record.
   *
   * Bolt-down still means limbs must match that pattern. It is a description
   * of the mechanism, not a promise that any bolt-down limb fits.
   *
   * "Not stated" is not a synonym for either. The Black Hunter 60" names no
   * fitting at all, and filling that in would be inference rather than
   * reporting, which is the distinction the paragraph above exists to
   * protect.
   *
   * "Warranty" is last because it is a commercial fact rather than a physical
   * one, so it sits beside Price and Buy. Like "Mass weight" it is mostly
   * "Not stated", and like "Mass weight" that absence is the finding: of the
   * nine bows on the beginner takedown page, one seller publishes a bow
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
