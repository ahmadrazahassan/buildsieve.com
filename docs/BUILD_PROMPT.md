# Build Prompt: Global AI Website and App Builder Review Site

This is the complete A to Z prompt for Claude Code for a new, separate project. It follows the structure of `GENERAL_BUILD_PROMPT.md` and carries over every lesson from the sister project Stackwahl (a German software review site, `C:\Users\Ahmed\Music\PROJECTS\gem2`). Sections 3, 4 and 13 are hard rules.

How to use:

1. Create an empty project folder and save this file there as `docs/BUILD_PROMPT.md`.
2. Create a `CLAUDE.md` with one line: `Read docs/BUILD_PROMPT.md before any work. Sections 3, 4 and 13 are hard rules.`
3. Start Claude Code with:

> Read docs/BUILD_PROMPT.md completely. Execute Phase 0. At the end of the phase stop, report what you built, list every open placeholder and every question, and wait for my go.

---

## 0. Project brief

| Field                      | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Concept                    | An independent, global, English language review and comparison site for AI website builders and AI app builders. Two launch categories: **AI website builders** (tools that generate and host a website from a prompt or a few answers, for example Wix, Squarespace, Framer, Webflow, Hostinger Website Builder, GoDaddy Airo, Durable, 10Web, B12, Jimdo, Strikingly, Dorik) and **AI app builders** (prompt-to-app tools that generate a working web app with code, for example Lovable, Bolt.new, v0, Replit Agent, Base44, Bubble, Softr, Glide). Every name in this list must be verified live before it is used (Section 3.5). Every tool gets a researched profile with features, true cost, limits, ownership and export facts, pros, cons and alternatives. A Builder Finder recommends the best fit for what the visitor wants to build. |
| Purpose                    | Generate qualified clicks and sign ups for builder vendors through affiliate programs (the owner applies; links come later), grow a newsletter, and later earn display ad revenue. Success = affiliate conversions, Finder completions, newsletter subscribers, organic rankings for English builder keywords ("best AI website builder", "Lovable vs Bolt", "Framer pricing", "Wix alternatives").                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Audience                   | A global, non specialist audience: small business owners, freelancers, creators, consultants, students, non technical founders and small agencies. They want a site or an app live quickly, at a price they can keep paying after the intro offer ends, and without getting locked in. They decide which tool to try or buy.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Core question              | "Which AI builder gets my site or app live fastest, at a price I can keep paying, without locking me in?"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Business model             | Affiliate commissions (often recurring), newsletter, and later display ads behind a feature flag (off at launch). No sponsored placements, no paid rankings.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Market and language        | Global. US English (American spelling), plain and friendly, second person "you". Currency USD (`$1,234.56`), US date format in prose (`October 28, 2026`), ISO dates in data. Where a vendor shows no USD price, the original currency is shown with a note; Claude never converts currencies and presents the result as a vendor price.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Content types              | Tool profiles, category pages with ranked lists, head to head comparisons, alternatives pages, pricing pages, "Best for" use case pages (for example "Best AI website builder for restaurants"), guides, glossary, Builder Finder results, team page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Wanted functions           | Research score with full derivation, Builder Finder, comparison tool (2 or 3 tools), true cost calculator (intro price vs. renewal price, credits), filters and sorting, search with command palette, affiliate redirect system, contact form, newsletter with double opt in, display ad slots behind a flag, cookie consent driven by a service list. User reviews behind a flag, off at launch.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Brand                      | Name and domain: `{{BRAND_NAME}}`, `{{DOMAIN}}`. Not chosen yet. In Phase 0 Claude proposes 6 to 8 short, pronounceable `.com` names (no "AI" prefix or suffix cliché, no vendor trademark inside the name), checks each one live (RDAP or a registrar lookup) and reports the result with date and source. Claude never claims a domain is free without that live check; the owner registers it. Tone: calm, expert, honest, friendly, no hype.                                                                                                                                                                                                                                                                                                                                                                                                    |
| Legal owner                | `{{OWNER_NAME}}`, country `{{OWNER_COUNTRY}}`, business form `{{OWNER_BUSINESS_FORM}}`, contact email `{{CONTACT_EMAIL}}`, editorial email `{{EDITORIAL_EMAIL}}`, partner email `{{PARTNER_EMAIL}}`, postal address `{{POSTAL_ADDRESS}}` (needed in newsletter emails, see Section 9), responsible person `{{RESPONSIBLE_PERSON}}`. Stored only in `site.config.ts`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Third parties              | Hosting: Vercel. Domain registrar and DNS: `{{REGISTRAR}}`. Email provider: `{{MAIL_PROVIDER}}` (built behind a provider interface with a local outbox). Database for newsletter consent: `{{DATABASE_PROVIDER}}`. Analytics: cookieless (Vercel Web Analytics by default). Affiliate networks: `{{AFFILIATE_NETWORKS}}` (vendor programs, Impact, PartnerStack, CJ, Awin or others, decided after approval). Ads network: `{{AD_NETWORK}}` (later). Payment provider: none.                                                                                                                                                                                                                                                                                                                                                                        |
| Competitors and references | Study for structure and standards, never copy text or design: Tooltester, WebsiteSetup, Website Builder Expert, Zapier blog builder roundups, G2 and Capterra builder categories, Product Hunt, There's An AI For That, Futurepedia. Note what they do badly (unlabeled affiliate lists, stale prices, intro prices without renewal prices, "tested" claims without evidence) and do the opposite.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Out of scope               | User accounts and login, payments, a vendor dashboard, sponsored or paid rankings, an AI chatbot on the site, AI generated images or screenshots, fake or purchased reviews, "AI style" design (Section 13.12), any UI language other than English, hands-on tests (this site is research only, Section 3.3).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

Every brand, legal and feature flag value lives in ONE file, `site.config.ts`. Open placeholders are written as `"{{NAME}}"` and a helper script (`pnpm placeholders`) lists them until they are filled. Claude never invents business, legal or contact facts.

---

## 1. Your role and working method

You are four senior people in one and you switch hats on purpose:

1. **Senior full stack engineer.** Typed, tested, accessible, fast production code. Read the current official docs of every framework before using an API, because the installed version can differ from your memory.
2. **Senior design engineer.** Implement the design brief in Section 13 exactly. Do not invent a different look and do not fall back to generic template or "AI" styling.
3. **Senior native English content lead** for web building tools. You write like an experienced tech editor who has followed website builders for ten years and understands hosting, domains, SEO basics, ecommerce, code export, credits and token pricing. Never like a marketing bot.
4. **Senior growth and trust strategist.** SEO, conversion and credibility, with honest disclosure of every commercial interest.

Working agreements:

- **Understand first.** Study this brief and the references, then propose the information architecture (Section 7) and the brand names, and wait for approval.
- **Plan before coding.** Write a short plan into `docs/PLAN.md` at the start of each phase.
- **Log decisions** in `docs/DECISIONS.md`: date, decision, reason, alternatives, when to revisit. Incidents get their own entry (what happened, fix, rule).
- **Track content status** (verified, draft, missing) in `docs/CONTENT_STATUS.md`.
- **Placeholders, never inventions.** Missing legal data, links, photos or facts get a named placeholder and a line in the phase report.
- **Small commits.** Initialise git in Phase 0. Never push to a remote unless the owner asks. Fetch the remote first when you do.
- **Stop after every phase**, report, list open placeholders and questions, wait for approval.
- **When the owner asks for something that breaks a rule** (for example backdating articles, hiding a legally required detail, a "tested" label), explain the risk in two or three sentences, offer the compliant alternative, and log the owner's final decision in `docs/DECISIONS.md`.

