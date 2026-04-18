import { useEffect, useState } from "react";
import ManifestField from "./manifest-field";
import { clampNumber } from "@/utils/content-resource";

export function NumericDraftInput({
  id,
  label,
  value,
  onCommit,
  placeholder,
  allowBlank = false,
  min = -100,
  max = 100,
  step,
  clampDraftToRange = false,
}) {
    const [draftValue, setDraftValue] = useState(value);


    useEffect(() => {
        setDraftValue(value);
    }, [value]);

    return (
        <ManifestField label={label} htmlFor={id} className="space-y-2">
        <input
            id={id}
            type="number"
            inputMode="decimal"
            value={draftValue}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            className="w-full border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:outline-none"
            onChange={(event) => {
            const nextValue = event.target.value;

            if (!nextValue.trim()) {
                setDraftValue(nextValue);
                onCommit(allowBlank ? undefined : clampNumber(0, min, max));
                return;
            }

            const parsedValue = Number(nextValue);

            if (!Number.isNaN(parsedValue)) {
                const normalizedValue = clampNumber(parsedValue, min, max);

                setDraftValue(
                clampDraftToRange && normalizedValue !== parsedValue
                    ? normalizedValue.toString()
                    : nextValue,
                );
                onCommit(normalizedValue);
                return;
            }

            setDraftValue(nextValue);
            }}
            onBlur={() => {
            if (draftValue.trim() && Number.isNaN(Number(draftValue))) {
                setDraftValue(value);
            }
            }}
        />
        </ManifestField>
    );
} export default NumericDraftInput