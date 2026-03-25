import type { ReactNode } from "react";

interface EmptyStateCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  align?: "center" | "left";
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

function EmptyStateCard({
  title,
  description,
  action,
  align = "center",
  className = "",
  contentClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}: EmptyStateCardProps) {
  const alignmentClass =
    align === "left" ? "items-start text-left" : "items-center text-center";

  return (
    <div className={`rounded-md ${className}`}>
      <div
        className={`flex min-h-32 flex-col justify-center gap-4 px-6 py-5 ${alignmentClass} ${contentClassName}`}
      >
        {title ? (
          <p className={`text-2xl font-medium text-slate-950 ${titleClassName}`}>
            {title}
          </p>
        ) : null}
        {description ? (
          <p
            className={`max-w-3xl text-2xl leading-relaxed text-slate-400 ${descriptionClassName}`}
          >
            {description}
          </p>
        ) : null}
        {action}
      </div>
    </div>
  );
}

export default EmptyStateCard;
