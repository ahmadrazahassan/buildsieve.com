import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <div className="container-site py-24 md:py-40">
      <p className="tabular text-small text-muted">Error 404</p>
      <h1 className="mt-4 max-w-[18ch] font-display text-h1 font-medium">We could not find that page.</h1>
      <p className="mt-6 max-w-xl text-muted">
        The tool or article may have been renamed or removed. Try the search, or start from one of these.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href={routes.categories()}>Browse categories</ButtonLink>
        <ButtonLink href={routes.finder()} variant="outline">
          Builder Finder
        </ButtonLink>
      </div>
      <p className="mt-8 text-small">
        <Link href="/" className="underline underline-offset-2">
          Back to the home page
        </Link>
      </p>
    </div>
  );
}
