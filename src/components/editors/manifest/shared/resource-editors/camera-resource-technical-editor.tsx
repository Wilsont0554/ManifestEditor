import SpatialCoordinatePreview from "../cards/spatial-coordinate-preview";
import TechnicalOptionGroup from "../technical-option-group";
import NumericDraftInput from "../inputs/numeric-draft-input";

import {
  cameraContentResourceTypes,
  type SupportedCameraContentResourceType,
} from "@/utils/content-resource";
import { transformTypes } from "@/ManifestClasses/Transform";
import SoftActionButton from "../inputs/soft-action-button";
import ManifestField from "../inputs/manifest-field";

const cameraTypeOptions = Object.keys(cameraContentResourceTypes).map((value) => ({
  value,
  label: cameraContentResourceTypes[value]
}));

function CameraResourceTechnicalEditor({
  annotation,
  resource,
  idPrefix,
  onCommit,
}) {
  const transformTypeOptions = transformTypes.map((value) => ({
      value,
      label: value.replace("Transform", ""),
    }));
  const transforms = resource.getTransforms();
  const cameraType = resource.getType();
  const target = annotation.getTarget();
  const coordinatePreviewDetails = [
    {
      label: "Type",
      value: cameraType,
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
         <section className="space-y-4 rounded-xl border border-dashed border-pink-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-950">Transforms</p>
              <p className="text-sm leading-6 text-slate-500">
                Add optional rotate, scale, or translate transforms for this
                model.
              </p>
            </div>

            <SoftActionButton
              onClick={() => {
                resource.addTransform("TranslateTransform");
                onCommit();
              }}
            >
              Add Transform
            </SoftActionButton>
          </div>

          {transforms.map((transform, index) => (
            <section
              key={`${idPrefix}-transform-${index}`}
              className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <ManifestField
                label="Transform Type"
                htmlFor={`${idPrefix}-transform-${index}-type`}
                className="space-y-2"
              >
                <select
                  id={`${idPrefix}-transform-${index}-type`}
                  value={transform.getType()}
                  className="w-full border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 focus:border-pink-500 focus:outline-none"
                  onChange={(event) => {
                    transform.setType(event.target.value);
                    onCommit();
                  }}
                >
                  {transformTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </ManifestField>

              <div className="grid gap-4 sm:grid-cols-3">
                <NumericDraftInput
                  id={`${idPrefix}-transform-${index}-x`}
                  label="X"
                  value={(transform.getX() ?? 0).toString()}
                  step={0.1}
                  placeholder="0"
                  onCommit={(newValue) => {
                    transform.setX(newValue);
                    onCommit();
                  }}
                />

                <NumericDraftInput
                  id={`${idPrefix}-transform-${index}-y`}
                  label="Y"
                  value={(transform.getY() ?? 0).toString()}
                  step={0.1}
                  placeholder="0"
                  onCommit={(newValue) => {
                    transform.setY(newValue);
                    onCommit();
                  }}
                />

                <NumericDraftInput
                  id={`${idPrefix}-transform-${index}-z`}
                  label="Z"
                  value={(transform.getZ() ?? 0).toString()}
                  step={0.1}
                  placeholder="0"
                  onCommit={(newValue) => {
                    transform.setZ(newValue);
                    onCommit();
                  }}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-rose-600 transition hover:text-rose-700"
                  onClick={() => {
                    resource.removeTransform(index);
                    onCommit();
                  }}
                >
                  Remove Transform
                </button>
              </div>
            </section>
          ))}
        </section>
      </section>
    </section>
  );
}

export default CameraResourceTechnicalEditor;
