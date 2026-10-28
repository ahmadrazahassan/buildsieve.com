import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/blocks";
import { Promo } from "@/components/promo";
import { ToolCard } from "@/components/tool-card";
import { ButtonLink } from "@/components/ui";
import { getAlternatives, getTool, getTools, mainCategory } from "@/lib/content";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return getTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/reviews/[slug]/alternatives">): Promise<Metadata> {
  const tool = getTool((await params).slug);
  if (!tool) return {};
  return {
    title: `${tool.name} alternatives`,
    description: `Other ${mainCategory(tool)?.name ?? "builders"} to consider instead of ${tool.name}, ordered by Research Score.`,
    // noindex until the page has its own editorial text
    robots: { index: false, follow: true },
  };
}

export default async function AlternativesPage({ params }: PageProps<"/reviews/[slug]/alternatives">) {
  const tool = getTool((await params).slug);
  if (!tool) notFound();
  const category = mainCategory(tool);
  const alts = getAlternatives(tool.slug, 8);
  const ad = tool.categories.includes("ai-app-builders") ? "competitors" : "websites";
  return (
    <>
    <div className="container-site py-8">
      <Breadcrumbs
        items={[
          { name: tool.name, href: routes.tool(tool.slug) },
          { name: "Alternatives", href: routes.toolAlternatives(tool.slug) },
        ]}
      />
      <h1 className="mt-8 font-display text-h1 font-medium">Alternatives to {tool.name}</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Other {category?.name.toLowerCase()} we cover, ordered by Research Score. {tool.name} is not ideal for:{" "}
        {tool.notIdealFor}
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alts.map((t) => (
          <ToolCard key={t.slug} tool={t} category={category?.slug} />
        ))}
      </div>
      <div className="mt-10">
        <ButtonLink href={routes.compareTool([tool.slug, ...alts.slice(0, 2).map((a) => a.slug)])}>Compare side by side</ButtonLink>
      </div>
    </div>
    {tool.slug !== "base44" && <Promo ad={ad} from="alternatives" pos={1} className="mb-16" />}
    </>
  );
}
