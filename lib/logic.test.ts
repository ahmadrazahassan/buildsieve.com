import { describe, expect, it } from "vitest";
import { contrast } from "./contrast.ts";
import { cheapestPaidPlan, costBreakdown, trueCost } from "./cost.ts";
import { matchTools } from "./finder.ts";
import { formatCents, formatDate } from "./format.ts";
import { resolveGo } from "./affiliate.ts";
import { checkAffiliateLinks, checkGuards, lintCopy } from "./guards.ts";
import type { Plan, Tool } from "./schema.ts";
import { costRatio, researchScore } from "./score.ts";

const plan = (over: Partial<Plan> = {}): Plan => ({
  name: "Demo",
  billing: "multi-year",
  termMonths: 48,
  introCents: 249,
  renewalCents: 1099,
  currencyShown: "USD",
  perSeat: false,
  limits: [],
  source: "https://example.com/pricing",
  accessed: "2026-10-28",
  ...over,
});

// Fictitious demo tool for tests only.
const tool = (over: Partial<Tool> = {}): Tool => ({
  slug: "demo",
  name: "Demo Builder",
  status: "published",
  verification: "verified",
  website: "https://example.com",
  vendor: { status: "active" },
  categories: ["ai-app-builders"],
  summary: "Demo",
  build: ["web-app"],
  audience: ["developer"],
  technicalLevel: "low-code",
  output: "code-in-your-repo",
  freePlan: true,
  trialDays: null,
  refundDays: null,
  pros: ["a", "b", "c"],
  cons: ["a", "b", "c"],
  bestFor: "x",
  notIdealFor: "x",
  editorial: "x",
  centralQuestion: "x",
  review: [],
  facts: {},
  plans: [plan({ billing: "monthly", termMonths: 1, introCents: 2500, renewalCents: 2500 })],
  changelog: [],
  published: "2026-10-28",
  lastReviewed: "2026-10-28",
  ...over,
});

describe("format", () => {
  it("formats USD from cents", () => {
    expect(formatCents(123456)).toBe("$1,234.56");
    expect(formatCents(2500)).toBe("$25");
  });
  it("formats US dates in UTC", () => expect(formatDate("2026-10-28")).toBe("October 28, 2026"));
});

describe("true cost", () => {
  it("uses intro price during the term and renewal after it", () => {
    const p = plan({ termMonths: 6 });
    expect(trueCost(p, 12)).toBe(6 * 249 + 6 * 1099);
  });
  it("covers a 48-month term in year three", () => {
    expect(costBreakdown(plan()).year3Cents).toBe(36 * 249);
  });
  it("uses the stated up-front charge for yearly plans", () => {
    const yearly = plan({ billing: "yearly", termMonths: 12, introCents: 2083, renewalCents: 2083, upfrontCents: 25000 });
    expect(trueCost(yearly, 12)).toBe(25000);
    expect(trueCost(yearly, 36)).toBe(75000);
  });
  it("multiplies per-seat plans", () => {
    expect(trueCost(plan({ perSeat: true, termMonths: 1, renewalCents: 249 }), 12, 3)).toBe(12 * 249 * 3);
  });
  it("picks the cheapest paid plan by renewal price", () => {
    const a = plan({ name: "A", introCents: 100, renewalCents: 2000 });
    const b = plan({ name: "B", introCents: 900, renewalCents: 900 });
    expect(cheapestPaidPlan([a, b])?.name).toBe("B");
  });
});

describe("research score", () => {
  it("scores unknown facts as zero", () => {
    const r = researchScore(tool(), "ai-app-builders");
    expect(r.criteria.find((c) => c.id === "ai")?.ratio).toBe(0);
  });
  it("counts yes as 1 and partly as 0.5", () => {
    const src = { source: "https://example.com", accessed: "2026-10-28" };
    const r = researchScore(
      tool({
        facts: {
          app_from_prompt: { value: "yes", ...src },
          edits_by_chat: { value: "partly", note: "n", ...src },
          visual_editor: { value: "no", ...src },
        },
      }),
      "ai-app-builders",
    );
    expect(r.criteria.find((c) => c.id === "ai")?.ratio).toBeCloseTo(0.5);
  });
  it("gives no price points without a verified USD price", () => {
    expect(costRatio(null, "ai-app-builders", false).ratio).toBe(0);
  });
  it("stays between 0 and 10", () => {
    const s = researchScore(tool(), "ai-app-builders").score;
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(10);
  });
});

