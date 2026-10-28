import type { Metadata } from "next";
import { OwnerValue, ProsePage } from "@/components/prose-page";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `Terms for using ${siteConfig.brandName}: information only, prices can change, product names belong to their owners.`,
  alternates: { canonical: routes.terms() },
};

export default function TermsPage() {
  return (
    <ProsePage title="Terms of use" href={routes.terms()}>
      <section>
        <h2>Information, not advice</h2>
        <p>
          Our content is general information to help you compare tools. It is not professional, legal or financial
          advice. Check the vendor&apos;s current terms and prices before you buy.
        </p>
      </section>
      <section>
        <h2>Prices change</h2>
        <p>Every price shows the date we checked it. Vendors change prices and plans often; the price at checkout applies.</p>
      </section>
      <section>
        <h2>Trademarks</h2>
        <p>Product names and logos belong to their owners and are used for identification only.</p>
      </section>
      <section>
        <h2>Operator</h2>
        <p>
          <OwnerValue value={siteConfig.owner.name} label="Owner name" />, <OwnerValue value={siteConfig.owner.country} label="Country" />.
        </p>
      </section>
    </ProsePage>
  );
}
