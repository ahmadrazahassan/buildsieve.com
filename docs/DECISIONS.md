# Decisions

## 2026-10-28 Build all phases in one pass

- Decision: build the complete site now instead of stopping after each phase.
- Reason: the owner asked for the complete website in one go.
- Risk: brand, color, logo and score weights were chosen provisionally without owner approval. All of them live in `site.config.ts`, `app/globals.css`, `components/logo.tsx` and `lib/facts.ts` and can be changed in one place.
- Revisit: at the owner's review.

## 2026-10-28 Stack (versions checked live with `npm view`)

Next.js 16.4.3 (Turbopack, Cache Components on), React 19.3.0, Tailwind CSS 4.3.3, TypeScript 5.9.3, Zod 4.6.7, nuqs 2.10.2, Fuse.js 7.5.0, cmdk 1.1.1, lucide-react 1.62.0, Vitest 5.0.5, Node 24.16.0, pnpm 12.15.0.

- Content Collections not used. Instead `scripts/build-content.ts` parses YAML with `yaml`, validates with Zod `strictObject`, runs the guards and writes `.generated/content.json`. Reason: one fewer dependency, no silent skips or stale cache (pitfall in Section 4.2), errors fail the build. Revisit if content volume grows past a few hundred files.
- Vendor data is stored inside each tool file (`vendor:` block) instead of separate vendor files. Revisit when two tools share a vendor.
- `motion`, react-hook-form, Radix and shadcn/ui not installed: CSS covers the motions, and there are no forms yet. Add them when forms or complex menus arrive.
- `dynamicParams` is not available with Cache Components, so `proxy.ts` rewrites unknown slugs to a path without a route. Verified: unknown URLs return 404.
- Tailwind preflight copied to `app/preflight.css` with system font stacks removed; default theme reset (`--color-*: initial` etc.).
- `@fontsource-variable/inter` 5.3.0 and `@fontsource-variable/google-sans-flex` 5.3.2 used only as the source of the Latin WOFF2 files, which are copied into `app/fonts` and loaded with `next/font/local`. Licenses copied next to them.

## 2026-10-28 Primary color: petrol `#0E7490`

From the three candidates in the brief. Deep green `#0B7A5C` was rejected because it is too close to the positive green used for pros. Contrast (WCAG 2.x), all checked with `lib/contrast.ts`:

| Pair | Ratio |
| --- | --- |
| white on primary `#0E7490` | 5.36 |
| white on primary hover `#0B5A70` | 7.75 |
| primary on bg `#F1F1F1` | 4.74 |
| primary on tint `#E3EFF3` | 4.57 |
| white on ink `#191919` | 17.58 |
| muted `#5C5C5C` on bg | 5.92 |
| positive `#1E7A3A` on white | 5.38 |
| negative `#B42318` on white | 6.57 |
| on-ink muted `#A3A3A3` on ink | 6.97 |

## 2026-10-29 Official vendor logos

Downloaded one official mark per vendor from the vendor's own website, docs site or brand page (sources and dates in `docs/LOGOS.md`), unmodified, stored in `public/logos`. SVGs were checked for scripts and event handlers (none) and are only rendered through `<img>`, which does not run SVG scripts. Replit's main site sits behind a bot check, which we did not try to bypass; its mark comes from docs.replit.com. Revisit: replace app icons with press-kit wordmarks where vendors publish them.

## 2026-10-29 Every outbound vendor link goes through /go/[slug]

- Decision: all "Visit" buttons link to our own `/go/[slug]?from=&pos=` redirect, whether or not an affiliate program exists. The route answers 307 to the affiliate URL when a link in `content/affiliate-links` is active and the `affiliateLinks` flag is on, otherwise to the vendor's website without tracking. Unknown slugs go to the home page, and targets only come from content data, so the route cannot be used as an open redirect.
- Affiliate URLs are written to `.generated/affiliate-links.json`, which only the route handler imports. Page HTML never contains them.
- The "Affiliate link" label and `rel="sponsored nofollow noopener"` appear only when that tool's click can earn a commission; other buttons use `rel="nofollow noopener"`.
- Change from the brief: the brief falls back to the profile for inactive slugs. The owner asked that vendor links always go through the site's redirect, so a visitor who clicks "Visit" still reaches the vendor.

## 2026-10-28 Webflow left out of the first batch

webflow.com/pricing failed twice (timeout, then a header overflow error). Rather than publish a profile from memory, Webflow waits for the next research pass.

## 2026-10-28 Wix shows no price

The Wix plans page served to our location showed GST-inclusive prices and "USD prices displayed for reference only". Per the no-conversion rule, the profile shows no price and explains why; its price part of the score is 0.

## 2026-10-28 Contradictions named, not resolved

- Durable: plan cards show $25 and $49, the comparison table $22 and $41, with no label for billing. Card values stored, both named.
- v0: Plus shows "$30" next to "$90" with no label. $30 stored, both named.

## 2026-10-28 Affiliate links off

No programs approved, so no affiliate URLs exist yet. Superseded on 2026-10-29: buttons now go through `/go/[slug]`.
