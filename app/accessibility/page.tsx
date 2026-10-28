import type { Metadata } from "next";
import { OwnerValue, ProsePage } from "@/components/prose-page";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description: `${siteConfig.brandName} aims for WCAG 2.2 AA. Known issues and how to report a barrier.`,
  alternates: { canonical: routes.accessibility() },
};

export default function AccessibilityPage() {
  return (
    <ProsePage title="Accessibility statement" href={routes.accessibility()}>
      <section>
        <h2>Our target</h2>
        <p>
          We aim to meet WCAG 2.2 level AA on every page: keyboard access for every widget, visible focus, sufficient
          color contrast, text alternatives for charts and no information shown by color alone.
        </p>
      </section>
      <section>
        <h2>Known issues</h2>
        <p>An automated and manual audit is scheduled before launch. Results will be listed here.</p>
      </section>
      <section>
        <h2>Report a barrier</h2>
        <p>
          Write to <OwnerValue value={siteConfig.email.contact} label="Contact email" /> and tell us the page and the
          problem.
        </p>
      </section>
    </ProsePage>
  );
}
