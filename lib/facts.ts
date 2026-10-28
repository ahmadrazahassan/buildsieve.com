// Fact item lists per category. Each tool is scored against the list of the
// category it is shown in, so an app builder is not marked down for a missing blog.

export type Criterion = "ai" | "core" | "cost" | "portability" | "trust";

export const criteria: { id: Criterion; label: string; weight: number }[] = [
  { id: "ai", label: "AI capabilities", weight: 0.25 },
  { id: "core", label: "Core features for the category", weight: 0.25 },
  { id: "cost", label: "True cost (year one and year three)", weight: 0.2 },
  { id: "portability", label: "Ownership and portability", weight: 0.15 },
  { id: "trust", label: "Trust and support", weight: 0.15 },
];

export type FactItem = { id: string; label: string; criterion: Exclude<Criterion, "cost">; group: string };

export const factItems: Record<string, FactItem[]> = {
  "ai-website-builders": [
    { id: "ai_site_generation", label: "Full site from a prompt", criterion: "ai", group: "AI generation" },
    { id: "ai_copywriting", label: "AI copywriting", criterion: "ai", group: "AI generation" },
    { id: "ai_edits_chat", label: "AI edits after generation", criterion: "ai", group: "AI generation" },
    { id: "hosting_included", label: "Hosting included", criterion: "core", group: "Site basics" },
    { id: "free_domain_first_year", label: "Free domain for the first year", criterion: "core", group: "Site basics" },
    { id: "cms_or_blog", label: "Blog or CMS collections", criterion: "core", group: "Site basics" },
    { id: "booking", label: "Scheduling or bookings", criterion: "core", group: "Site basics" },
    { id: "multilingual", label: "Multilingual sites", criterion: "core", group: "Site basics" },
    { id: "ecommerce", label: "Online store", criterion: "core", group: "Ecommerce" },
    { id: "custom_domain", label: "Custom domain on a paid plan", criterion: "portability", group: "Ownership and portability" },
    { id: "code_export", label: "Export of HTML or code", criterion: "portability", group: "Ownership and portability" },
    { id: "human_support", label: "Human support channel", criterion: "trust", group: "Support and data protection" },
    { id: "dpa", label: "Data processing agreement (DPA)", criterion: "trust", group: "Support and data protection" },
  ],
  "ai-app-builders": [
    { id: "app_from_prompt", label: "App from a prompt", criterion: "ai", group: "Generation" },
    { id: "edits_by_chat", label: "Edits by chat", criterion: "ai", group: "Generation" },
    { id: "visual_editor", label: "Visual editor", criterion: "ai", group: "Generation" },
    { id: "database_included", label: "Built-in database", criterion: "core", group: "Backend" },
    { id: "auth_included", label: "Built-in authentication", criterion: "core", group: "Backend" },
    { id: "hosting_included", label: "Hosting included", criterion: "core", group: "Deployment" },
    { id: "mobile_output", label: "Native mobile output", criterion: "core", group: "Generation" },
    { id: "payments", label: "Payments built in", criterion: "core", group: "Backend" },
    { id: "custom_domain", label: "Custom domain on a paid plan", criterion: "portability", group: "Deployment" },
    { id: "github_sync", label: "Sync to GitHub", criterion: "portability", group: "Code and ownership" },
    { id: "code_export", label: "Code export or download", criterion: "portability", group: "Code and ownership" },
    { id: "team_workspace", label: "Shared team workspace", criterion: "trust", group: "Collaboration and support" },
    { id: "dpa", label: "Data processing agreement (DPA)", criterion: "trust", group: "Collaboration and support" },
  ],
};

export const factPoints: Record<string, number> = {
  yes: 1,
  "paid-add-on": 0.75,
  partly: 0.5,
  beta: 0.25,
  no: 0,
  unknown: 0,
};

export const factLabel: Record<string, string> = {
  yes: "Yes",
  no: "No",
  partly: "Partly",
  "paid-add-on": "Paid add-on",
  beta: "Beta",
  unknown: "Unknown",
};
