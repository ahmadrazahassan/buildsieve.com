import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected an ISO date (YYYY-MM-DD)");
const url = z.url();

export const sourceSchema = z.strictObject({
  title: z.string().min(3),
  url,
  accessed: isoDate,
});
export type Source = z.infer<typeof sourceSchema>;

export const factValues = ["yes", "no", "partly", "paid-add-on", "beta", "unknown"] as const;
export type FactValue = (typeof factValues)[number];

export const factSchema = z
  .strictObject({
    value: z.enum(factValues),
    note: z.string().optional(),
    source: url.optional(),
    accessed: isoDate.optional(),
  })
  .refine((f) => f.value === "unknown" || (f.source && f.accessed), {
    message: "Every fact except 'unknown' needs a source URL and access date",
  })
  .refine((f) => !["partly", "paid-add-on", "beta"].includes(f.value) || f.note, {
    message: "'partly', 'paid-add-on' and 'beta' need a note",
  });
export type Fact = z.infer<typeof factSchema>;

export const planSchema = z
  .strictObject({
    name: z.string(),
    billing: z.enum(["monthly", "yearly", "multi-year"]),
    termMonths: z.number().int().positive(),
    introCents: z.number().int().nonnegative(),
    // null only when the vendor states the price never changes (needs renewalNote)
    renewalCents: z.number().int().nonnegative().nullable(),
    renewalNote: z.string().optional(),
    upfrontCents: z.number().int().nonnegative().optional(),
    currencyShown: z.string(),
    perSeat: z.boolean(),
    credits: z.string().optional(),
    limits: z.array(z.string()).default([]),
    note: z.string().optional(),
    source: url,
    accessed: isoDate,
  })
  .refine((p) => p.renewalCents !== null || p.renewalNote, {
    message: "An intro price needs a renewal price or a sourced statement that there is none",
  });
export type Plan = z.infer<typeof planSchema>;

export const reviewSectionSchema = z.strictObject({
  id: z.string().regex(/^[a-z0-9-]+$/),
  heading: z.string(),
  body: z.array(z.string()).min(1),
  sources: z.array(sourceSchema).min(1),
});

export const buildTypes = [
  "business-site",
  "portfolio",
  "online-store",
  "landing-page",
  "blog",
  "web-app",
  "internal-tool",
  "mobile-app",
] as const;
export type BuildType = (typeof buildTypes)[number];

export const audiences = [
  "small-business",
  "freelancer",
  "creator",
  "startup-founder",
  "agency",
  "student",
  "developer",
  "nonprofit",
] as const;

export const toolSchema = z.strictObject({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  status: z.enum(["draft", "published"]),
  verification: z.enum(["verified", "unverified"]),
  website: url,
  // Official logo, downloaded from the vendor's own site; listed in docs/LOGOS.md.
  logo: z
    .strictObject({
      file: z.string().regex(/^\/logos\/[a-z0-9-]+\.(svg|png)$/),
      page: url,
      url,
      accessed: isoDate,
    })
    .optional(),
  vendor: z.strictObject({
    // Only when the vendor's own pages state it; otherwise left out.
    legalName: z.string().optional(),
    parent: z.string().optional(),
    parentSource: url.optional(),
    status: z.enum(["active", "acquired", "shut-down"]),
  }),
  categories: z.array(z.string()).min(1),
  summary: z.string().max(160),
  build: z.array(z.enum(buildTypes)).min(1),
  audience: z.array(z.enum(audiences)).min(1),
  technicalLevel: z.enum(["no-code", "low-code", "code-first"]),
  output: z.enum(["hosted-site", "hosted-site-plus-export", "code-in-your-repo"]),
  freePlan: z.boolean(),
  freePlanLimits: z.string().optional(),
  trialDays: z.number().int().nullable(),
  refundDays: z.number().int().nullable(),
  pricingGap: z.string().optional(),
  pros: z.array(z.string()).min(3).max(6),
  cons: z.array(z.string()).min(3).max(6),
  bestFor: z.string(),
  notIdealFor: z.string(),
  editorial: z.string(),
  centralQuestion: z.string(),
  review: z.array(reviewSectionSchema).min(1),
  facts: z.record(z.string(), factSchema),
  plans: z.array(planSchema).default([]),
  changelog: z
    .array(
      z.strictObject({
        date: isoDate,
        kind: z.enum(["plan", "price", "feature", "name", "owner"]),
        change: z.string(),
        source: url,
      }),
    )
    .default([]),
  published: isoDate,
  lastReviewed: isoDate,
});
export type Tool = z.infer<typeof toolSchema>;