describe("finder", () => {
  it("prefers tools that document code export when ownership is a must", () => {
    const src = { source: "https://example.com", accessed: "2026-10-28" };
    const a = tool({ slug: "a", name: "A", facts: { code_export: { value: "yes", ...src } } });
    const b = tool({ slug: "b", name: "B" });
    const res = matchTools(
      [b, a],
      { build: "web-app", level: null, ownCode: "must", store: null, domain: null, budget: null, team: null, priority: null },
      {},
    );
    expect(res[0].tool.slug).toBe("a");
    expect(res[1].watch.join(" ")).toMatch(/no vendor statement/);
  });
});

describe("guards", () => {
  const base = { categories: [], comparisons: [], useCases: [], guides: [], glossary: [], today: "2026-10-28" };
  it("fails stale prices", () => {
    const t = tool({ categories: [], plans: [plan({ accessed: "2026-07-01" })] });
    expect(checkGuards({ ...base, tools: [t] }).join()).toMatch(/older than 60 days/);
  });
  it("fails future dates", () => {
    const t = tool({ categories: [], published: "2027-01-01" });
    expect(checkGuards({ ...base, tools: [t] }).join()).toMatch(/in the future/);
  });
  it("fails duplicate slugs", () => {
    expect(checkGuards({ ...base, tools: [tool({ categories: [] }), tool({ categories: [] })] }).join()).toMatch(/duplicate/);
  });
  it("fails unknown categories", () => {
    expect(checkGuards({ ...base, tools: [tool()] }).join()).toMatch(/unknown category/);
  });
  it("fails a published tool without plans or an explanation", () => {
    expect(checkGuards({ ...base, tools: [tool({ categories: [], plans: [] })] }).join()).toMatch(/pricingGap/);
  });
});

describe("copy lint", () => {
  it("rejects test claims", () => expect(lintCopy("We tested it for a week")).not.toHaveLength(0));
  it("rejects banned phrases", () => expect(lintCopy("A seamless editor")).not.toHaveLength(0));
  it("rejects em dashes", () => expect(lintCopy("fast — cheap")).not.toHaveLength(0));
  it("rejects British spellings", () => expect(lintCopy("pick a colour")).not.toHaveLength(0));
  it("accepts plain copy", () => expect(lintCopy("Pro costs $25 a month.")).toHaveLength(0));
});

describe("contrast", () => {
  it("passes AA for white on the primary and on ink", () => {
    expect(contrast("#FFFFFF", "#0B7A5C")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#FFFFFF", "#191919")).toBeGreaterThanOrEqual(4.5);
  });
  it("passes AA for muted text on bg and surface", () => {
    expect(contrast("#5C5C5C", "#F1F1F1")).toBeGreaterThanOrEqual(4.5);
    expect(contrast("#5C5C5C", "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });
});

describe("affiliate redirect", () => {
  const link = { tool: "demo", network: "Demo network", url: "https://partner.example.com/t?id=1", subIdParam: "sub", active: true, added: "2026-10-29", checked: "2026-10-29" };
  const base = { slug: "demo", from: "profile", pos: "2", tool: tool(), links: [link], enabled: true, origin: "https://site.test" };
  it("sends active affiliate links to the program URL with a whitelisted sub id", () => {
    const r = resolveGo(base);
    expect(r.kind).toBe("affiliate");
    expect(r.url).toBe("https://partner.example.com/t?id=1&sub=profile-2");
  });
  it("drops unknown places and non-numeric positions from the sub id", () => {
    expect(resolveGo({ ...base, from: "<script>", pos: "x" }).url).toContain("sub=unknown-0");
  });
  it("sends the visitor to the vendor site without tracking when the flag is off", () => {
    expect(resolveGo({ ...base, enabled: false })).toEqual({ url: "https://example.com", kind: "direct" });
  });
  it("sends the visitor to the vendor site when the link is inactive", () => {
    expect(resolveGo({ ...base, links: [{ ...link, active: false }] }).kind).toBe("direct");
  });
  it("never redirects off-site for unknown slugs", () => {
    expect(resolveGo({ ...base, slug: "nope", tool: undefined })).toEqual({ url: "https://site.test/", kind: "unknown" });
  });
  it("guards against stale active links and unknown tools", () => {
    expect(checkAffiliateLinks([{ ...link, checked: "2026-07-01", added: "2026-07-01" }], [tool()], "2026-10-29").join()).toMatch(/not checked/);
    expect(checkAffiliateLinks([{ ...link, tool: "ghost" }], [tool()], "2026-10-29").join()).toMatch(/unknown tool/);
  });
});
