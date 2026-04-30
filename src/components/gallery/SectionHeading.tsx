type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

/**
 * Section heading component for the Gallery page.
 * @param eyebrow - the small uppercase text above the title, usually a number or short label
 * @param title - the main heading text for the section
 * @param description - optional smaller text describing the section, displayed next to the title
 * @returns section heading component
 */
export default function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-slate-200 pb-3">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          {eyebrow}
        </p>
        <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
          {title}
        </h2>
      </div>
      {description && (
        <p className="max-w-xs text-sm leading-snug text-slate-500 self-end">
          {description}
        </p>
      )}
    </div>
  );
}
