import type { Metadata } from "next";
import { ProsePage } from "@/components/prose-page";
import { routes } from "@/lib/routes";
import { consentServices } from "@/lib/consent";

export const metadata: Metadata = {
  title: "Cookie settings",
  description: "Which cookies and third-party services this site uses, and your choices.",
  alternates: { canonical: routes.cookies() },
  robots: { index: false, follow: true },
};

export default function CookieSettingsPage() {
  return (
    <ProsePage title="Cookie settings" href={routes.cookies()}>
      <section>
        <h2>Services that need your consent</h2>
        {consentServices.length === 0 ? (
          <p>
            None. This site currently uses no cookies or third-party services that need consent, so there is no
            cookie banner. If we add one, it will appear here with equal Accept and Reject buttons.
          </p>
        ) : (
          <ul>
            {consentServices.map((s) => (
              <li key={s.id}>{s.name}</li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2>Global Privacy Control</h2>
        <p>Once any ad or tracking service exists, we will honor Global Privacy Control signals from your browser.</p>
      </section>
    </ProsePage>
  );
}
