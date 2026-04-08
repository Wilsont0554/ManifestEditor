import { useEffect, useState } from "react";
import type Annotation from "@/ManifestClasses/Annotation";
import type Light from "@/ManifestClasses/Light";
import ManifestField from "./manifest-field";
import ManifestInput from "./manifest-input";
import TechnicalOptionGroup from "./technical-option-group";
import {
  getLightContentResourceTypeLabel,
  lightContentResourceTypes,
  type LightContentResourceType,
} from "@/utils/content-resource";

const lightTypeOptions = lightContentResourceTypes.map((value) => ({
  value,
  label: getLightContentResourceTypeLabel(value),
}));

interface NumericDraftInputProps {
  id: string;
  label: string;
  value: string;
  onCommit: (newValue: number | undefined) => void;
  placeholder?: string;
  allowBlank?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

function NumericDraftInput({
  id,
  label,
  value,
  onCommit,
  placeholder,
  allowBlank = false,
  min,
  max,
  step,
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
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        className="w-full border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus:border-pink-500 focus:outline-none"
        onChange={(event) => {
          const nextValue = event.target.value;
          setDraftValue(nextValue);

          if (!nextValue.trim()) {
            onCommit(allowBlank ? undefined : 0);
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

const DEFAULT_LIGHT_INTENSITY = 0.5;
const LIGHT_INTENSITY_MIN = 0;
const LIGHT_INTENSITY_MAX = 1;
const LIGHT_INTENSITY_STEP = 0.1;

interface LightIntensityInputProps {
  idPrefix: string;
  value: number | undefined;
  onCommit: (newValue: number | undefined) => void;
}

function LightIntensityInput({
  idPrefix,
  value,
  onCommit,
}: LightIntensityInputProps) {
  const sliderValue = value ?? DEFAULT_LIGHT_INTENSITY;
  const sliderPercentage = Math.round(sliderValue * 100);

  return (
    <section className="space-y-3">
      <ManifestField
        label="Intensity"
        htmlFor={`${idPrefix}-slider`}
        className="space-y-3"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              id={`${idPrefix}-slider`}
              type="range"
              min={LIGHT_INTENSITY_MIN}
              max={LIGHT_INTENSITY_MAX}
              step={LIGHT_INTENSITY_STEP}
              value={sliderValue}
              className="h-2 w-full cursor-pointer accent-pink-500"
              onChange={(event) => {
                const nextValue = Number(event.target.value);

                onCommit(nextValue);
              }}
            />
            <span className="min-w-12 text-right text-sm font-semibold text-slate-700">
              {sliderPercentage}%
            </span>
          </div>

          <p className="text-xs leading-5 text-slate-500">
            {value === undefined
              }
          </p>
        </div>
      </ManifestField>

      <NumericDraftInput
        id={`${idPrefix}-value`}
        label="Exact intensity"
        value={value?.toString() ?? ""}
        min={LIGHT_INTENSITY_MIN}
        max={LIGHT_INTENSITY_MAX}
        step={LIGHT_INTENSITY_STEP}
        placeholder={DEFAULT_LIGHT_INTENSITY.toString()}
        allowBlank
        onCommit={onCommit}
      />
    </section>
  );
}

interface LightResourceTechnicalEditorProps {
  annotation: Annotation;
  resource: Light;
  idPrefix: string;
  onCommit: () => void;
}

function LightResourceTechnicalEditor({
  annotation,
  resource,
  idPrefix,
  onCommit,
}: LightResourceTechnicalEditorProps) {
  const lightType = resource.getType() as LightContentResourceType;
  const intensity = resource.getIntensity();
  const target = annotation.getTarget();

  function handleLightTypeChange(newValue: string): void {
    const nextType = newValue as LightContentResourceType;

    resource.setType(nextType);
    resource.setFormat(undefined);

    if (nextType !== "DirectionalLight") {
      resource.removeLookAt();
    }

    if (nextType !== "SpotLight") {
      resource.removeAngle();
    }

    onCommit();
  }

  return (
    <section className="space-y-6">
      <section className="space-y-3">
        <p className="text-base font-semibold text-slate-950">Light Type</p>
        <TechnicalOptionGroup
          options={lightTypeOptions}
          value={lightType}
          onChange={handleLightTypeChange}
          selectedVariant="pink"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <ManifestField
          label="Color"
          htmlFor={`${idPrefix}-color`}
          className="space-y-2"
        >
          <input
            id={`${idPrefix}-color`}
            type="color"
            value={resource.getColor() ?? "#ffffff"}
            className="h-12 w-20 cursor-pointer border border-slate-300 bg-white p-1"
            onChange={(event) => {
              resource.setColor(event.target.value);
              onCommit();
            }}
          />
        </ManifestField>

        <LightIntensityInput
          idPrefix={`${idPrefix}-intensity`}
          value={intensity?.value}
          onCommit={(newValue) => {
            if (newValue === undefined) {
              resource.removeIntensity();
            } else {
              resource.setIntensity("Value", newValue, "relative");
            }

            onCommit();
          }}
        />
      </section>

      {lightType === "DirectionalLight" ? (
        <ManifestInput
          label="Look At"
          id={`${idPrefix}-look-at`}
          type="text"
          value={resource.getLookAtId()}
          onChange={(newValue) => {
            resource.setLookAt(newValue);
            onCommit();
          }}
          appearance="outline"
        />
      ) : null}

      {lightType === "SpotLight" ? (
        <NumericDraftInput
          id={`${idPrefix}-angle`}
          label="Angle"
          value={resource.getAngle()?.toString() ?? ""}
          min={0}
          max={360}
          step={10}
          placeholder="45"
          allowBlank
          onCommit={(newValue) => {
            if (newValue === undefined) {
              resource.removeAngle();
            } else {
              resource.setAngle(newValue);
            }

            onCommit();
          }}
        />
      ) : null}

      <section className="space-y-3">
        <p className="text-base font-semibold text-slate-950">Coordinates</p>

        <div className="grid gap-4 sm:grid-cols-3">
          <NumericDraftInput
            id={`${idPrefix}-x`}
            label="X"
            value={(target?.getX() ?? 0).toString()}
            step={0.1}
            placeholder="0"
            onCommit={(newValue) => {
              annotation.setX(newValue ?? 0);
              onCommit();
            }}
          />

          <NumericDraftInput
            id={`${idPrefix}-y`}
            label="Y"
            value={(target?.getY() ?? 0).toString()}
            step={0.1}
            placeholder="0"
            onCommit={(newValue) => {
              annotation.setY(newValue ?? 0);
              onCommit();
            }}
          />

          <NumericDraftInput
            id={`${idPrefix}-z`}
            label="Z"
            value={(target?.getZ() ?? 0).toString()}
            step={0.1}
            placeholder="0"
            onCommit={(newValue) => {
              annotation.setZ(newValue ?? 0);
              onCommit();
            }}
          />
        </div>
      </section>
    </section>
  );
}

export default LightResourceTechnicalEditor;