// Affiliate URLs live only in content data (content/affiliate-links), never in page code.
export const affiliateLinkSchema = z.strictObject({
  tool: z.string(),
  network: z.string(),
  url: z.url({ protocol: /^https$/ }),
  subIdParam: z.string().optional(),
  active: z.boolean(),
  added: isoDate,
  checked: isoDate,
  terms: z.string().optional(),
  // Network-hosted ads (for example Impact text links). Pages pick one by id with ?ad=.
  ads: z
    .array(
      z.strictObject({
        id: z.string().regex(/^[a-z0-9-]+$/),
        adId: z.number().int(),
        name: z.string(),
        landingPage: z.url({ protocol: /^https$/ }),
        url: z.url({ protocol: /^https$/ }),
        subIdParam: z.string().optional(),
      }),
    )
    .default([]),
});
export type AffiliateLink = z.infer<typeof affiliateLinkSchema>;

export const categorySchema = z.strictObject({
  slug: z.string(),
  name: z.string(),
  singular: z.string(),
  status: z.enum(["draft", "published"]),
  order: z.number().int(),
  intro: z.string(),
  centralQuestion: z.string(),
  guide: z.array(z.strictObject({ heading: z.string(), body: z.array(z.string()).min(1) })),
  related: z.array(z.string()).default([]),
});
export type Category = z.infer<typeof categorySchema>;

export const comparisonSchema = z.strictObject({
  slug: z.string(),
  title: z.string(),
  tools: z.array(z.string()).min(2).max(3),
  status: z.enum(["draft", "published"]),
  centralQuestion: z.string(),
  description: z.string().max(155),
  intro: z.string(),
  sections: z.array(
    z.strictObject({ heading: z.string(), body: z.array(z.string()).min(1), sources: z.array(sourceSchema).min(1) }),
  ),
  verdict: z.string(),
  published: isoDate,
  updated: isoDate,
});
export type Comparison = z.infer<typeof comparisonSchema>;

export const useCaseSchema = z.strictObject({
  slug: z.string(),
  title: z.string(),
  status: z.enum(["draft", "published"]),
  centralQuestion: z.string(),
  description: z.string().max(155),
  rule: z.strictObject({
    build: z.array(z.enum(buildTypes)).min(1),
    requireFacts: z.array(z.string()).default([]),
    text: z.string(),
  }),
  explanation: z.array(z.string()).min(1),
  published: isoDate,
  updated: isoDate,
});
export type UseCase = z.infer<typeof useCaseSchema>;

export const guideSchema = z.strictObject({
  slug: z.string(),
  title: z.string(),
  tag: z.string(),
  status: z.enum(["draft", "published"]),
  centralQuestion: z.string(),
  description: z.string().max(155),
  intro: z.string(),
  sections: z.array(
    z.strictObject({
      heading: z.string(),
      body: z.array(z.string()).min(1),
      points: z.array(z.string()).optional(),
      tools: z.array(z.string()).optional(),
      sources: z.array(sourceSchema).min(1),
    }),
  ),
  published: isoDate,
  updated: isoDate,
});
export type Guide = z.infer<typeof guideSchema>;

export const glossarySchema = z.strictObject({
  slug: z.string(),
  term: z.string(),
  status: z.enum(["draft", "published"]),
  definition: z.array(z.string()).min(1),
  related: z.array(z.string()).default([]),
  sources: z.array(sourceSchema).min(1),
});
export type GlossaryTerm = z.infer<typeof glossarySchema>;
