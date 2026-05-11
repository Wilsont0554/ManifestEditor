import ManifestField from "./manifest-field";

function ManifestInput({
  label,
  value,
  onChange,
  id,
  appearance = "underline",
  fieldClassName = "",
  inputClassName = "",
  ...props
}) {
  const appearanceClass =
    appearance === "outline"
      ? "w-full border border-slate-400 bg-white px-3 py-2"
      : "w-full border-b border-slate-300 bg-slate-100 px-4 py-3";

  return (
    <ManifestField
      label={label}
      htmlFor={id}
      className={`space-y-2 ${fieldClassName}`}
    >
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${appearanceClass} text-base text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:outline-none ${inputClassName}`}
        {...props}
      />
    </ManifestField>
  );
}

export default ManifestInput;
