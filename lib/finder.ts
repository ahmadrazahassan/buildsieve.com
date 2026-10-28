import { cheapestPaidPlan } from "./cost.ts";
import { formatCents } from "./format.ts";
import type { BuildType, Tool } from "./schema.ts";

export type FinderAnswers = {
  build: BuildType | null;
  level: "no-code" | "some-code" | "developer" | null;
  ownCode: "must" | "nice" | "no" | null;
  store: "yes" | "no" | null;
  domain: "yes" | "no" | null;
  budget: number | null; // dollars per month after intro prices, 0 = free only, -1 = no limit
  team: "solo" | "small" | "large" | null;
  priority: "speed" | "design" | "seo" | "cost" | "growth" | null;
};

export type FinderMatch = { tool: Tool; points: number; fits: string[]; watch: string[] };

const factYes = (t: Tool, id: string) => ["yes", "paid-add-on"].includes(t.facts[id]?.value ?? "unknown");
const factKnownNo = (t: Tool, id: string) => t.facts[id]?.value === "no";

/** Pure matching function: scores every tool and returns the best three with reasons. */
export function matchTools(tools: Tool[], a: FinderAnswers, scores: Record<string, number>): FinderMatch[] {
  const results = tools.map((tool) => {
    let points = (scores[tool.slug] ?? 0) * 0.5; // research score as a tie breaker
    const fits: string[] = [];
    const watch: string[] = [];

    if (a.build) {
      if (tool.build.includes(a.build)) {
        points += 10;
        fits.push(`It is made for the kind of project you described (${a.build.replace(/-/g, " ")}).`);
      } else {
        points -= 12;
        watch.push(`The vendor does not position it for a ${a.build.replace(/-/g, " ")}.`);
      }
    }

    if (a.level === "no-code" && tool.technicalLevel === "code-first") {
      points -= 6;
      watch.push("It produces real code, so expect to read or fix code now and then.");
    }
    if (a.level === "developer" && tool.output === "code-in-your-repo") {
      points += 4;
      fits.push("It gives you the generated code in a repository you control.");
    }

    if (a.ownCode === "must") {
      if (factYes(tool, "code_export") || factYes(tool, "github_sync")) {
        points += 8;
        fits.push("The vendor documents code export or GitHub sync.");
      } else {
        points -= 10;
        watch.push(
          factKnownNo(tool, "code_export")
            ? "The vendor states code export is not available."
            : "We found no vendor statement on code export, so check before you commit.",
        );
      }
    }

    if (a.store === "yes") {
      if (factYes(tool, "ecommerce") || factYes(tool, "payments")) {
        points += 5;
        fits.push("The vendor lists an online store or payments.");
      } else {
        points -= 4;
        watch.push("We found no vendor statement on built-in selling.");
      }
    }

    if (a.domain === "yes") {
      if (factYes(tool, "custom_domain")) {
        points += 3;
        fits.push("Custom domains are available on paid plans.");
      } else watch.push("We could not confirm custom domain support on the vendor page.");
    }

    const cheapest = cheapestPaidPlan(tool.plans);
    if (a.budget !== null && a.budget >= 0) {
      if (a.budget === 0) {
        if (tool.freePlan) {
          points += 4;
          fits.push("It has a free plan.");
        } else {
          points -= 8;
          watch.push("There is no free plan.");
        }
      } else if (cheapest) {
        const renewal = cheapest.renewalCents ?? cheapest.introCents;
        if (renewal <= a.budget * 100) {
          points += 5;
          fits.push(`The cheapest paid plan renews at ${formatCents(renewal)}/mo, inside your budget.`);
        } else {
          points -= 6;
          watch.push(`The cheapest paid plan renews at ${formatCents(renewal)}/mo, above your budget.`);
        }
      } else {
        watch.push("We could not verify a USD price, so check the cost at checkout.");
      }
    }

    if (a.team === "large" && factYes(tool, "team_workspace")) {
      points += 2;
      fits.push("Workspaces are shared with your team.");
    }

    if (a.priority === "cost" && cheapest) {
      points += Math.max(0, 6 - (cheapest.renewalCents ?? cheapest.introCents) / 1000);
    }
    if (a.priority === "growth" && (factYes(tool, "code_export") || factYes(tool, "github_sync"))) points += 3;
    if (a.priority === "speed" && (factYes(tool, "ai_site_generation") || factYes(tool, "app_from_prompt"))) {
      points += 3;
      fits.push("It generates a first version from a prompt.");
    }
    if (a.priority === "design" && (factYes(tool, "visual_editor") || factYes(tool, "cms_or_blog"))) points += 2;

    return { tool, points, fits, watch };
  });

  return results.toSorted((x, y) => y.points - x.points || x.tool.name.localeCompare(y.tool.name)).slice(0, 3);
}
