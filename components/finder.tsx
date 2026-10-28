"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSerializer, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useRef } from "react";
import { matchTools, type FinderAnswers } from "@/lib/finder";
import { formatScore } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Tool } from "@/lib/schema";
import { cn } from "@/lib/cn";
import { ToolLogo } from "./tool-logo";

const parsers = {
  build: parseAsString,
  level: parseAsString,
  own: parseAsString,
  store: parseAsString,
  domain: parseAsString,
  budget: parseAsInteger,
  team: parseAsString,
  priority: parseAsString,
};
const serialize = createSerializer(parsers);

type Key = keyof typeof parsers;
type Step = { key: Key; question: string; help?: string; options: { value: string; label: string; note?: string }[] };

const steps: Step[] = [
  {
    key: "build",
    question: "What are you building?",
    options: [
      { value: "business-site", label: "A business website" },
      { value: "portfolio", label: "A portfolio" },
      { value: "online-store", label: "An online store" },
      { value: "landing-page", label: "A landing page" },
      { value: "web-app", label: "A web app" },
      { value: "internal-tool", label: "An internal tool" },
      { value: "mobile-app", label: "A mobile app" },
    ],
  },
  {
    key: "level",
    question: "How comfortable are you with code?",
    options: [
      { value: "no-code", label: "No code at all" },
      { value: "some-code", label: "I can read a little code" },
      { value: "developer", label: "I am a developer" },
    ],
  },
  {
    key: "own",
    question: "Do you need to own or export the code?",
    help: "If you might leave the platform later, a documented export matters.",
    options: [
      { value: "must", label: "Yes, it is a must" },
      { value: "nice", label: "Nice to have" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "store",
    question: "Do you need to sell online?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
  {
    key: "domain",
    question: "Do you need your own domain name?",
    options: [
      { value: "yes", label: "Yes, for example yourname.com" },
      { value: "no", label: "Not yet" },
    ],
  },
  {
    key: "budget",
    question: "What can you pay per month after any intro price ends?",
    options: [
      { value: "0", label: "Free only" },
      { value: "15", label: "Up to $15" },
      { value: "30", label: "Up to $30" },
      { value: "60", label: "Up to $60" },
      { value: "-1", label: "Budget is flexible" },
    ],
  },
  {
    key: "team",
    question: "How many people will work on it?",
    options: [
      { value: "solo", label: "Just me" },
      { value: "small", label: "2 to 5 people" },
      { value: "large", label: "More than 5" },
    ],
  },
  {
    key: "priority",
    question: "What matters most?",
    options: [
      { value: "speed", label: "Launch speed" },
      { value: "design", label: "Design control" },
      { value: "seo", label: "SEO" },
      { value: "cost", label: "Lowest cost" },
      { value: "growth", label: "Room to grow" },
    ],
  },
];

export function Finder() {
  const [q, setQ] = useQueryStates(parsers, { history: "push", scroll: false });
  const router = useRouter();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const answered = steps.filter((s) => q[s.key] !== null).length;
  // The current step is the first unanswered one.
  const firstOpen = steps.findIndex((s) => q[s.key] === null);
  const stepIndex = firstOpen === -1 ? steps.length - 1 : firstOpen;
  const step = steps[stepIndex];

  function setStepIndex(i: number) {
    // Clearing later answers moves the user back to that step.
    const clear = Object.fromEntries(steps.slice(i).map((s) => [s.key, null]));
    setQ(clear);
    headingRef.current?.focus();
  }

  function answer(value: string) {
    const next = { ...q, [step.key]: step.key === "budget" ? Number(value) : value };
    if (stepIndex === steps.length - 1) {
      // Build the results URL from state, not from the pending URL write.
      router.push(routes.finderResults() + serialize(next));
      return;
    }
    void setQ({ [step.key]: next[step.key] }).then(() => headingRef.current?.focus());
  }

  return (
    <div>
      <ol className="grid grid-cols-8 gap-1" aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
        {steps.map((s, i) => (
          <li key={s.key}>
            <button
              type="button"
              disabled={i > answered}
              onClick={() => i < stepIndex && setStepIndex(i)}
              aria-label={`Step ${i + 1}: ${s.question}${i < stepIndex ? " (answered, go back)" : ""}`}
              aria-current={i === stepIndex ? "step" : undefined}
              className={cn(
                "block h-1.5 w-full transition-colors duration-300",
                i < stepIndex ? "bg-ink" : i === stepIndex ? "bg-primary" : "bg-line",
              )}
            />
          </li>
        ))}
      </ol>
      <p className="mt-4 text-small text-muted">
        Step {stepIndex + 1} of {steps.length}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-2 font-display text-h2 font-medium outline-none">
        {step.question}
      </h2>
      {step.help && <p className="mt-3 text-muted">{step.help}</p>}
      <div className="mt-8 grid gap-3 sm:grid-cols-2" role="group" aria-label={step.question}>
        {step.options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => answer(o.value)}
            className="min-h-16 border border-line bg-surface px-5 py-4 text-left text-body transition-colors hover:border-ink focus-visible:border-ink"
          >
            {o.label}
          </button>
        ))}
      </div>
      {stepIndex > 0 && (
        <button type="button" onClick={() => setStepIndex(stepIndex - 1)} className="mt-6 min-h-11 underline underline-offset-4">
          Back
        </button>
      )}
    </div>
  );
}

