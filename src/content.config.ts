import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Layer 1 rule checks. See the scaffold plan, section 5.
 *
 * A schema failure stops the build and names the file. These rules therefore
 * cannot be forgotten, only broken loudly.
 */

/**
 * Every number states where it came from. CLAUDE.md rule 4.
 *
 * 'retailer' was added on 25 August 2026, when the Ghost 62" turned up facts
 * that are neither. 3Rivers Archery answers questions on its own product pages
 * under a "Verified Reply" byline, and those answers carry things the
 * specification does not: which limbs fit the riser, the tiller it is built
 * to, a recommended brace height.
 *
 * That is a third evidence class. It is not our measurement, and it is not the
 * maker publishing a figure. Forcing it into 'maker' would say the
 * manufacturer stated something it did not, which is the kind of quiet
 * inaccuracy this site exists to avoid. Prices already made the same
 * distinction for the same reason.
 *
 * Use it only for a seller stating something on the record. A forum post is
 * not a retailer statement, and a guess is not either.
 */
const sourceMark = z.enum(['measured', 'maker', 'retailer']);

/**
 * A price has a third possible origin that a spec does not.
 *
 * 'maker' is a published list price. 'retailer' is what one shop asked on the
 * day it was checked, which is what a reader actually pays. Calling a shop's
 * price a maker price would be false, so it gets its own value.
 *
 * Specs may now be 'retailer' too, for the same reason. See sourceMark above.
 */
const priceSourceMark = z.enum(['measured', 'maker', 'retailer']);

const spec = z.object({
  label: z.string().min(1),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  source: sourceMark,
});

const products = defineCollection({
  loader: glob({ base: './src/content/products', pattern: '**/*.yaml' }),
  schema: ({ image }) => z.object({
    /** Always the full product name. Components print this, never a pronoun. CLAUDE.md rule 3. */
    name: z.string().min(1),
    maker: z.string().min(1),
    category: z.enum([
      'riser',
      'limb',
      'tab',
      'plunger',
      'weight',
      'arrow',
      'bow',
    ]),
    /** 'example' records are scaffold samples. Remove them before launch. */
    status: z.enum(['example', 'published']).default('published'),
    price: z.object({
      value: z.number().nonnegative(),
      currency: z.string().default('USD'),
      source: priceSourceMark,
      /** A retailer price is only meaningful with the day it was seen. */
      checked_on: z.coerce.date(),
      retailer: z.string().optional(),
    }),
    specs: z.array(spec).min(1),
    /**
     * A product photo, and where the right to publish it came from.
     *
     * Optional, because the site has no licensed photographs yet. A product
     * with no photo renders a plain "no photo yet" box, which is honest.
     *
     * `credit` is the same discipline the numbers use. A photograph is not
     * ours to publish simply because it is on the internet:
     *   own      photographed on our own bench, always preferred
     *   maker    supplied by the manufacturer, with permission
     *   retailer supplied through an affiliate programme that grants the right
     *
     * `alt` is required whenever a photo is present. A product image with no
     * alt text is unusable to a screen reader and invisible to a search engine.
     */
    photo: z
      .object({
        src: image(),
        alt: z.string().min(1),
        credit: z.enum(['own', 'maker', 'retailer']),
      })
      .optional(),
    affiliate: z.object({
      merchant: z.string().min(1),
      /** An invented link cannot pass as a placeholder. CLAUDE.md rule 5. */
      placeholder: z.string().startsWith('[AFFILIATE:'),
      url: z.string().url().optional(),
    }),
    limitation: z.string().min(1),
    suits: z.string().min(1),
    tradeoff: z.string().min(1),
  }),
});

/** PROJECT_PLAN.md section 4: the answer block is the first 60 words. */
const maxWords = (limit: number) => (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length <= limit;

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: z
    .object({
      /** The exact target keyword. The URL uses the search term. */
      title: z.string().min(1),
      /** The reader's word. PROJECT_PLAN.md section 3, naming rule. */
      nav_label: z.string().min(1),
      type: z.enum(['hub', 'comparison', 'head-to-head', 'guide', 'trust']),
      description: z.string().min(1),
      answer_block: z
        .string()
        .refine(maxWords(60), {
          message:
            'answer_block must be 60 words or fewer. PROJECT_PLAN.md section 4.',
        })
        .optional(),
      verdict: z
        .object({
          overall: z.string().min(1),
          budget: z.string().min(1),
          premium: z.string().min(1),
        })
        .optional(),
      /** Product ids, in display order. */
      products: z.array(z.string()).default([]),
      method: z.string().optional(),
      /** One sideways hub link. PROJECT_PLAN.md section 3, link rule 3. */
      related_hub: z.string().optional(),
      faq: z
        .array(z.object({ question: z.string(), answer: z.string() }))
        .default([]),
      /**
       * Outbound citations. PROJECT_PLAN.md section 9 asks for the governing
       * bodies to be cited correctly, and section 7 wants passages an answer
       * engine can verify.
       *
       * `checked_on` records the day the link was last confirmed to resolve.
       * Rulebook URLs carry a version in the path, so they rot when a new
       * version publishes. A dated check makes that visible instead of silent.
       */
      sources: z
        .array(
          z.object({
            /**
             * Anchor target. The page body links a named source with
             * [World Archery Book 3 article 9.3.3](#source-wa-book-3),
             * so a reader can reach the rulebook from the claim itself.
             */
            id: z
              .string()
              .regex(
                /^[a-z0-9-]+$/,
                'source id must be lower case letters, digits and hyphens',
              ),
            title: z.string().min(1),
            url: z.string().url(),
            detail: z.string().optional(),
            checked_on: z.coerce.date(),
          }),
        )
        .default([]),
      /**
       * A page that is written but not ready to publish.
       *
       * Drafts are excluded from the built routes, from the sitemap, from hub
       * child lists and from the homepage. The file stays in the repository
       * and keeps being schema-checked, so a draft cannot rot silently.
       *
       * This exists because an unfinished page is worse than a missing one.
       * A stub that publishes its own placeholder text is thin content in
       * Google's terms, and PROJECT_PLAN.md section 9 warns about exactly that.
       */
      draft: z.boolean().default(false),
      updated_on: z.coerce.date(),
    })
    .superRefine((data, ctx) => {
      const require = (field: string, present: boolean, why: string) => {
        if (present) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: `${field} is required on ${data.type} pages. ${why}`,
        });
      };

      const isComparison =
        data.type === 'comparison' || data.type === 'head-to-head';

      if (isComparison) {
        const why = 'PROJECT_PLAN.md section 4.';
        require('answer_block', data.answer_block !== undefined, why);
        require('verdict', data.verdict !== undefined, why);
        require('method', data.method !== undefined, why);
      }

      /**
       * CLAUDE.md rule 2 covers every page, not only comparison pages.
       * GuideLayout renders answer_block on its own, with no verdict or
       * method, since a guide has no overall, budget and premium pick.
       */
      if (data.type === 'guide') {
        require(
          'answer_block',
          data.answer_block !== undefined,
          'CLAUDE.md rule 2.',
        );
      }

      /**
       * A guide needs a hub to point at, so GuideLayout can render the route to
       * a comparison page. CLAUDE.md rule 6 then holds by construction.
       */
      if (isComparison || data.type === 'guide') {
        require(
          'related_hub',
          data.related_hub !== undefined,
          'PROJECT_PLAN.md section 3, internal link rules 3 and 4.',
        );
      }
    }),
});

export const collections = { products, pages };
