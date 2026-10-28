import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Byline, JsonLd, SourceList } from "@/components/blocks";
import { ButtonLink } from "@/components/ui";
import { getGuide, getGuides, getTool } from "@/lib/content";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export function generateStaticParams() {
  return getGuides().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const g = getGuide((await params).slug);
  if (!g) return {};
  return { title: g.title, description: g.description, alternates: { canonical: routes.guide(g.slug) } };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  const others = getGuides().filter((x) => x.slug !== g.slug);
  return (
    <article className="container-site py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          datePublished: g.published,
          dateModified: g.updated,
          author: { "@type": "Organization", name: `${siteConfig.brandName} Editorial Team` },
        }}
      />
      <Breadcrumbs items={[{ name: "Guides", href: routes.guides() }, { name: g.title, href: routes.guide(g.slug) }]} />
      <header className="mt-8 max-w-4xl">
        <p className="eyebrow text-muted">{g.tag}</p>
        <h1 className="mt-4 font-display text-h1 font-medium">{g.title}</h1>
        <p className="mt-6 text-body">{g.centralQuestion}</p>
        <div className="mt-4">
          <Byline updated={g.updated} />
        </div>
      </header>
      <div className="prose-site measure mt-12 space-y-12">
        <p className="text-body">{g.intro}</p>
        {g.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-h3 font-medium">{s.heading}</h2>
            <div className="mt-4">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {s.points && (
              <ul className="mt-4 list-disc space-y-1 pl-5">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
            {s.tools && (
              <p className="mt-4 text-small">
                Profiles:{" "}
                {s.tools.map((slug, i) => {
                  const t = getTool(slug);
                  return t ? (
                    <span key={slug}>
                      {i > 0 && ", "}
                      <Link href={routes.tool(slug)}>{t.name}</Link>
                    </span>
                  ) : null;
                })}
              </p>
            )}
            <SourceList sources={s.sources} />
          </section>
        ))}
      </div>
      <div className="mt-16 flex flex-wrap gap-3">
        <ButtonLink href={routes.finder()}>Find your builder</ButtonLink>
        <ButtonLink href={routes.costCalculator()} variant="outline">
          Cost calculator
        </ButtonLink>
      </div>
      {others.length > 0 && (
        <aside className="mt-16 border-t border-line pt-8" aria-label="More guides">
          <h2 className="font-display text-h3 font-medium">More guides</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={routes.guide(o.slug)} className="block py-3 hover:text-primary">
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
