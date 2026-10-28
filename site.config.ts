// Single source for brand, legal, contact data and feature flags.
// Open values are written in double braces; `pnpm placeholders` lists them.

export const siteConfig = {
  // Provisional: proposal from Phase 0, buildsieve.com returned RDAP 404 (not registered)
  // at rdap.verisign.com on 2026-10-28. The owner decides and registers.
  brandName: "Buildsieve",
  domain: "buildsieve.com",
  url: "https://buildsieve.com",
  tagline: "Independent research on AI website and app builders",
  scoreName: "Buildsieve Research Score",
  scoreMethodVersion: "R1.0",

  owner: {
    name: "{{OWNER_NAME}}",
    country: "{{OWNER_COUNTRY}}",
    businessForm: "{{OWNER_BUSINESS_FORM}}",
    postalAddress: "{{POSTAL_ADDRESS}}",
    responsiblePerson: "{{RESPONSIBLE_PERSON}}",
  },
  email: {
    contact: "{{CONTACT_EMAIL}}",
    editorial: "{{EDITORIAL_EMAIL}}",
    partner: "{{PARTNER_EMAIL}}",
  },
  providers: {
    registrar: "{{REGISTRAR}}",
    mail: "{{MAIL_PROVIDER}}",
    database: "{{DATABASE_PROVIDER}}",
    affiliateNetworks: "{{AFFILIATE_NETWORKS}}",
    adNetwork: "{{AD_NETWORK}}",
    maxAdsPerPage: "{{MAX_ADS_PER_PAGE}}",
  },

  flags: {
    // Forms stay hidden until a mail provider is configured and named in the privacy policy.
    newsletter: false,
    contactForm: false,
    // Off until the owner has approved programs: buttons link to the vendor without tracking.
    affiliateLinks: false,
    ads: false,
    userReviews: false,
    analytics: false,
    // Off until launch content is published (launch checklist item).
    indexing: false,
  },
} as const;

export type SiteConfig = typeof siteConfig;

export function isPlaceholder(value: string): boolean {
  return /^\{\{[A-Z_]+\}\}$/.test(value);
}
