import { type ReactNode, useState } from "react";

interface CollapsibleResourceCardProps {
  badgeLabel: string;
  description: string;
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
        isOpen ? "rotate-180" : "rotate-0"
      }`}
      aria-hidden="true"
    >
      <path
        d="M8.12 9.29 12 13.17l3.88-3.88a.996.996 0 1 1 1.41 1.41l-4.59 4.59a.996.996 0 0 1-1.41 0L6.7 10.7a.996.996 0 0 1 0-1.41c.39-.38 1.03-.39 1.42 0z"
        fill="currentColor"
      />
    </svg>
  );
}

function ResourceHeader({
  badgeLabel,
  description,
}: {
  badgeLabel: string;
  description: string;
}) {
  return (
    <div className="space-y-2">
      <span className="inline-flex rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-pink-200">
        {badgeLabel}
      </span>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

function CollapsibleResourceCard({
  badgeLabel,
  description,
  children,
  collapsible = false,
  defaultOpen = false,
}: CollapsibleResourceCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isExpanded = !collapsible || isOpen;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      {collapsible ? (
        <button
          type="button"
          className="flex w-full items-start justify-between gap-4 text-left"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          aria-expanded={isExpanded}
        >
          <ResourceHeader badgeLabel={badgeLabel} description={description} />
          <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
            <ChevronIcon isOpen={isExpanded} />
          </span>
        </button>
      ) : (
        <ResourceHeader badgeLabel={badgeLabel} description={description} />
      )}

      {isExpanded ? <div className="pt-5">{children}</div> : null}
    </section>
  );
}

export default CollapsibleResourceCard;
