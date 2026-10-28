import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/blocks";
import { getGlossary } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Glossary of AI builder terms",
  description: "Plain definitions of the terms you meet on AI builder pricing pages: credits, tokens, renewal price, code export and more.",
  alternates: { canonical: routes.glossary() },
};

export default function GlossaryPage() {
  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ name: "Glossary", href: routes.glossary() }]} />
      <h1 className="mt-8 font-display text-h1 font-medium">What does this term mean?</h1>
      <dl className="mt-12 max-w-4xl divide-y divide-line border-y border-line">
        {getGlossary().map((t) => (
          <div key={t.slug} className="grid gap-2 py-6 md:grid-cols-3 md:gap-8">
            <dt className="font-display text-h3 font-medium">
              <Link href={routes.term(t.slug)} className="hover:text-primary">
                {t.term}
              </Link>
            </dt>
            <dd className="text-muted md:col-span-2">{t.definition[0]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
