import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Tool } from "@/lib/schema";

/**
 * Official vendor logo on white, no colored container. Sources in docs/LOGOS.md.
 * Tools without a sourced logo render nothing rather than a stand-in.
 */
export function ToolLogo({
  tool,
  size = 40,
  grayscale = false,
  eager = false,
  className,
}: {
  tool: Pick<Tool, "name" | "logo">;
  size?: number;
  grayscale?: boolean;
  /** Above the fold: load right away instead of lazily. */
  eager?: boolean;
  className?: string;
}) {
  if (!tool.logo) return null;
  return (
    <Image
      src={tool.logo.file}
      alt={`${tool.name} logo`}
      width={size}
      height={size}
      // Tiny official files; served as published by the vendor, not re-encoded.
      unoptimized
      loading={eager ? "eager" : "lazy"}
      className={cn("shrink-0 object-contain", grayscale && "opacity-70 grayscale", className)}
      style={className?.includes("size-") ? undefined : { width: size, height: size }}
    />
  );
}
