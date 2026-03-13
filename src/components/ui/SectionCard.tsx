import type { PropsWithChildren, ReactNode } from "react";

type SectionCardProps = PropsWithChildren<{
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
}>;

export function SectionCard({
  title,
  description,
  action,
  className = "",
  contentClassName = "",
  children,
}: SectionCardProps) {
  return (
    <section
      className={`rounded-3xl border ${className}`}
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex items-start justify-between gap-4 px-5 py-4 sm:px-5">
        <div className="min-w-0">
          <h2
            className="text-[1.02rem] font-semibold"
            style={{ color: "var(--text)" }}
          >
            {title}
          </h2>
          {description ? (
            <p
              className="mt-1 text-sm leading-5"
              style={{ color: "var(--text-muted)" }}
            >
              {description}
            </p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div className={`px-5 pb-5 sm:px-5 sm:pb-5 ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
}
