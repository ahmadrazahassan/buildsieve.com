import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, JsonLd, SourceList } from "@/components/blocks";
import { getGlossary, getTerm } from "@/lib/content";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return getGlossary().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/glossary/[slug]">): Promise<Metadata> {
  const t = getTerm((await params).slug);
  if (!t) return {};
  return { title: `${t.term}: definition`, description: t.definition[0].slice(0, 155), alternates: { canonical: routes.term(t.slug) } };
}

export default async function TermPage({ params }: PageProps<"/glossary/[slug]">) {
  const t = getTerm((await params).slug);
  if (!t) notFound();
  return (
    <article className="container-site py-8">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "DefinedTerm", name: t.term, description: t.definition.join(" ") }} />
      <Breadcrumbs items={[{ name: "Glossary", href: routes.glossary() }, { name: t.term, href: routes.term(t.slug) }]} />
      <h1 className="mt-8 font-display text-h1 font-medium">{t.term}</h1>
      <div className="measure mt-8 space-y-4 text-body">
        {t.definition.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <SourceList sources={t.sources} title="Sources" />
      {t.related.length > 0 && (
        <p className="mt-10 text-small">
          Related:{" "}
          {t.related.map((r, i) => (
            <span key={r}>
              {i > 0 && ", "}
              <Link href={routes.term(r)} className="underline underline-offset-2">
                {getTerm(r)?.term ?? r}
              </Link>
            </span>
          ))}
        </p>
      )}
    </article>
  );
}