### 1.1 Sister project

The Stackwahl project at `C:\Users\Ahmed\Music\PROJECTS\gem2` solved many of the same engineering problems. You may read it for engineering patterns only: the content validation script, build guards and their tests, the copy lint architecture (TypeScript AST), the research score module, the affiliate redirect route, the consent module, the Finder state handling, the CSS audit script, the proxy that returns real 404s. Re-read every pattern against the current framework docs before reusing it, and install every package fresh at its latest version (Section 4). Never copy its German content, brand, colors, logos, screenshots or legal texts. Its `docs/DECISIONS.md` explains why each pattern exists.

---

## 2. Mission

Write this section yourself in `docs/PLAN.md` (five to ten lines), based on this direction:

{{BRAND_NAME}} helps people choose an AI website or app builder with confidence. It answers "Which AI builder gets my site or app live fastest, at a price I can keep paying, without locking me in?" with independent, sourced profiles, a research score whose every point is traceable to a source, honest true cost numbers (intro price, renewal price, credits and their limits) and a Builder Finder that turns a short description of the project into an explained shortlist. It earns money through clearly labeled affiliate links that never influence scores or order. It beats the existing roundups by being calmer, faster, more transparent and more current: no fake "we tested" claims, no intro price without the renewal price, no invented numbers, a visible date and source on every price and fact.

---

## 3. Non negotiable rules (they override everything else)

1. **Language and locale.** Every user facing string is US English. USD, US formats (`$1,234.56`, `October 28, 2026`, `20%`). No other language in the UI, alt texts, metadata, error messages or emails. Product names stay exactly as the vendor writes them (Bolt.new, v0, Base44).
2. **No fabrication.** Never invent reviews, testimonials, quotes, user counts, awards, test results, statistics, prices, features, team members or credentials. Vendor marketing claims (for example "used by 2 million builders") appear only as attributed quotes with source and date, never as our fact.
3. **Research only, honest wording.** This site does not run hands-on tests. Never write "tested", "we tested", "hands-on", "we tried", "in our test", "we built a site with", "after using it for", "our experience" or similar, in content, UI, metadata or structured data. Say "researched" and explain the basis (vendor pricing pages, documentation, help center, changelogs, terms). The word "review" is allowed for an editorial review of documented facts, and every profile states its basis near the top ("Researched, not hands-on tested. Based on the vendor's own pages as of {date}."). A section without real data is hidden, never filled with filler, zeros or "coming soon".
4. **Disclosure.** Every affiliate link is labeled next to the content it affects ("Affiliate link", with a short explanation linked to `/how-we-make-money`) and carries `rel="sponsored nofollow noopener"`. A short commission notice appears once near the top of every page that has affiliate links, and once in the footer. Commercial interest never changes a score, a ranking, a Finder result or an award, and the pages say so.
5. **Availability and names.** AI builders change names, plans and owners fast. Verify every product's current name, owner, status and plans live before writing. Check especially: whether a product still exists or was merged, acquired or renamed; whether a plan or AI feature is still sold; whether a feature is generally available or only in beta or waitlist (beta features are labeled "Beta" with source). Products that are shut down or not open to new customers are left out.
6. **Privacy by default.** No request to any third party before consent where the law requires consent. Fonts and logos are self hosted. Analytics cookieless. No embedded YouTube, maps or social widgets without a click to load placeholder. Collect the minimum data for a stated purpose.
7. **Accessibility.** WCAG 2.2 AA on every template.
8. **Real assets only.** No lorem ipsum, no fake logos, no AI generated people or images, no AI generated or mocked up product screenshots. Vendor logos only from official press kits or websites, with source in `docs/LOGOS.md`. Screenshots and videos only from official vendor material (Section 13.11), with source in `docs/MEDIA.md`.
9. **Secrets.** Never commit keys, tokens or `.env` files (only `.env.example` without values). Check every staged diff for secrets before committing.
10. **Docs match code.** When a change adds a processor, a cookie, a form, an ad network or a partner, the privacy text and the disclosure texts change in the same commit.
11. **Real dates.** Publication and update dates are the real ones. Never backdate content.
12. **Verify before you claim.** Run the checks (Section 12) and say plainly what passed, what failed and what you could not check.

---

## 4. Technology policy: always the latest stable

**Use the very latest stable version of every package, tool and runtime, verified live on the day you install it. Never copy versions from this file, from the sister project or from your memory.**

1. **Look up each version live** with `npm view <package> version` and `npm view <package> dist-tags`. Use the `latest` tag only. Never canary, beta, RC, `next` or `experimental`. Check the Node.js Active LTS and the newest stable pnpm the same way.
2. **Scaffold with the official latest tooling** (`pnpm create next-app@latest`, then `pnpm dlx shadcn@latest` if used). Accept the newest defaults.
3. **Read the bundled docs** in `node_modules/next/dist/docs/` and the changelog before writing code. Heed deprecations. Follow any `AGENTS.md` block the framework ships.
4. **Check compatibility** after installing: peer check, typecheck, lint, production build.
5. **Resolve conflicts the right way.** If the very latest version breaks something, use the newest version that works, never an old one out of habit, and never weaken a security policy. Log the reason and a "revisit when" note in `docs/DECISIONS.md`.
6. **Pin exact versions** in `package.json`, commit the lockfile, pin `packageManager` and `engines`.
7. **Re-check at the end of every phase** with `pnpm outdated` and report.
8. **Minimum release age.** If a package is blocked by the package manager's release age policy, do not disable the policy; use the newest version outside the window and note it.
9. **Prefer built-in platform features** over extra dependencies. Every added package needs a one line reason.

### 4.1 Capability map

Core:

| Capability                  | Choice                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| Runtime and package manager | Node.js Active LTS, pnpm                                                                     |
| Framework                   | Next.js App Router, Turbopack, React Server Components, React, React Compiler                |
| Language                    | TypeScript strict                                                                            |
| Styling                     | Tailwind CSS with CSS first theme tokens (Section 13.3)                                      |
| Validation                  | Zod for every input, content file and environment value (`strictObject` everywhere, see 4.2) |
| Lint, format                | ESLint flat config, Prettier                                                                 |
| Tests                       | Vitest, Playwright, axe                                                                      |
| Fonts and images            | `next/font/local` with self hosted WOFF2 files, `next/image`                                 |
| SEO                         | Metadata API, `sitemap`, `robots`, `manifest`, Open Graph images                             |

Needed by this brief:

