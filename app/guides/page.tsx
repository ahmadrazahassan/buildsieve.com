import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blocks";
import { GuideCard } from "@/components/guide-card";
import { getGuides } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Guides to choosing an AI builder",
  description: "Plain guides on what to check before you choose an AI website or app builder: renewal prices, credits and taking your code with you.",
  alternates: { canonical: routes.guides() },
};

export default function GuidesPage() {
  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ name: "Guides", href: routes.guides() }]} />
      <h1 className="mt-8 font-display text-h1 font-medium">What should you know before choosing?</h1>
      <p className="mt-4 max-w-2xl text-body text-muted">Each guide answers one question, with numbers and sources from the vendors&apos; own pages.</p>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {getGuides().map((g) => (
          <GuideCard key={g.slug} guide={g} />
        ))}
      </div>
    </div>
  );
}
