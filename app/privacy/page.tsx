import type { Metadata } from "next";
import { OwnerValue, ProsePage } from "@/components/prose-page";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${siteConfig.brandName} handles personal data: hosting, the affiliate redirect, your rights and who to contact.`,
  alternates: { canonical: routes.privacy() },
};

export default function PrivacyPage() {
  const { owner, email } = siteConfig;
  return (
    <ProsePage title="Privacy policy" href={routes.privacy()} lead="We collect as little as possible. This site sets no tracking cookies and loads no third-party content before you agree.">
      <section>
        <h2>Who is responsible</h2>
        <p>
          <OwnerValue value={owner.name} label="Owner name" />, <OwnerValue value={owner.postalAddress} label="Postal address" />.
          Contact: <OwnerValue value={email.contact} label="Contact email" />.
        </p>
      </section>
      <section>
        <h2>Hosting</h2>
        <p>
          The site is hosted by Vercel Inc. (United States). When you visit, Vercel processes technical data such as
          your IP address and browser details to deliver the pages and keep them secure. Legal basis: our legitimate
          interest in operating a secure website. Transfer basis and retention follow Vercel&apos;s data processing
          agreement.
        </p>
      </section>
      <section>
        <h2>Analytics</h2>
        <p>
          {siteConfig.flags.analytics
            ? "We use Vercel Web Analytics (Vercel Inc., United States) to count page views. It sets no cookies and stores nothing in your browser. It records the page address, the referring site, browser, operating system, device type and country. Visitors are counted with a hash of the request that is discarded after one day, so we cannot identify you or follow you across days. Legal basis: our legitimate interest in knowing which pages are useful. Data is kept as Vercel's data processing agreement sets out."
            : "No analytics service is active."}
        </p>
      </section>
      <section>
        <h2>Links to vendors</h2>
        <p>
          Buttons such as &quot;Visit Framer&quot; pass through our redirect at /go/ and then take you to the
          vendor&apos;s website, or to an affiliate network&apos;s tracking link when we have an approved program.
          The redirect logs only the tool, the page area and whether the link was an affiliate link. It does not
          store your IP address, set cookies or read your browser details. Once you leave this site, the
          vendor&apos;s privacy policy applies, and the vendor or an affiliate network may set cookies.
        </p>
      </section>
      <section>
        <h2>Search, Builder Finder and calculators</h2>
        <p>Your answers and selections stay in the page address in your browser. We do not store them.</p>
      </section>
      <section>
        <h2>Email, contact form and newsletter</h2>
        <p>
          There is no contact form or newsletter yet. If you email us, we use your message only to reply and delete it
          when it is no longer needed.
        </p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          Depending on where you live (for example under the GDPR, UK GDPR or CCPA/CPRA), you may have the right to
          access, correct, delete or restrict the use of your data and to complain to a supervisory authority. We do
          not sell or share personal information. Write to <OwnerValue value={email.contact} label="Contact email" />.
        </p>
      </section>
    </ProsePage>
  );
}
