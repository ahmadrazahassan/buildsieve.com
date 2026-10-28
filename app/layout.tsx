import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SearchPalette } from "@/components/search-palette";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCategories, showDrafts } from "@/lib/content";
import { siteConfig } from "@/site.config";
import "./globals.css";

const inter = localFont({
  src: "./fonts/Inter-latin-wght.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const googleSansFlex = localFont({
  src: "./fonts/GoogleSansFlex-latin-wght.woff2",
  variable: "--font-gsf",
  weight: "100 1000",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.brandName}: AI website and app builders, researched`, template: `%s | ${siteConfig.brandName}` },
  description:
    "Independent research on AI website builders and AI app builders: true cost after intro prices, sourced facts and a transparent Research Score.",
  robots: siteConfig.flags.indexing ? undefined : { index: false, follow: false },
  openGraph: { type: "website", locale: "en_US", siteName: siteConfig.brandName },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#f1f1f1" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  const categories = getCategories().map(({ slug, name, intro }) => ({ slug, name, intro }));
  return (
    <html lang="en-US" className={`${inter.variable} ${googleSansFlex.variable}`}>
      <head>
        {/* Impact checks for a `value` attribute, which the Metadata API cannot emit. */}
        <meta name="impact-site-verification" {...{ value: siteConfig.verification.impact }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only z-50 bg-primary px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3"
        >
          Skip to content
        </a>
        <NuqsAdapter>
          {showDrafts && (
            <p className="bg-ink px-4 py-2 text-center text-small text-white">
              Preview build: drafts are visible. Never deploy this build.
            </p>
          )}
          <SiteHeader categories={categories} />
          <main id="main">{children}</main>
          <SiteFooter />
          <SearchPalette />
        </NuqsAdapter>
        {/* Cookieless, so no consent entry is needed (brief Section 3.6). */}
        {siteConfig.flags.analytics && <Analytics />}
      </body>
    </html>
  );
}
