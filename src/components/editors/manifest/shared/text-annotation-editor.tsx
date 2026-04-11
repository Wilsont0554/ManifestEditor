import { useEffect, useState } from "react";
import InputWithLanguage from "@/components/shared/inputWithLanguage";
import TextAnnotation from "@/ManifestClasses/TextAnnotation";
import ManifestField from "./manifest-field";
import SpatialCoordinatePreview from "./spatial-coordinate-preview";

interface NumericDraftInputProps {
  id: string;
  label: string;
  value: string;
  onCommit: (newValue: number) => void;
  placeholder?: string;
  step?: number;
}

function NumericDraftInput({
  id,
  label,
  value,
  onCommit,
  placeholder,
  step = 0.1,
}: NumericDraftInputProps) {
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
        step={step}
        placeholder={placeholder}
        className="w-full border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:outline-none"
        onChange={(event) => {
          const nextValue = event.target.value;
          setDraftValue(nextValue);

          if (!nextValue.trim()) {
            onCommit(0);
            return;
          }

          const parsedValue = Number(nextValue);

          if (!Number.isNaN(parsedValue)) {
            onCommit(parsedValue);
          }
        }}
        onBlur={() => {
          if (draftValue.trim() && Number.isNaN(Number(draftValue))) {
            setDraftValue(value);
          }
        }}
      />
    </ManifestField>
  );
}

interface TextAnnotationEditorProps {
  annotation: TextAnnotation;
  idPrefix: string;
  onCommit: () => void;
  className?: string;
}

function TextAnnotationEditor({
  annotation,
  idPrefix,
  onCommit,
  className = "",
}: TextAnnotationEditorProps) {
  const target = annotation.getTarget();

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
            value={(target?.getX() ?? 0).toString()}
            placeholder="0"
            onCommit={(newValue) => {
              annotation.setX(newValue);
              onCommit();
            }}
          />

          <NumericDraftInput
            id={`${idPrefix}-y`}
            label="Y"
            value={(target?.getY() ?? 0).toString()}
            placeholder="0"
            onCommit={(newValue) => {
              annotation.setY(newValue);
              onCommit();
            }}
          />

          <NumericDraftInput
            id={`${idPrefix}-z`}
            label="Z"
            value={(target?.getZ() ?? 0).toString()}
            placeholder="0"
            onCommit={(newValue) => {
              annotation.setZ(newValue);
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
