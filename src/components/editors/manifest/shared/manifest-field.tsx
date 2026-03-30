import type { PropsWithChildren } from "react";

type ManifestFieldProps = PropsWithChildren<{
  label: string;
  htmlFor?: string;
  className?: string;
  labelClassName?: string;
}>;

function ManifestField({
  label,
  htmlFor,
  className = "",
  labelClassName = "",
  children,
}: ManifestFieldProps) {
  return (
    <section className={className}>
      <label
        htmlFor={htmlFor}
        className={`block text-md font-bold text-slate-950 ${labelClassName}`}
      >
        {label}
      </label>
      {children}
    </section>
  );
}

export default ManifestField;
