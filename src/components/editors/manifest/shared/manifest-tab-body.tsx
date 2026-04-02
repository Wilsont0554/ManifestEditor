import type { PropsWithChildren } from "react";

type ManifestTabBodyProps = PropsWithChildren<{
  className?: string;
}>;

function ManifestTabBody({
  className = "",
  children,
}: ManifestTabBodyProps) {
  return <div className={`min-h-40 space-y-8 ${className}`}>{children}</div>;
}

export default ManifestTabBody;
