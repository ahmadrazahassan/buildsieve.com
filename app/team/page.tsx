import type { Metadata } from "next";
import { OwnerValue, ProsePage, brand } from "@/components/prose-page";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Team",
  description: `Who is responsible for ${siteConfig.brandName}.`,
  alternates: { canonical: routes.team() },
};

export default function TeamPage() {
  return (
    <ProsePage title="Who is responsible for this site" href={routes.team()}>
      <section>
        <h2>{brand} Editorial Team</h2>
        <p>
          Content is published by the {brand} Editorial Team. The person responsible for all published content is{" "}
          <OwnerValue value={siteConfig.owner.responsiblePerson} label="Responsible person" />.
        </p>
        <p>We list real, named people only. Profiles of team members will appear here once they are confirmed.</p>
      </section>
    </ProsePage>
  );
}
