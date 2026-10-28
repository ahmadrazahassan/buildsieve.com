import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/blocks";
import { Finder } from "@/components/finder";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Builder Finder: which AI builder fits your project?",
  description: "Answer eight short questions and get a shortlist of three AI website or app builders, each with a plain explanation of why it fits.",
  alternates: { canonical: routes.finder() },
};

export default function FinderPage() {
  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ name: "Builder Finder", href: routes.finder() }]} />
      <div className="mt-8 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h1 className="font-display text-h1 font-medium">Find your builder</h1>
          <p className="mt-6 text-muted">
            Eight short questions, then a shortlist of three with reasons. Your answers stay in the page address; we
            store nothing. Commercial status never affects the result.
          </p>
        </div>
        <div className="min-w-0 rounded-panel-sm bg-surface p-6 md:p-10 lg:col-span-8">
          <Suspense fallback={<p className="text-muted">Loading the Builder Finder.</p>}>
            <Finder />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
