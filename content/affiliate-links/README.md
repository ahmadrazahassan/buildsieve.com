# Affiliate links

One YAML file per tool, named after the tool slug. Affiliate URLs live only here and are read only
by the `/go/[slug]` route, so they never appear in page HTML. Every outbound vendor button on the site
links to `/go/[slug]`; without an active link here, the route sends the visitor to the vendor's
website without tracking.

Only add a link after the owner has been approved by the program, and log the program's terms in
docs/DECISIONS.md. Block style YAML only:

```yaml
tool: framer
network: "Example network"
url: "https://partner.example.com/track?id=REPLACE"
subIdParam: subid
active: false
added: 2026-10-28
checked: 2026-10-28
terms: "No brand keyword bidding."
```