export function FinderResults({ tools, scores }: { tools: Tool[]; scores: Record<string, number> }) {
  const [q] = useQueryStates(parsers);
  const answers: FinderAnswers = {
    build: (q.build as FinderAnswers["build"]) ?? null,
    level: (q.level as FinderAnswers["level"]) ?? null,
    ownCode: (q.own as FinderAnswers["ownCode"]) ?? null,
    store: (q.store as FinderAnswers["store"]) ?? null,
    domain: (q.domain as FinderAnswers["domain"]) ?? null,
    budget: q.budget,
    team: (q.team as FinderAnswers["team"]) ?? null,
    priority: (q.priority as FinderAnswers["priority"]) ?? null,
  };
  if (!answers.build) {
    return (
      <p className="rounded-card border border-line bg-surface p-6">
        No answers yet.{" "}
        <Link href={routes.finder()} className="underline underline-offset-2">
          Start the Builder Finder
        </Link>
        .
      </p>
    );
  }
  const matches = matchTools(tools, answers, scores);
  return (
    <div>
      <ol className="space-y-4">
        {matches.map((m, i) => (
          <li key={m.tool.slug} className="rounded-card border border-line bg-surface p-6 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="flex items-center gap-3 font-display text-h3 font-medium">
                <ToolLogo tool={m.tool} size={36} />
                <span className="tabular text-muted">{i + 1}. </span>
                <Link href={routes.tool(m.tool.slug)} className="hover:text-primary">
                  {m.tool.name}
                </Link>
              </h2>
              <span className="tabular text-small text-muted">Research Score {formatScore(scores[m.tool.slug] ?? 0)}</span>
            </div>
            <p className="mt-2 text-muted">{m.tool.summary}</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium">Fits because</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-small">
                  {(m.fits.length ? m.fits : ["It scored best on the rest of your answers."]).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              {m.watch.length > 0 && (
                <div>
                  <h3 className="font-medium">Watch out for</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-small">
                    {m.watch.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-small">
              <Link href={routes.tool(m.tool.slug)} className="underline underline-offset-2">
                Read the {m.tool.name} profile
              </Link>
              <Link href={routes.toolPricing(m.tool.slug)} className="underline underline-offset-2">
                See true cost
              </Link>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={routes.compareTool(matches.map((m) => m.tool.slug))}
          className="inline-flex min-h-11 items-center bg-ink px-5 font-medium text-white hover:bg-primary-hover"
        >
          Compare these three
        </Link>
        <Link href={routes.finder()} className="inline-flex min-h-11 items-center border border-ink px-5 font-medium hover:bg-ink hover:text-white">
          Start over
        </Link>
      </div>
    </div>
  );
}
