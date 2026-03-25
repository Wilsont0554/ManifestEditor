interface TechnicalOptionGroupProps {
  options: ReadonlyArray<{
    label: string;
    value: string;
  }>;
  value: string;
  onChange: (newValue: string) => void;
  orientation?: "vertical" | "horizontal";
  allowDeselect?: boolean;
}

function TechnicalOptionGroup({
  options,
  value,
  onChange,
  orientation = "vertical",
  allowDeselect = false,
}: TechnicalOptionGroupProps) {
  const groupClassName =
    orientation === "horizontal"
      ? "grid grid-cols-3"
      : "flex flex-col";

  return (
    <div
      className={`overflow-hidden rounded-md border border-slate-300 ${groupClassName}`}
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
                ? "bg-white text-slate-950"
                : "bg-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
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
