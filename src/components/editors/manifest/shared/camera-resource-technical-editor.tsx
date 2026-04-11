import { useEffect, useState } from "react";
import type Annotation from "@/ManifestClasses/Annotation";
import type Camera from "@/ManifestClasses/Camera";
import ManifestField from "./manifest-field";
import SpatialCoordinatePreview from "./spatial-coordinate-preview";
import TechnicalOptionGroup from "./technical-option-group";
import {
  cameraContentResourceTypes,
  getCameraContentResourceTypeLabel,
  type SupportedCameraContentResourceType,
} from "@/utils/content-resource";

const cameraTypeOptions = cameraContentResourceTypes.map((value) => ({
  value,
  label: getCameraContentResourceTypeLabel(value),
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

interface CameraResourceTechnicalEditorProps {
  annotation: Annotation;
  resource: Camera;
  idPrefix: string;
  onCommit: () => void;
}

function CameraResourceTechnicalEditor({
  annotation,
  resource,
  idPrefix,
  onCommit,
}: CameraResourceTechnicalEditorProps) {
  const cameraType = resource.getType();
  const target = annotation.getTarget();
  const coordinatePreviewDetails = [
    {
      label: "Type",
      value: getCameraContentResourceTypeLabel(cameraType),
    },
    cameraType === "OrthographicCamera"
      ? {
          label: "View Height",
          value: (resource.getViewHeight() ?? 0).toString(),
        }
      : {
          label: "Field Of View",
          value: `${resource.getFieldOfView() ?? 0}\u00b0`,
        },
  ];

  function handleCameraTypeChange(newValue: string): void {
    resource.setType(newValue as SupportedCameraContentResourceType);
    onCommit();
  }

  return (
    <section className="space-y-6">
      <section className="space-y-3">
        <p className="text-base font-semibold text-slate-950">Camera Type</p>
        <TechnicalOptionGroup
          options={cameraTypeOptions}
          value={cameraType}
          onChange={handleCameraTypeChange}
          selectedVariant="pink"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <NumericDraftInput
          id={`${idPrefix}-near`}
          label="Near"
          value={resource.getNear()?.toString() ?? ""}
          min={0}
          step={0.1}
          placeholder="0.0"
          allowBlank
          onCommit={(newValue) => {
            if (newValue === undefined) {
              resource.removeNear();
            } else {
              resource.setNear(newValue);
            }

            onCommit();
          }}
        />

        <NumericDraftInput
          id={`${idPrefix}-far`}
          label="Far"
          value={resource.getFar()?.toString() ?? ""}
          min={resource.getNear()}
          step={0.1}
          placeholder="0.0"
          allowBlank
          onCommit={(newValue) => {
            if (newValue === undefined) {
              resource.removeFar();
            } else {
              resource.setFar(newValue);
            }

            onCommit();
          }}
        />
      </section>

      {cameraType === "OrthographicCamera" ? (
        <NumericDraftInput
          id={`${idPrefix}-view-height`}
          label="View Height"
          value={resource.getViewHeight()?.toString() ?? ""}
          min={0}
          step={0.1}
          placeholder="0.0"
          onCommit={(newValue) => {
            resource.setViewHeight(newValue ?? 0);
            onCommit();
          }}
        />
      ) : (
        <NumericDraftInput
          id={`${idPrefix}-field-of-view`}
          label="Field of View"
          value={resource.getFieldOfView()?.toString() ?? ""}
          min={0}
          step={1}
          placeholder="0"
          onCommit={(newValue) => {
            resource.setFieldOfView(newValue ?? 0);
            onCommit();
          }}
        />
      )}

      <section className="space-y-4">
        <p className="text-base font-semibold text-slate-950">Position</p>

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

        <SpatialCoordinatePreview
          x={target?.getX() ?? 0}
          y={target?.getY() ?? 0}
          z={target?.getZ() ?? 0}
          details={coordinatePreviewDetails}
        />
      </section>
    </section>
  );
}

export default CameraResourceTechnicalEditor;
