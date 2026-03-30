interface TechnicalOptionGroupProps {
  options: ReadonlyArray<{
    label: string;
    value: string;
  }>;
  value: string;
  onChange: (newValue: string) => void;
  orientation?: "vertical" | "horizontal";
  allowDeselect?: boolean;
  selectedVariant?: "default" | "pink";
}

function TechnicalOptionGroup({
  options,
  value,
  onChange,
  orientation = "vertical",
  allowDeselect = false,
  selectedVariant = "default",
}: TechnicalOptionGroupProps) {
  const groupClassName =
    orientation === "horizontal"
      ? "grid"
      : "flex flex-col";
  const activeOptionClassName =
    selectedVariant === "pink"
      ? "bg-rose-50 font-medium text-rose-600"
      : "bg-white font-medium text-slate-950";

  return (
    <div
      className={`overflow-hidden rounded-md border border-slate-300 ${groupClassName}`}
      style={
        orientation === "horizontal"
          ? {
              gridTemplateColumns: `repeat(${Math.max(options.length, 1)}, minmax(0, 1fr))`,
            }
          : undefined
      }
    >
      {options.map((option, index) => {
        const isActive = option.value === value;
        const dividerClassName =
          orientation === "horizontal"
            ? index > 0
              ? "border-l border-slate-300"
              : ""
            : index > 0
              ? "border-t border-slate-300"
              : "";

        return (
          <button
            key={option.label}
            type="button"
            className={`px-4 py-3 text-base transition ${
              isActive
                ? activeOptionClassName
                : "bg-slate-100 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            } ${dividerClassName}`}
            onClick={() => onChange(allowDeselect && isActive ? "" : option.value)}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default TechnicalOptionGroup;
