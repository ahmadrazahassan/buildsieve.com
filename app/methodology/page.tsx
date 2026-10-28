import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { criteria, factItems, factPoints, factLabel } from "@/lib/facts";
import { COST_CEILING_CENTS, COST_FLOOR_CENTS } from "@/lib/score";
import { getCategories } from "@/lib/content";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Methodology: how the Research Score works",
  description: "Criteria, weights, fact lists, price rule and known limits of the Research Score, plus how rankings and the Builder Finder are computed.",
  alternates: { canonical: routes.methodology() },
};

export default function MethodologyPage() {
  return (
    <ProsePage
      title="How the Research Score works"
      href={routes.methodology()}
      lead={`The ${siteConfig.scoreName} (method ${siteConfig.scoreMethodVersion}) is computed by code from sourced facts and prices. Nobody types a score in by hand.`}
    >
      <section>
        <h2>Criteria and weights</h2>
        <ul>
          {criteria.map((c) => (
            <li key={c.id}>
              {c.label}: {Math.round(c.weight * 100)}%
            </li>
          ))}
        </ul>
        <p>The result runs from 0.0 to 10.0 with one decimal. Each profile shows the full derivation, fact by fact.</p>
      </section>
      <section>
        <h2>Points per fact</h2>
        <ul>
          {Object.entries(factPoints).map(([k, v]) => (
            <li key={k}>
              {factLabel[k]}: {v}
            </li>
          ))}
        </ul>
        <p>
          Unknown scores 0 like No, because we only count what a vendor documents. Unknown does not mean a feature is
          missing, and profiles say so. Each criterion&apos;s share is the average of its fact points.
        </p>
      </section>
      <section>
        <h2>Fact lists per category</h2>
        <p>Each tool is scored against the list of the category it is shown in, so an app builder is not marked down for a missing blog.</p>
        {getCategories().map((c) => (
          <div key={c.slug} className="mt-4">
            <p className="font-medium">{c.name}</p>
            <ul>
              {(factItems[c.slug] ?? []).map((i) => (
                <li key={i.id}>
                  {i.label} ({criteria.find((x) => x.id === i.criterion)?.label})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <section>
        <h2>The price rule</h2>
        <p>
          We take the cheapest paid plan with a verified US price, ranked by renewal price, and average its cost over
          36 months, including any intro term. At or below ${COST_FLOOR_CENTS / 100} a month it earns the full 0.8
          price part, falling to 0 at ${COST_CEILING_CENTS["ai-website-builders"] / 100} a month for website builders
          and ${COST_CEILING_CENTS["ai-app-builders"] / 100} a month for app builders. A free plan adds 0.2. Without a
          verified US price, the price part is 0.
        </p>
      </section>
      <section>
        <h2>What the score does not measure</h2>
        <ul>
          <li>Ease of use. It needs hands-on testing, which this site does not do. Profiles show it as not scored.</li>
          <li>Output quality of the AI. Vendors describe it, we cannot verify it from documentation.</li>
          <li>Pros and cons. They are written from the same facts and are not counted twice.</li>
          <li>Undocumented features. A vendor that documents less scores lower until we find a source.</li>
        </ul>
      </section>
      <section>
        <h2>Rankings, best-for lists and the Builder Finder</h2>
        <p>
          Category pages sort by Research Score by default; other sort options are explained above each list. Best-for
          lists are computed from a published rule. The Builder Finder scores every published tool against your
          answers with a fixed function and uses the Research Score only as a tie breaker. Commercial relationships
          never change any of these.
        </p>
      </section>
      <section>
        <h2>Update cycle</h2>
        <p>
          Every price carries its check date. The build fails when a price is older than 60 days or a fact older than
          120 days, so stale data cannot be published.
        </p>
      </section>
    </ProsePage>
  );
}
