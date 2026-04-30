import SpatialCoordinatePreview from "../cards/spatial-coordinate-preview";
import TechnicalOptionGroup from "../technical-option-group";
import NumericDraftInput from "../inputs/numeric-draft-input";
import CameraPresets from "../inputs/camera-presets";

import {
  cameraContentResourceTypes,
  type SupportedCameraContentResourceType,
} from "@/utils/content-resource";

const cameraTypeOptions = Object.keys(cameraContentResourceTypes).map((value) => ({
  value,
  label: cameraContentResourceTypes[value]
}));

function CameraResourceTechnicalEditor({
  annotation,
  resource,
  idPrefix,
  onCommit,
  manifestObj
}) {
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
      </section>
    </section>
  );
}

export default CameraResourceTechnicalEditor;
