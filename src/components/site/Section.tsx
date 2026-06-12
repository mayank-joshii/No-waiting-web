import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-ink-soft backdrop-blur">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-pulse-glow" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <span className="tracking-wide uppercase">{children}</span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gradient">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base sm:text-lg text-ink-soft leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`py-20 sm:py-28 ${className}`}>{children}</section>;
}
