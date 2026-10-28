import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/blocks";
import { CostCalculator } from "@/components/cost-calculator";
import { getTools } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "True cost calculator for AI builders",
  description: "Work out what an AI website or app builder costs over 12 and 36 months, including the renewal price after any intro term.",
  alternates: { canonical: routes.costCalculator() },
};

export default function CostCalculatorPage() {
  const tools = getTools().toSorted((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ name: "Cost calculator", href: routes.costCalculator() }]} />
      <h1 className="mt-8 font-display text-h1 font-medium">What will it cost after the intro price ends?</h1>
      <p className="mt-4 max-w-2xl text-body text-muted">
        Pick a tool, a plan and your seats. We show the total for 12 and 36 months using the vendor&apos;s intro and
        renewal prices. Tools without a verified US price are not listed.
      </p>
      <div className="mt-12">
        <Suspense fallback={<p className="text-muted">Loading the calculator.</p>}>
          <CostCalculator tools={tools} />
        </Suspense>
      </div>
    </div>
  );
}
