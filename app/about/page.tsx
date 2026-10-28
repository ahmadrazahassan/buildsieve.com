import type { Metadata } from "next";
import Link from "next/link";
import { ProsePage, brand } from "@/components/prose-page";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "About",
  description: `What ${siteConfig.brandName} is, who it is for and how it differs from other builder roundups.`,
  alternates: { canonical: routes.about() },
};

export default function AboutPage() {
  return (
    <ProsePage
      title={`About ${brand}`}
      href={routes.about()}
      lead="Which AI builder gets your site or app live fastest, at a price you can keep paying, without locking you in? This site exists to answer that question."
    >
      <section>
        <h2>What we do differently</h2>
        <ul>
          <li>No intro price without the renewal price next to it.</li>
          <li>A source and a date on every price and fact.</li>
          <li>No claims of testing we did not do.</li>
          <li>A score you can recompute from the facts on the page.</li>
          <li>Gaps stay visible: unknown is shown as unknown, never guessed.</li>
        </ul>
      </section>
      <section>
        <h2>Who it is for</h2>
        <p>
          Small business owners, freelancers, creators, students, non-technical founders and small agencies who want a
          site or app live quickly and want to know the real cost first.
        </p>
      </section>
      <section>
        <h2>Read more</h2>
        <p>
          <Link href={routes.methodology()}>Methodology</Link>, <Link href={routes.editorial()}>Editorial policy</Link>,{" "}
          <Link href={routes.money()}>How we make money</Link>, <Link href={routes.team()}>Team</Link>.
        </p>
      </section>
    </ProsePage>
  );
}
