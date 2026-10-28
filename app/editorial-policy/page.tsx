import type { Metadata } from "next";
import { OwnerValue, ProsePage } from "@/components/prose-page";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Editorial policy",
  description: "How we research, source, update and correct our profiles of AI website and app builders, and how AI assistance is used in writing.",
  alternates: { canonical: routes.editorial() },
};

export default function EditorialPage() {
  return (
    <ProsePage title="Editorial policy" href={routes.editorial()} lead="Research only, sources on every fact, real dates, and corrections you can request.">
      <section>
        <h2>Research, not hands-on tests</h2>
        <p>
          We do not run hands-on tests and never claim to. Each profile is built from the vendor&apos;s own pricing
          pages, documentation, help center, changelogs and terms, read in their US version where available. Every
          profile says so near the top.
        </p>
      </section>
      <section>
        <h2>Sources and dates</h2>
        <ul>
          <li>Every fact and price stores its source URL and the date we checked it.</li>
          <li>Each review section lists its own sources directly beneath it.</li>
          <li>When a vendor page contradicts itself, we name both values and recommend checking at checkout.</li>
          <li>Vendor marketing claims appear only as attributed quotes, never as our fact.</li>
          <li>When a vendor page is localized and we cannot verify a US price, we show no price rather than convert one.</li>
        </ul>
      </section>
      <section>
        <h2>Update cycle</h2>
        <p>Prices are re-checked at least every 60 days and facts every 120 days. Older data blocks publication.</p>
      </section>
      <section>
        <h2>Corrections</h2>
        <p>
          Found an error? Write to <OwnerValue value={siteConfig.email.editorial} label="Editorial email" />. We fix
          confirmed errors and update the date on the page.
        </p>
      </section>
      <section>
        <h2>How AI assistance is used</h2>
        <p>
          We use AI tools to help draft and check text. Every fact is taken from a source we link, and every published
          page is reviewed by the responsible person before it goes live.
        </p>
      </section>
    </ProsePage>
  );
}
