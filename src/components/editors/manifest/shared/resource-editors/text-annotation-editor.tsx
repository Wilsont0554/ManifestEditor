import InputWithLanguage from "@/components/shared/inputWithLanguage";
import SpatialCoordinatePreview from "../cards/spatial-coordinate-preview";
import NumericDraftInput from "../inputs/numeric-draft-input";

function TextAnnotationEditor({
  annotationParent,
  annotation,
  idPrefix,
  onCommit,
  className = "",
}) {
  const target = annotationParent.getTarget();

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
    </section>
  );
}

export default TextAnnotationEditor;
