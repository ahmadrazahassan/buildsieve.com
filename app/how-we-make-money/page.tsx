import type { Metadata } from "next";
import { ProsePage, brand } from "@/components/prose-page";
import { anyAffiliate } from "@/lib/content";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "How we make money",
  description: `How ${siteConfig.brandName} is financed, which partners we have, and what commercial interest can and cannot influence.`,
  alternates: { canonical: routes.money() },
};

export default function MoneyPage() {
  return (
    <ProsePage title="How we make money" href={routes.money()} lead={`${brand} is planned to be financed by affiliate commissions and, later, display ads. No vendor pays for a placement or a score.`}>
      <section>
        <h2>Affiliate links</h2>
        <p>
          When a vendor runs an affiliate program and we join it, a link to that vendor may earn us a commission if
          you sign up. Every such link is labeled &quot;Affiliate link&quot; next to the button, and a short notice
          appears once near the top of the page and in the footer.
        </p>
        <p>
          Every &quot;Visit&quot; button first passes through our own redirect at /go/. If we have an approved
          program with that vendor, the redirect adds the program&apos;s tracking; if not, it sends you straight to
          the vendor&apos;s website without tracking. The redirect records only which tool and which page area was
          clicked, never who clicked.
        </p>
        <p>
          {anyAffiliate()
            ? "Affiliate links are active on this site and labeled next to each button."
            : "Right now we have no active affiliate partners, so no click earns us anything."}
        </p>
      </section>
      <section>
        <h2>Sponsored banners</h2>
        <p>
          Some pages show a banner marked &quot;Sponsored&quot; for a builder whose affiliate program we have joined.
          We write the banner from the same sourced facts as the builder&apos;s profile, and every banner links to
          that profile so you can read the full research, including the cons. A click goes through our /go/
          redirect to the affiliate network&apos;s tracking link. Banners never appear inside comparison tables,
          the Builder Finder, the cost calculator or legal pages, and they never change a score or a ranking.
        </p>
      </section>
      <section>
        <h2>Current partners</h2>
        <p>
          {anyAffiliate()
            ? "Base44, through the Impact affiliate network. More partners will be listed here alphabetically. The order is not a ranking."
            : "None yet. When we add partners, they will be listed here alphabetically. The order is not a ranking."}
        </p>
      </section>
      <section>
        <h2>What commercial interest can never change</h2>
        <ul>
          <li>The Research Score, which is computed by code from sourced facts.</li>
          <li>The order of any ranking or best-for list.</li>
          <li>Builder Finder results.</li>
          <li>Which tools we cover and what we write about them, including their cons.</li>
        </ul>
      </section>
      <section>
        <h2>Ads</h2>
        <p>
          Display ads are switched off. If we switch them on, ads will be labeled &quot;Advertisement&quot; and never
          appear inside comparison tables, the Builder Finder, the cost calculator, legal pages or next to an
          affiliate button. The privacy policy and cookie settings will change in the same update.
        </p>
      </section>
    </ProsePage>
  );
}