| Need               | Choice                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| UI primitives      | Radix UI or shadcn/ui, fully restyled to Section 13                                                       |
| Class variants     | class-variance-authority, clsx, tailwind-merge (teach `cn()` the custom utilities)                        |
| Animation          | the `motion` library, loaded lazily, only for the motions in Section 13.8 (or CSS only if that is enough) |
| Charts             | hand made SVG (score bars, cost over time), always with a table alternative                               |
| Icons              | lucide-react, rules in Section 13.9                                                                       |
| File based content | Content Collections with YAML for structured records (block style only) and Zod schemas                   |
| Dynamic data       | newsletter consent (and later user reviews): Postgres through an ORM, provider `{{DATABASE_PROVIDER}}`    |
| Forms              | react-hook-form with Zod resolvers, server actions                                                        |
| URL state          | nuqs (filters, comparison, Builder Finder)                                                                |
| Search             | Fuse.js with a build time index, cmdk command palette                                                     |
| Email              | provider interface; concrete provider `{{MAIL_PROVIDER}}` added later                                     |
| Analytics          | Vercel Web Analytics (cookieless)                                                                         |
| Server only code   | `server-only`                                                                                             |

### 4.2 Known pitfalls (from the sister project; re-test, newer versions may have fixed them)

- `next/font/google` under Turbopack emitted system fallback faces. Use `next/font/local` with your own WOFF2 subsets.
- The Tailwind preflight writes system font stacks. Copy it into the project, remove them, reset Tailwind's default theme (`--color-*: initial`, `--radius-*: initial`), and add a `check:css` script that fails on any font family other than the two brand fonts and on any color outside the tokens.
- `tailwind-merge` can drop a line height class placed before a custom size class. Teach `cn()` your custom utility names.
- A server component cannot pass functions to a client component.
- With Cache Components, an empty `generateStaticParams` fails the build. Return a placeholder param and call `notFound()` for it.
- With Cache Components, a dynamic page that calls `notFound()` after streaming started keeps status 200. Check slugs in `proxy.ts` against visible content and rewrite unknown ones to a prerendered not found route, so unknown URLs return a real 404.
- Content Collections can skip documents with schema errors silently, and its cache can hide schema changes. The validation script clears the cache, turns every event into a failure and runs before `next build`.
- **YAML flow style splits values at commas** (`{ note: Costs $1,200 a year }` stored "Costs $1" plus a stray key). Content YAML is block style only, `content:validate` rejects flow style, and every Zod schema is `strictObject` so unknown keys fail. Quote values that start with a special character.
- Scripts and app code that share modules import with explicit `.ts` extensions and no path alias.
- Build time values that change rendered content must be inlined at build time to avoid hydration errors.
- `next/og` cannot read variable fonts. Generate static instances for share images.
- Every `overflow-x-auto` container also gets `position: relative`; scrollable regions without focusable content get `role="region"`, an `aria-label` and `tabIndex={0}`. Visually hidden text inside a scrolling table otherwise widens the page on phones.
- A giant decorative footer wordmark with tight line height can sit over the footer links and swallow clicks. Make it `pointer-events-none` and lift the links above it. An E2E test clicks every footer link.
- A Finder "Show results" link can fire before nuqs has written the last step to the URL. Wait for the pending URL write before navigating.
- Date guards compare with today's date in UTC.
- Grid children get `min-w-0`; long words and product names must not overflow at 390 px.
- **Vendor pricing pages are localized by IP.** From some locations a page shows another currency or other prices. Record the currency and region shown, prefer the vendor's US price (a US pricing page or currency switch on the page), and if USD cannot be verified, store the shown currency with a note or leave the price out. Never convert.
- A forgotten `noindex` from Phase 0 blocks the whole site. "Switch indexing on" is on the launch checklist.

---

## 5. Architecture principles

1. **Content first.** Content lives in typed YAML files (and the database for dynamic data) behind `lib/content`. Pages call `getTool(slug)`, `getCategory(slug)`, `getAlternatives(slug)` and never read files directly.
2. **Server by default.** Client components only for interactive islands (Finder, comparison picker, filters, search palette, forms, tabs, cost calculator).
3. **One config file.** `site.config.ts` holds brand, legal data, contact data and feature flags (`newsletter`, `contactForm`, `affiliateLinks`, `ads`, `userReviews`, `analytics`, `indexing`).
4. **Pure logic in plain modules** with unit tests: price and cost formatting, true cost calculation, research score, Finder matching, filter logic, affiliate URL resolution, slug and URL building, consent state.
5. **One URL builder** (`lib/routes.ts`) builds every internal link.
6. **Navigation reflects what exists.** Header and footer links are built from feature flags and existing content, so no link points to a page that does not exist. An E2E test opens every header and footer link and expects status 200.
7. **Route groups.** Public pages share one shell layout. The internal styleguide (`/internal/styleguide`) uses labeled fictitious demo data, sits outside the shell, is `noindex` and returns 404 in production.
8. **Validation at the edges.** Zod at build time, on client and server for forms, and for environment variables at start.
9. **Preview build.** `pnpm build:preview` inlines a flag that shows drafts so E2E tests can exercise templates with draft content. The normal build never shows drafts. Never deploy a preview build.
10. **Docs folder.** `BUILD_PROMPT.md`, `PLAN.md`, `DECISIONS.md`, `CONTENT_STATUS.md`, `SEO.md`, `LOGOS.md`, `MEDIA.md`, `SOURCES.md`, `PRESS_REQUESTS.md`.

---

## 6. Content model

Entities (Zod `strictObject` schema for each, build fails on any error):

- **Vendor**: legal name, HQ country, website, parent company (if acquired), privacy policy URL, DPA available (yes/no/unknown + source), status (active, acquired, shut down) with source.
- **Tool**: slug, name, vendor ref, categories (refs, first one is the main category), short summary (max 160 chars), long review (sections, see below), what you can build (enum: business site, portfolio, online store, landing page, blog, web app, internal tool, mobile app), target groups (enum: small business, freelancer, creator, startup founder, agency, student, developer, nonprofit), technical level (no code, low code, code first), output (hosted site only, hosted site plus code export, code in your repo), fact block per category (Section 6.1), free plan (yes/no), free trial (days or none), refund window (days or unknown), pros (3 to 6, specific), cons (3 to 6, specific), editorial summary, best for / not ideal for, logo path, media refs, changelog entries, status, verification flag, last reviewed date, responsible person ref.
- **Plan**: tool ref, plan name, billing (monthly, yearly, multi year), term in months, intro price per month in integer cents, regular or renewal price per month in integer cents (null only if the vendor states the price never changes, with source), currency shown, region shown, per seat or flat, minimum seats, included AI credits or messages (amount, unit, period, what one credit buys if the vendor says so), overage price, included limits (sites, pages, storage, bandwidth, products, custom domain yes/no, free domain for first year yes/no), source URL, access date, optional note for promotions on the check date. A price older than 60 days fails the production build until it is re-verified.
- **ChangelogEntry**: tool ref, date, what changed (plan, price, feature, name, owner), source URL. Shown as "What changed recently" on the profile, newest first. AI builders change monthly; this is a differentiator.
- **Category**: slug, name, intro, buying guide sections, ranking criteria shown on the page, fact item list used for scoring, related categories, launch order.
- **Comparison**: two or three tool refs, central question, sections with sources, editorial summary, only published if it has real editorial value.
- **UseCase** ("Best for"): slug, title, central question, selection rule (what you can build, target groups, facts), explanation, sources. The list on the page is computed from the rule, never hand picked, and the rule is shown above the list.
- **Guide**: slug, title, central question, intro, sections (paragraphs, points, named tools, own sources), responsible person, dates.
- **GlossaryTerm**: slug, term, definition, sources.
- **Person**: real person only (`realPerson: true`), name, role, bio from verifiable facts only, photo only if real and provided by the owner, links.
- **AffiliateLink**: tool ref, network, target URL, sub id parameter name, active flag, added date, checked date. Lives only in content data.
- **Media**: tool ref, type (screenshot, video), file or video id, official source page, access date, original title for videos (kept verbatim, shown in quotes, exempt from the copy lint), note (for example "shows an older interface").

