"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-site py-24 md:py-40">
      <h1 className="max-w-[18ch] font-display text-h1 font-medium">Something went wrong on this page.</h1>
      <p className="mt-6 max-w-xl text-muted">Please try again. If it keeps happening, let us know through the contact page.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="inline-flex min-h-11 items-center bg-ink px-5 font-medium text-white hover:bg-primary-hover">
          Try again
        </button>
        <Link href="/" className="inline-flex min-h-11 items-center border border-ink px-5 font-medium hover:bg-ink hover:text-white">
          Home
        </Link>
      </div>
    </div>
  );
}
