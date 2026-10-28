import type { Metadata } from "next";
import { OwnerValue, ProsePage } from "@/components/prose-page";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Contact",
  description: `How to reach ${siteConfig.brandName} for corrections, general questions and partnership requests.`,
  alternates: { canonical: routes.contact() },
};

export default function ContactPage() {
  return (
    <ProsePage title="Contact" href={routes.contact()} lead="Email is the fastest way to reach us. We do not offer a contact form yet.">
      <section>
        <h2>Corrections and editorial questions</h2>
        <p>
          <OwnerValue value={siteConfig.email.editorial} label="Editorial email" />
        </p>
      </section>
      <section>
        <h2>General questions</h2>
        <p>
          <OwnerValue value={siteConfig.email.contact} label="Contact email" />
        </p>
      </section>
      <section>
        <h2>Vendors and partners</h2>
        <p>
          <OwnerValue value={siteConfig.email.partner} label="Partner email" />. Partners cannot buy placements,
          scores or rankings.
        </p>
      </section>
    </ProsePage>
  );
}
