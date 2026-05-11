import { clampNumber } from "@/utils/content-resource";
import ManifestField from "./manifest-field";
import NumericDraftInput from "./numeric-draft-input";

function SliderInput({
    idPrefix,
    value,
    onCommit,
    DEFAULT,
    MIN,
    MAX,   
    STEP,
    label,
    exact = false,
    percent = true,
}) {
  const sliderValue = clampNumber(
    value ?? DEFAULT,
    MIN,
    MAX,
  );
  
  let sliderPercentage;
  if (percent){
    sliderPercentage = Math.round(sliderValue * 100);
  }
  else{
    sliderPercentage = sliderValue;
  }

  return (
    <section className="space-y-3">
      <ManifestField
        label={label}
        htmlFor={`${idPrefix}-slider`}
        className="space-y-3"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              id={`${idPrefix}-slider`}
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={sliderValue}
              className="h-2 w-full cursor-pointer accent-pink-500"
              onChange={(event) => {
                const nextValue = Number(event.target.value);

                onCommit(nextValue);
              }}
            />
            <span className="min-w-12 text-right text-sm font-semibold text-slate-700">
              {sliderPercentage} {percent ? (<>%</>) : (null)}
            </span>
          </div>

        </div>
      </ManifestField>

    {exact ? (<NumericDraftInput
        id={`${idPrefix}-value`}
        label="Exact intensity"
        value={value?.toString() ?? ""}
        min={MIN}
        max={MAX}
        step={STEP}
        placeholder={DEFAULT.toString()}
        allowBlank
        clampDraftToRange
        onCommit={onCommit}
      />) : null
    }
    </section>
  );
} export default SliderInput