### 6.1 Fact blocks per category

Each fact is `yes`, `no`, `partly` (with note), `paid add-on` (with price), `beta` (with note) or `unknown`. Every value except `unknown` needs a source URL and access date. **Unknown is a value**: the absence of a statement on a vendor page is not proof that a feature is missing, so it is never stored as `no`.

AI website builders:

- AI generation: full site from a prompt, AI copywriting, AI image generation, AI SEO suggestions (titles, meta), AI edits by chat after generation.
- Site basics: custom domain (which plan), free domain for the first year, SSL included, hosting included, mobile editing, page limit, blog, CMS collections, forms, membership or gated content, multilingual, scheduling or bookings.
- Ecommerce: online store, product limit, transaction fee on top of payment fees, digital products.
- SEO and speed: editable meta tags, sitemap, 301 redirects, structured data, image optimization, Core Web Vitals statements by the vendor (as a vendor claim with source).
- Ownership and portability: export of HTML or code, content export (CSV or similar), migration path off the platform, what happens to the site after cancellation.
- Collaboration and support: team seats, roles, support channels and hours, documentation, status page, uptime SLA (only if published), cookie banner tool, DPA.

AI app builders:

- Generation: app from a prompt, edits by chat, visual editor, supported stack (framework, language), mobile output.
- Backend: database, authentication, file storage, payments integration, which backend services are built in vs. connected (for example a Supabase integration).
- Code and ownership: code visible, code export or download, sync to GitHub, license of generated code per the terms, self hosting possible, vendor lock-in notes.
- Deployment: one click deploy, custom domain, hosting included, environments.
- Pricing mechanics: what a credit or message is, credits per plan, rollover, overage, what consumes credits (generation, fixes, deploys).
- Collaboration and support: team seats, version history, rollback, support channels, documentation, security statements (SOC 2 or similar only with source), DPA.

### 6.2 Rules

- Every item has `status` (`draft` / `published`) and, where facts matter, `verification` plus sources with access dates. Production shows only published and verified content; dev and preview show drafts with a visible "Draft" marker.
- Money is integer cents, dates are ISO dates.
- References resolve by slug; an unresolved reference fails the build. Each file name must equal its slug.
- Build guards (each one proven by a unit test): stale prices (60 days), stale facts (120 days), missing sources, future dates (UTC), duplicate slugs, banned wording, test claims (Section 3.3), claims without evidence, a tool page with fewer than three pros or cons, a published page without a responsible person, media without an entry in `docs/MEDIA.md`, a screenshot file that does not exist, an intro price without a renewal price or a sourced statement that there is none.
- Copy lint (`scripts/lint-copy.ts`) checks content and UI strings through the TypeScript AST: banned phrases (Section 10), test claims, British spellings, wrong number, currency or date format, emoji, exclamation marks in headings.
- Categories, sections and pages with no content are hidden.
- Long reviews have their own sections and each section lists its own sources directly beneath it ("Sources for this section"), so a reader can check every paragraph.

---

## 7. Information architecture (starting proposal; Claude refines it in Phase 0 and the owner approves)

English slugs, lowercase, hyphenated, no trailing slash, one canonical URL per page.

