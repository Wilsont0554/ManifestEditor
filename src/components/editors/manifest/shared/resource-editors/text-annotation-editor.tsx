import InputWithLanguage from "@/components/shared/inputWithLanguage";
import SpatialCoordinatePreview from "../cards/spatial-coordinate-preview";
import NumericDraftInput from "../inputs/numeric-draft-input";
import SliderInput from "../inputs/slider-input";
import { clampNumber } from "@/utils/content-resource";
import ManifestField from "../inputs/manifest-field";
import SoftActionButton from "../inputs/soft-action-button";
import { isAdvancedViewContext } from "@/context/manifest-context";
import { useContext } from "react";

function TextAnnotationEditor({
  annotationParent,
  annotation,
  idPrefix,
  onCommit,
  className = "",
}) {
  const target = annotationParent.getTarget();
  const { advancedView } = useContext(isAdvancedViewContext);

  let advancedOptions = <></>;
  const COORD_MIN = -15;
  const COORD_MAX = 15;
  const COORD_STEP = 0.1;

  if (!advancedView){
    advancedOptions =
    <>
      <section className="space-y-4">
      <p className="text-base font-semibold text-slate-950">Position</p>
      
      <SliderInput
          idPrefix={`${idPrefix}-intensity`}
          value={(target?.getX() ?? 0).toString()}
          MIN = {-COORD_MAX}
          MAX = {COORD_MAX}
          STEP = {COORD_STEP}
          DEFAULT = {0}
          percent = {false}
          label={"Move: Left-Right"}
          onCommit={(newValue) => {
            annotationParent.setX(
                clampNumber(
                  newValue,
                  -COORD_MAX,
                  COORD_MAX,
                ),
              );
            onCommit();
          }}
        />
        <SliderInput
          idPrefix={`${idPrefix}-intensity`}
          value={(target?.getY() ?? 0).toString()}
          MIN = {-COORD_MAX}
          MAX = {COORD_MAX}
          STEP = {COORD_STEP}
          DEFAULT = {0}
          percent = {false}
          label={"Move: Down-Up"}
          onCommit={(newValue) => {
            annotationParent.setY(
                clampNumber(
                  newValue,
                  COORD_MIN,
                  COORD_MAX,
                ),
              );
            onCommit();
          }}
        />

        <SliderInput
          idPrefix={`${idPrefix}-intensity`}
          value={(target?.getZ() ?? 0).toString()}
          MIN = {COORD_MIN}
          MAX = {COORD_MAX}
          STEP = {COORD_STEP}
          DEFAULT = {0}
          percent = {false}
          label={"Move: Backward-Forward"}
          onCommit={(newValue) => {
            annotationParent.setZ(
                clampNumber(
                  newValue,
                  COORD_MIN,
                  COORD_MAX,
                ),
              );
            onCommit();
          }}
        />
      </section>
    </>
  }
  else {
    advancedOptions = <>
          <section className="space-y-4">
        <p className="text-base font-semibold text-slate-950">Position</p>

        <div className="grid gap-4 sm:grid-cols-3">
          <NumericDraftInput
            id={`${idPrefix}-x`}
            label="X"
            step={0.1}
            value={(target?.getX() ?? 0).toString()}
            placeholder="0"
            onCommit={(newValue) => {
              annotationParent.setX(newValue);
              onCommit();
            }}
          />

          <NumericDraftInput
            id={`${idPrefix}-y`}
            label="Y"
            step={0.1}
            value={(target?.getY() ?? 0).toString()}
            placeholder="0"
            onCommit={(newValue) => {
              annotationParent.setY(newValue);
              onCommit();
            }}
          />

          <NumericDraftInput
            id={`${idPrefix}-z`}
            label="Z"
            step={0.1}
            value={(target?.getZ() ?? 0).toString()}
            placeholder="0"
            onCommit={(newValue) => {
              annotationParent.setZ(newValue);
              onCommit();
            }}
          />
        </div>

        <SpatialCoordinatePreview
          x={target?.getX() ?? 0}
          y={target?.getY() ?? 0}
          z={target?.getZ() ?? 0}
        />
      </section>
      </>
  }

  return (
    <section className={`space-y-6 ${className}`}>
      <InputWithLanguage
        label="Annotation Text"
        languageCode={annotation.getBodyLanguage()}
        value={annotation.getBodyValue()}
        onChange={(newValue) => {
          annotation.setBodyValue(newValue);
          onCommit();
        }}
        onLanguageChange={(newLanguageCode) => {
          annotation.setBodyLanguage(newLanguageCode);
          onCommit();
        }}
        rows={3}
        textareaClassName="min-h-28"
      />

      {advancedOptions}
  </section>
  );
}

export default TextAnnotationEditor;
