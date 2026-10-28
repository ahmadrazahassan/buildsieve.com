import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateNote } from "@/components/affiliate";
import { Breadcrumbs, Byline, JsonLd } from "@/components/blocks";
import { ToolCard } from "@/components/tool-card";
import { ButtonLink } from "@/components/ui";
import { getUseCase, getUseCases, listUseCaseTools } from "@/lib/content";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export function generateStaticParams() {
  return getUseCases().map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({ params }: PageProps<"/best-for/[slug]">): Promise<Metadata> {
  const u = getUseCase((await params).slug);
  if (!u) return {};
  return { title: u.title, description: u.description, alternates: { canonical: routes.useCase(u.slug) } };
}

export default async function UseCasePage({ params }: PageProps<"/best-for/[slug]">) {
  const u = getUseCase((await params).slug);
  if (!u) notFound();
  const tools = listUseCaseTools(u);
  return (
    <div className="container-site py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: u.title,
          itemListElement: tools.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: `${siteConfig.url}${routes.tool(t.slug)}` })),
        }}
      />
      <Breadcrumbs items={[{ name: u.title, href: routes.useCase(u.slug) }]} />
      <header className="mt-8 max-w-3xl">
        <h1 className="font-display text-h1 font-medium">{u.title}</h1>
        <p className="mt-6 text-body">{u.centralQuestion}</p>
        <div className="mt-4">
          <Byline updated={u.updated} />
        </div>
      </header>
      <div className="measure mt-10 space-y-4 text-muted">
        {u.explanation.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="mt-10 rounded-card border border-line bg-surface p-6">
        <h2 className="font-medium">Selection rule</h2>
        <p className="mt-2 text-small text-muted">
          {u.rule.text} The list is computed from this rule, never hand picked, and commercial interest never changes
          it.{" "}
          <Link href={routes.methodology()} className="underline underline-offset-2">
            Methodology
          </Link>
        </p>
      </div>
      <AffiliateNote className="mt-6" />
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t, i) => (
          <li key={t.slug} className="min-w-0">
            <ToolCard tool={t} rank={i + 1} />
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href={routes.finder()}>Find your builder</ButtonLink>
        <ButtonLink href={routes.compareTool(tools.slice(0, 3).map((t) => t.slug))} variant="outline">
          Compare these tools
        </ButtonLink>
      </div>
    </div>
  );
}