| Page type          | URL                                                                                                                | Question it answers                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Home               | `/`                                                                                                                | Where do I start, what can this site do for me?                              |
| Category hub       | `/categories`                                                                                                      | Which kinds of AI builders exist?                                            |
| Category page      | `/best/ai-website-builders`, `/best/ai-app-builders`                                                               | Which builders are best for which project?                                   |
| Tool profile       | `/reviews/framer`                                                                                                  | Is this tool right for me? Features, true cost, limits, pros, cons           |
| Pricing page       | `/reviews/framer/pricing`                                                                                          | What will it really cost me in year one and year three?                      |
| Alternatives       | `/reviews/framer/alternatives`                                                                                     | What else should I consider and why? (`noindex` until it has editorial text) |
| Comparison         | `/compare/lovable-vs-bolt`                                                                                         | Which of these fits me better?                                               |
| Comparison tool    | `/compare`                                                                                                         | Compare any 2 or 3 tools side by side                                        |
| Best for           | `/best-for/restaurants`, `/best-for/portfolios`                                                                    | Which builder fits this kind of project?                                     |
| Builder Finder     | `/builder-finder`, results `/builder-finder/results` (`noindex`)                                                   | Which tool fits what I want to build?                                        |
| Cost calculator    | `/cost-calculator`                                                                                                 | What will my setup cost over 12 and 36 months, after the intro price ends?   |
| Guides hub         | `/guides`                                                                                                          | What should I know before choosing?                                          |
| Guide article      | `/guides/ai-website-builder-vs-hiring-a-designer`                                                                  | One central question per article                                             |
| Glossary           | `/glossary`, `/glossary/code-export`                                                                               | What does this term mean?                                                    |
| Methodology        | `/methodology`                                                                                                     | How are scores and rankings calculated?                                      |
| How we make money  | `/how-we-make-money`                                                                                               | How is the site financed, who are the partners, what can they not influence? |
| Editorial policy   | `/editorial-policy`                                                                                                | How do we research, source, update and correct?                              |
| Team               | `/team`                                                                                                            | Who is responsible for this site?                                            |
| About, contact     | `/about`, `/contact`                                                                                               |                                                                              |
| Newsletter         | `/newsletter`, `/newsletter/confirm`                                                                               |                                                                              |
| Legal              | `/privacy`, `/terms`, `/cookie-settings`, `/accessibility` (plus any page the owner's country requires, Section 9) |                                                                              |
| Search results     | `/search` (`noindex`)                                                                                              |                                                                              |
| Affiliate redirect | `/go/[slug]` (`noindex`, disallowed in robots)                                                                     |                                                                              |

Navigation proposal:

- **Header:** logo, Categories (menu with the live categories), Compare, Builder Finder, Guides, search (opens command palette with `Ctrl K` / `⌘ K`), one primary button "Find your builder".
- **Footer:** short mission line, column Categories, column Best for, column Tools (Finder, Compare, Cost calculator), column About (Methodology, How we make money, Editorial policy, Team, Contact), legal row, commission notice, giant wordmark.
- **Mobile:** full screen menu, search first, categories as a list.

Launch order of categories: 1. AI website builders, 2. AI app builders. Later candidates (only after owner approval): AI landing page builders, AI ecommerce store builders, AI portfolio builders. Only categories with at least five published profiles go live.

Conversion path: search or guide → category page → profile (summary, true cost, pros/cons) → "Visit {Tool}" (affiliate, labeled) or → Builder Finder → shortlist → profile or comparison → affiliate. Secondary: newsletter.

Deliver the proposal as a short table plus a sitemap diagram (Mermaid) in `docs/PLAN.md`.

---

## 8. Feature modules

- **Research score.** Name: `{{SCORE_NAME}}` (proposal: "{{BRAND_NAME}} Research Score"), 0.0 to 10.0 with one decimal, method version (R1.0) and date on every score. It is computed in a pure, unit tested module from the sourced facts and prices, never entered by hand. Proposed criteria and weights (owner approves): AI capabilities 25%, core features for the category 25%, true cost (year one and year three, renewal included) 20%, ownership and portability (custom domain, export, lock-in) 15%, trust and support (DPA, support channels, docs, status page) 15%. Points: `yes` 1, `paid add-on` 0.75, `partly` 0.5, `beta` 0.25, `no` and `unknown` 0. Each tool is scored against the item list of the category it is shown in, so an app builder is not marked down for a missing blog. "Ease of use" is shown as "Not scored: needs hands-on testing". Pros and cons are not counted (they are written from the same facts). Every profile shows the full derivation (each fact with its points, the price rule). Known limits are stated on `/methodology`. No `Review` or `AggregateRating` structured data for this score.
- **True cost.** Every price shows intro price, term, renewal price and what the first and third year cost in total, plus a note when credits run out quickly or overage applies. "From $X/month" always means the cheapest paid plan at its renewal price, with the intro price shown next to it. A free plan is shown separately as "Free plan available" with its limits (for example "builder subdomain, branding badge").
- **Builder Finder.** 6 to 8 short steps: what you are building, technical comfort (no code, some code, developer), must you own or export the code, online store needed, custom domain needed, budget per month after intro prices, team size, top priority (launch speed, design control, SEO, lowest cost, room to grow). A pure, unit tested matching function scores every published tool and shows a shortlist of three with a plain explanation per match ("fits because ...", "watch out for ..."). State lives in the URL (nuqs), no personal data is stored, the results page is `noindex`, and it says that commercial status never affects the result.
- **Comparison.** Pick 2 or 3 tools: side by side facts, true cost, scores, sticky header with product names, URL state, "Highlight differences" toggle, table alternative for every chart. Highlights ("Lowest year one cost", "Longest free trial", "Highest Research Score") are computed from stored values only; tools without a stated value are named as such, never counted as winners. Below `md` each row is a label with the values side by side, so phones need no sideways scrolling. Editorial comparison pages only for real demand pairs.
- **Cost calculator.** Tool, plan, seats, billing term, expected credit use → cost over 12 and 36 months, with intro and renewal periods explained in words and price dates shown.
- **Filters and sorting** on category pages: what you can build, technical level, price range, free plan, trial, code export, custom domain on the cheapest plan, ecommerce. Default sort is the Research Score; every sort option is explained above the list.
- **Affiliate system.** Affiliate URLs only in content data. Pages link to `/go/[slug]?from=<place>&pos=<n>` with whitelisted values and no personal data. The route resolves the target with a pure function, appends the network's sub id, answers 307 with `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`, `Referrer-Policy: strict-origin-when-cross-origin`, counts the click anonymously, and falls back to the profile for inactive or unknown slugs. `robots.txt` disallows `/go/`. Before the owner has approved programs, the button links to the vendor's website without tracking and without the label. Follow each program's terms (some forbid brand keyword bidding, coupon claims or specific wording) and log them in `docs/DECISIONS.md`.
- **Display ads (flag `ads`, off at launch).** When the owner switches it on: a consent management platform certified for the ad network's requirements for EEA, UK and Swiss visitors, `ads.txt`, ad slots with reserved height (no layout shift), labeled "Advertisement", at most `{{MAX_ADS_PER_PAGE}}` per page, never inside comparison tables, the Finder, the cost calculator, legal pages, next to an affiliate button or between a fact and its source, no sticky, interstitial or autoplay formats. The privacy text and the cookie settings change in the same commit.
- **Forms and email.** Contact form: shared Zod schema, honeypot, rate limit per form and client, messages linked with `aria-describedby`, success only after the mail provider accepted the message, provider interface with a local outbox for tests. Forms stay hidden until a provider is configured and named in the privacy policy.
- **Newsletter.** Double opt in: create the contact unconfirmed, send a sealed token link (authenticated encryption, expiry, no address inside), the link opens a page and a button click confirms, consent is logged with the minimum data the law needs. Every newsletter email has an unsubscribe link and the sender's postal address (Section 9).
- **Search.** Build time index over tools, categories, comparisons, guides and glossary, command palette, `noindex` results page, a GET form so the hero search works without JavaScript.
- **User reviews (flag `userReviews`, off at launch).** Only when the owner asks: verified email plus one proof of use, moderation queue, negative reviews never suppressed, incentivized reviews labeled, shown separately from the Research Score and only from five verified reviews. Follow the FTC rule on fake reviews and testimonials.

---

## 9. Legal, privacy and trust (global)

Claude drafts structure and texts. The lawyer review is tracked in `docs/CONTENT_STATUS.md` and on the launch checklist; there is no visible "not yet reviewed" notice on public pages (it shows only in dev and preview).

The owner's country (`{{OWNER_COUNTRY}}`) decides some duties. In Phase 0 ask for it, then research and list in `docs/DECISIONS.md` which extra pages or details that country requires (for example an Impressum in Germany or Austria, a registered business address in the UK, local consumer and data protection laws). Until then, build for these audiences, because visitors will come from all of them:

- **US: FTC.** Endorsement Guides (16 CFR Part 255): clear and conspicuous disclosure close to the affiliate link, before the click, in plain words. Rule on consumer reviews and testimonials (16 CFR Part 465): no fake, bought or AI generated reviews, no review suppression. Claims of testing must be true (this site makes none).
- **US: privacy.** CCPA/CPRA and similar state laws: a "Your privacy choices" section, honor Global Privacy Control signals once any ad or tracking service exists.
- **EU and UK: GDPR, UK GDPR, ePrivacy and PECR.** Consent before non essential cookies or third party requests, equal "Reject all" and "Accept all" buttons, no dark patterns, settings page always available, consent driven by a service list, no banner while the list is empty.
- **Email: CAN-SPAM and GDPR.** Double opt in, unsubscribe in every email, and a valid physical postal address of the sender in every commercial email (a business address or a registered mailbox service is fine; it does not have to be shown on the website). Report this to the owner in Phase 0 because it needs `{{POSTAL_ADDRESS}}`.
- **Search engines.** Follow Google's spam policies: no scaled low value content, no thin programmatic pages, no site reputation abuse. Every page must have unique editorial value.

Pages:

- **Privacy policy** naming every processor with location and transfer basis: Vercel (hosting), the registrar, the mail provider, the database provider, the analytics provider, later the ad network. Purpose, legal basis and retention per data flow. Explain the affiliate redirect (the vendor or network may set cookies after the visitor leaves the site), newsletter consent, contact form, click to load videos. It never contradicts itself.
- **Terms of use**: content is information, not professional advice; prices can change; product names belong to their owners.
- **How we make money**: how the site is financed, current affiliate partners (alphabetical, "not a ranking"), what commercial interest can and cannot influence.
- **Methodology**: criteria, weights, data sources, update cycle, ranking parameters, what the score does not measure.
- **Editorial policy**: research process, source rules, update cycle, corrections (`{{EDITORIAL_EMAIL}}`), the research only rule, how AI assistance is used in writing and that every published page is checked by the responsible person.
- **Team** page with real named people only. Byline on content: "{{BRAND_NAME}} Editorial Team · Responsible: {{RESPONSIBLE_PERSON}}". Structured data names the team as `author` (Organization) and the responsible person as `accountablePerson`.
- **Accessibility statement** (WCAG 2.2 AA target, known issues, contact).
- **Trademark note**: product names and logos belong to their owners and are used for identification only.

---

## 10. Content writing system

- **Persona.** Senior tech editor for web builders, plain US English, calm, concrete, helpful, second person "you". Mix short and long sentences. Use clearly framed example scenarios ("A yoga teacher who needs a booking page and a custom domain on a $15 budget ...").
- **Accuracy.** Every fact has a source (vendor pricing page, help center, documentation, terms of service, changelog, official blog) stored with its access date in the content file and in `docs/SOURCES.md`. Research with live web access and read the original page, in its US version. Refetch before writing a long review; notes older than a few days are not enough for AI tools. Leave out what you cannot verify.
- **Contradictions on vendor pages are named, not resolved.** If a vendor shows two prices or two credit amounts, the text says so and recommends checking at checkout. Store the value from the plan cards.
- **What every profile answers.** What can I build with it and for whom is it made; what the AI actually does (and what still needs manual work, as the vendor documents it); true cost in year one and year three; what the credits or limits mean in practice; custom domain and free plan limits; can I export and leave; ecommerce and SEO basics; support and data protection; limits and who should pick something else.
- **Never templated.** Each profile and guide has its own central question, opening, headings and structure. Before writing a new page, scan existing pages in the same area and rewrite when openings, headings or five word sequences repeat.
- **Honest weaknesses.** Real, specific cons in every profile ("Code export is not available, so leaving means rebuilding the site elsewhere"), never "can be complex for beginners" without specifics.
- **Banned phrases** (enforced by the copy lint): "revolutionary", "game-changer", "game changing", "seamless", "seamlessly", "in today's digital age", "in today's fast-paced world", "let's dive in", "dive into", "delve", "unleash", "unlock the power", "elevate", "supercharge", "cutting-edge", "robust", "harness", "effortless", "landscape" (as a metaphor), "tapestry", "look no further", "best-in-class", "world-class", "it's worth noting", "in conclusion", "whether you're a ... or a ...", "the best AI builder" without a qualifier, "100% free" unless the vendor states it with no limits, "guaranteed", the test claims from Section 3.3, exclamation marks in headings, emoji in UI and content, and the em dash (use a comma, colon or period).
- **Length by purpose.** Never pad. If a target is missed, say so and why.
- **Internal links.** Each long page links to its category, two or three related profiles or comparisons, a relevant guide and a next step (Finder or comparison).
- **Owner sign off.** The responsible person reads each batch before it is published; `docs/CONTENT_STATUS.md` records who signed off and when.

---

## 11. SEO, performance, accessibility

- `generateMetadata` on every route, canonical URLs, `en-US` locale, title template "... | {{BRAND_NAME}}", meta descriptions of at most 155 characters, keyword phrasing taken from ranking pages and logged with date and source in `docs/SEO.md`.
- OG images per page type (tool, category, comparison, guide) with the framework's OG API in the site design.
- Structured data that truly applies: Organization and WebSite (with SearchAction) on home, BreadcrumbList everywhere, SoftwareApplication with `offers` from the stored plans on profiles (no `Review`, no `AggregateRating`), ItemList on category and best for pages, Article on guides and comparisons, DefinedTerm on glossary pages, FAQPage only where a visible FAQ exists.
- `sitemap` with `lastModified` from content; `noindex` pages stay out. `robots` disallows `/go/`, `/internal/`, `/search`, `/builder-finder/results`, `/newsletter/confirm`. Indexing is switched on only when launch content is published.
- No thin programmatic pages: no "X vs Y", "alternatives" or "best for" page without unique editorial value.
- **Budgets (mobile p75):** LCP 2.0 s, INP 200 ms, CLS 0.05; Lighthouse performance 90+, accessibility 100, best practices 100, SEO 100; small first load JavaScript on content pages, heavy widgets loaded lazily.
- **Accessibility:** landmarks, skip link ("Skip to content"), visible focus ring in the primary color, keyboard support for every widget (tabs, menus, Finder, comparison, palette), 44 px touch targets, color never the only signal (pros and cons use text and plus/minus marks), reduced motion respected.
- **Security headers:** nonce based CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, set in Phase 6 and tested against analytics, forms, click to load videos and OG images.

---

## 12. Hosting, environments and quality gates

- Vercel. Function region close to the database provider (default `iad1` for a US audience); log the choice. Sign the Vercel DPA. Domain at `{{REGISTRAR}}` pointed to Vercel. Pin the package manager.
- `.env.example` lists every variable without values. Real values live in `.env.local` (git ignored) and in Vercel.
- Scripts: `dev`, `build` (validate content, build search index, framework build), `build:preview`, `lint`, `lint:copy`, `format:check`, `typecheck`, `test`, `test:e2e`, `content:validate`, `check:css`, `placeholders`, `check` (all of them).
- CI on every push: frozen lockfile install, format check, lint, copy lint, typecheck, unit tests, build, compiled CSS check, E2E with axe at 390 px and 1440 px width.
- Before every push: all of the above pass, fetch the remote first, check the staged diff for secrets.
- Report honestly: failed or skipped checks are named with output.

---

## 13. Design brief

The design rules are the same as in the sister project; the identity (primary color, logo) is new, so the two sites never look alike.

### 13.1 Personality

Clean, cool, modern, premium. A calm editorial magazine crossed with a precise product: lots of air, large confident typography, few colors, flat surfaces, sharp hierarchy. It must feel trustworthy and expensive, never loud, never playful, and nobody should be able to call it "AI generated" or "AI type", which matters doubly on a site about AI tools.

### 13.2 Patterns to take from the large portals

The big review portals share one home page pattern, and it works: one short headline, one line of text and a large search field, then tools by category, then the top rated tools, comparisons, guides and a short "who we are and how we earn" block. Take that structure. From the review sites take the profile layout only: breadcrumbs, product header with logo, name, score and one action, a sticky in page tab bar (Overview, Features, Pricing, Pros and cons, Alternatives), a sidebar with alternatives. Do better than them: one primary action color only, no repeated "Try free" buttons on every card, no self awarded badges, no lead forms, no cartoon illustrations, no unsourced claims, no cluttered nav with five competing buttons.

### 13.3 Color tokens (flat only)

| Token                                  | Value                                                                                                                                                                                                                                                                                                                  | Use                                                            |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `--color-primary`                      | `{{PRIMARY_COLOR}}`. In Phase 1 Claude shows three flat candidates in the styleguide, each with contrast results, and the owner picks one. Candidates to start from: deep green `#0B7A5C`, burnt orange `#C2410C`, petrol `#0E7490`. Not the sister project's blue `#2F2FC1`, not purple or violet (it reads as "AI"). | primary buttons, links, focus ring, key accents                |
| `--color-primary-hover`                | darker solid shade of primary, verify contrast                                                                                                                                                                                                                                                                         | hover, pressed                                                 |
| `--color-primary-tint`                 | light solid tint of primary, verify contrast                                                                                                                                                                                                                                                                           | selected states, subtle highlights                             |
| `--color-ink`                          | `#191919`                                                                                                                                                                                                                                                                                                              | text, dark panels, footer, dark buttons                        |
| `--color-bg`                           | `#F1F1F1`                                                                                                                                                                                                                                                                                                              | global page background                                         |
| `--color-surface`                      | `#FFFFFF`                                                                                                                                                                                                                                                                                                              | cards and panels                                               |
| `--color-muted`                        | gray derived from ink, at least 4.5:1 on bg and surface                                                                                                                                                                                                                                                                | secondary text                                                 |
| `--color-line`                         | hairline gray (for example `#DCDCDC`)                                                                                                                                                                                                                                                                                  | dividers, card borders                                         |
| `--color-positive`, `--color-negative` | one restrained green and one restrained red, AA compliant, clearly different from the primary                                                                                                                                                                                                                          | only for pros/cons marks and form validation, always with text |

Rules: no gradients anywhere (backgrounds, text, buttons, image overlays, borders), no glow, no colored shadows, no glassmorphism or blur panels, no extra accent colors. At most one very soft neutral shadow for floating elements (menus, palette); cards use the surface color and a hairline instead. White text on primary and on ink must pass AA. Verify every pair with a contrast check (a unit tested `contrast` module) and record the results in `docs/DECISIONS.md`.

### 13.4 Typography

- **Display and headings:** Google Sans Flex (SIL Open Font License; download the official files, subset to Latin, self host as WOFF2, keep the license file). Weights 400 to 500 for large display, 500 to 600 for small headings. Letter spacing about `-0.03em` at display sizes, `-0.01em` for headings.
- **Body and UI:** Inter (self hosted WOFF2, OFL), 400 and 500, 600 for emphasis. Tabular numbers (`font-variant-numeric: tabular-nums`) for prices, scores and tables.
- **Eyebrow labels:** Inter 500, 11 to 12 px, uppercase, letter spacing `0.08em`, preceded by a 6 px square marker in primary. Use them sparingly, not above every section. No monospace font.
- **Fluid scale** with `clamp()`: display 56 to 104 px, h1 40 to 72 px, h2 32 to 48 px, h3 22 to 28 px, body 16 to 18 px, small 14 px. Line height 1.0 to 1.05 for display, 1.15 for headings, 1.6 for body. Measure 60 to 72 characters for body text.
- No other font may appear in the compiled CSS (enforced by `check:css`).

### 13.5 Layout, grid and shape

- Max content width 1360 px, 12 columns, 24 px gutters desktop, 16 px side gutter mobile, no horizontal page scroll at 390 px.
- Large sections may sit in rounded panels (`--radius-panel` about 28 px desktop, 20 px mobile) inset 12 to 16 px from the viewport edge, alternating bg and surface; cards use `--radius-card` (about 20 px).
- **Controls are square.** Buttons, inputs, search fields, header items, segmented controls, filter chips and carousel controls have no radius (there is no control radius token). The focus style never adds a radius. Radio dots, switches and non clickable tags may stay round.
- Vertical rhythm: section padding 96 to 160 px desktop, 64 to 96 px mobile.
- Hairline dividers between list rows instead of boxes where possible.

### 13.6 Signature components

1. **Button**: a plain rectangle with square corners and a centered label (Inter 500, 14 to 15 px, sentence case). No separate arrow segment, no icon box. Variants: primary, dark (ink), outline. Hover shifts to the hover token. Only one primary button per view.
2. **Search field**: one bordered rectangle, field and button share the height (about 56 px in the hero), no gap, no radius.
3. **Tool card**: real logo on white (no colored circle behind it), name, category, Research Score with one decimal and its label, "From $X/mo" (renewal price) with the intro price next to it, two or three key facts (code export, custom domain on cheapest plan, free plan), one action. "Affiliate link" label when applicable.
4. **Score display**: large number with one decimal in Google Sans Flex, score name, a thin horizontal bar per criterion, method version link, "Not scored: needs hands-on testing" for ease of use.
5. **True cost block**: intro price, term, renewal price, year one and year three totals, credits note, price date and source.
6. **Pros and cons**: two columns, plus and minus marks in text plus the positive/negative token, never color alone.
7. **Fact checklist**: rows with item, status (Yes / No / Partly / Paid add-on / Beta / Unknown), note and source link with access date.
8. **Sticky profile header and tab bar** (WAI-ARIA tabs or in page navigation with scroll spy).
9. **Comparison table** with sticky first column and product headers, "Highlight differences" switch, stacked layout on phones.
10. **Finder steps** with a segmented step indicator and large flat step cards.
11. **Guide cards**: tag, date, title, "Read more" with a plain arrow icon (no box behind it). Thumbnails drawn in code from flat brand colors, line art and up to three real vendor logos; no stock photos.
12. **"What changed recently"** list on profiles (date, change, source).
13. **Commission notice** (`AffiliateNote`): one short line, once per page near the first affiliate link, plus the footer.
14. **Command palette** for search (`Ctrl K`), flat, white, hairline, no blur.
15. **Giant footer wordmark** on the ink panel (`pointer-events-none`).

### 13.7 Home page composition (proposal)

1. Hero: short headline, one line of text, large search field (GET `/search`), links to the two categories and the Finder.
2. Row of real vendor logos in grayscale, labeled "Builders we cover" (not "Partners", not "As seen in", not "Trusted by").
3. "Builders by category" with tabs (AI website builders, AI app builders).
4. "What they look like": one official screenshot per tool with its source (only where official material exists).
5. "Highest Research Score": the top four across categories, with the rule next to the section and the commission notice once above it.
6. Popular comparisons and "Best for" links as hairline rows.
7. The three newest guides.
8. "How {{BRAND_NAME}} works": research only, how the score is built, how the site earns money, links to Methodology and How we make money.
9. Newsletter panel.
10. Footer panel with giant wordmark.

### 13.8 Motion

Subtle and purposeful: fade and 8 to 16 px rise on scroll for section headings, tab underline slide, segmented indicator slide. Durations 150 to 400 ms, ease out. No parallax, no bouncing, no marquee, no animated gradients, no typewriter effects, no particle or glow effects, no "AI thinking" shimmer. Everything stops under `prefers-reduced-motion`.

### 13.9 Icons

- lucide-react only, stroke 1.5 px, size 16 to 24 px, color `currentColor`.
- **No background behind icons**: no circles, squares, blobs or tinted containers.
- **No "AI" icons**: no sparkles, stars with sparkles, magic wands, robot heads, brains, chips, lightning bolts as decoration, no emoji. This holds even when describing AI features.
- Icons only where they help understanding (search, arrow, check, minus, external link, info, menu, close, filter). No decorative icon rows.

### 13.10 Logo and wordmark

Once the owner picks the name, Claude proposes a wordmark in Google Sans Flex (medium weight, tight tracking) with an optional simple geometric mark built from a few flat shapes on a pixel grid (edges on whole pixels at 16 and 32 px), one part in primary. It must not read as a UI icon (menu, grid, play button), must not use sparkles or "AI" motifs, and must not resemble the sister project's stacked bar mark or any vendor logo. Flat, no gradient, no container. Delivered as SVG in ink, white and mono versions, plus favicon (SVG and ICO 16/32/48), Apple touch icon and social card use. Three options in the styleguide; the owner chooses.

### 13.11 Imagery

- **Official vendor material only** for screenshots and videos: press kits, media pages, brand pages that allow use for reporting, and videos from channels the vendor links on its own site or embeds itself (check title and channel with oEmbed). Each image names its source page and access date; outdated interfaces are labeled. The media section says the material comes from the vendor and replaces no test. Everything is listed in `docs/MEDIA.md`; the content guard fails when a file or video id is missing there.
- **Videos are click to load**: no request to YouTube or Vimeo before the click, not even a thumbnail; YouTube in privacy enhanced mode (`youtube-nocookie.com`), Vimeo with `dnt=1`.
- **Press requests**: for vendors without official material, draft a short request in `docs/PRESS_REQUESTS.md`. Sending is the owner's decision.
- **Vendor logos** from official sources, SVG preferred, original colors on profiles, grayscale in logo rows. Sources in `docs/LOGOS.md`.
- **Real photos** only: real portraits of the responsible person if the owner provides them, licensed photos with source and license in `docs/SOURCES.md`. No AI generated images, no stock 3D or cartoon illustrations.
- **Illustrations**: custom fine line geometric SVGs drawn in code (1.5 px strokes in ink or primary), one per category. No blobs, isometric clip art or gradient art.
- Gaps stay visible: a profile without verified material has no media section.

### 13.12 Anti-template list (banned)

Gradients of any kind, glassmorphism, glowing borders, neon accents, purple to blue hero blobs, sparkle icons, "AI powered" badges, icons in colored circles, emoji, generic three card feature rows with icons on top, pillar tile bands that repeat the method section, slogan marquees, a muted tail line under every heading, the same CTA or disclaimer repeated several times on one page, fake stats counters ("10,000+ happy users"), fake testimonial sliders, star ratings without a source, "Trusted by" logo walls, cookie walls, popups on entry, exit intent modals, autoplay video, chat bubbles, drop shadows on every card, more than one accent color, centered everything layouts, rounded pill buttons, split buttons with an arrow box.

---

## 14. Build phases (stop after each one)

| Phase           | Scope                                                                                                                                                                                                                                                                                                                                                                                                       | Done when                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 0 Foundation    | Ask the blocking questions (Section 16), git init, latest stack (Section 4), strict TypeScript, base tokens with a neutral primary placeholder, self hosted Google Sans Flex and Inter, lint, format, tests, CI, `site.config.ts`, docs files, `noindex` everywhere, brand name proposals with live domain checks, the IA proposal (Section 7) with sitemap diagram, the research score weights proposal    | names and IA approved; install, build, lint, tests pass                    |
| 1 Design system | Three primary color candidates with contrast table, three logo options, every component from 13.6 and every state on `/internal/styleguide` with labeled fictitious demo data                                                                                                                                                                                                                               | owner picks color and logo, visual review approved, axe clean              |
| 2 Content layer | Schemas (Section 6), loaders, build guards with tests, copy lint, research score module with tests, search index, first batch: 6 AI website builders and 6 AI app builders with verified plans (intro and renewal), facts, sources and changelog entries                                                                                                                                                    | validation passes, every guard proven by a test                            |
| 3 Templates     | Home, categories, profile (with tabs), pricing, alternatives, comparison, best for, guide, glossary, team, methodology, how we make money, editorial policy, legal pages, 404 and error pages, with real first batch data                                                                                                                                                                                   | every template renders, no visible placeholders except marked legal ones   |
| 4 Interactivity | Builder Finder, comparison tool, cost calculator, filters, search palette, contact form, newsletter, affiliate redirect, consent, ad slot component behind its flag (Section 8)                                                                                                                                                                                                                             | E2E flows pass                                                             |
| 5 Content       | Long sourced reviews for every profile, remaining tools to at least 10 per category, 5 comparisons with real demand, 4 best for pages, 8 launch guides (for example "AI website builder vs. hiring a designer", "What AI credits really cost", "Can you export your site from an AI builder", "Free AI website builders and their limits", "Lovable vs. Bolt vs. v0", "Custom domains explained"), glossary | copy lint, similarity check and verification pass; owner sign off recorded |
| 6 Hardening     | SEO, structured data, OG images, performance budgets, accessibility, security headers                                                                                                                                                                                                                                                                                                                       | budgets met                                                                |
| 7 Launch        | Final QA, lawyer review, real assets, analytics, affiliate links from approved programs, DNS to Vercel, indexing switched on                                                                                                                                                                                                                                                                                | checklist complete                                                         |

---

## 15. Final QA checklist

- [ ] Every visible string is US English; no other language, no British spellings.
- [ ] USD with US formats; every price shows intro and renewal price, term, date and source; no converted prices.
- [ ] No "tested", "hands-on" or experience claim anywhere, including metadata and structured data.
- [ ] Only Google Sans Flex and Inter and only the color tokens appear in compiled CSS and computed styles; no gradients.
- [ ] Buttons and controls are square; no icon has a background container; no sparkle or "AI" icons; no emoji.
- [ ] No invented reviews, quotes, statistics, awards, people or tests; empty sections hidden.
- [ ] Every product is verified as currently available; names, owners and plans are current; beta features labeled.
- [ ] Every affiliate link is labeled and has `rel="sponsored nofollow noopener"`; commission notice once per page and in the footer; scores and order unaffected by partners.
- [ ] Methodology states criteria, weights and limits; every score shows its derivation.
- [ ] No third party request before consent (network tab on a fresh profile, with an EU location if possible).
- [ ] Privacy policy names every processor; terms, accessibility statement and any page the owner's country requires are complete and reviewed by a lawyer.
- [ ] Forms and newsletter work end to end with the real provider; sender domain verified (SPF, DKIM, DMARC); newsletter emails carry an unsubscribe link and the postal address.
- [ ] If ads are on: certified consent platform, `ads.txt`, labeled slots, no layout shift, none in banned places.
- [ ] Lighthouse and Core Web Vitals budgets met; axe zero violations; keyboard only walkthrough succeeds at 390 px and 1440 px.
- [ ] Sitemap, robots, canonicals, structured data validated; indexing switched on; unknown URLs give a real 404.
- [ ] Real publication dates only; no secrets in the repository; production environment variables set in Vercel.
- [ ] `pnpm outdated` clean or every deviation explained in `docs/DECISIONS.md`.

---

## 16. First message to the owner

After reading this file, list the open placeholders (`{{BRAND_NAME}}`, `{{DOMAIN}}`, `{{OWNER_NAME}}`, `{{OWNER_COUNTRY}}`, `{{OWNER_BUSINESS_FORM}}`, `{{CONTACT_EMAIL}}`, `{{EDITORIAL_EMAIL}}`, `{{PARTNER_EMAIL}}`, `{{POSTAL_ADDRESS}}`, `{{RESPONSIBLE_PERSON}}`, `{{REGISTRAR}}`, `{{MAIL_PROVIDER}}`, `{{DATABASE_PROVIDER}}`, `{{AFFILIATE_NETWORKS}}`, `{{AD_NETWORK}}`, `{{MAX_ADS_PER_PAGE}}`, `{{SCORE_NAME}}`, `{{PRIMARY_COLOR}}`) and ask only for those that block Phase 0 (owner country and responsible person; the brand name comes from your proposals). Then do Phase 0, including the brand name proposals, the information architecture proposal and the score weights, and stop for approval.
