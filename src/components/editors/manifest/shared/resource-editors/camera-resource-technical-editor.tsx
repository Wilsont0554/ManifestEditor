import SpatialCoordinatePreview from "../cards/spatial-coordinate-preview";
import TechnicalOptionGroup from "../technical-option-group";
import NumericDraftInput from "../inputs/numeric-draft-input";

import {
  cameraContentResourceTypes,
  clampNumber,
  type SupportedCameraContentResourceType,
} from "@/utils/content-resource";
import SliderInput from "../inputs/slider-input";
import { useContext } from "react";
import { isAdvancedViewContext } from "@/context/manifest-context";

const cameraTypeOptions = Object.keys(cameraContentResourceTypes).map((value) => ({
  value,
  label: cameraContentResourceTypes[value]
}));

const COORD_MIN = -25;
const COORD_MAX = 25;
const COORD_STEP = 0.1;

function CameraResourceTechnicalEditor({
  annotation,
  resource,
  idPrefix,
  onCommit,
}) {
  
  const { advancedView } =
    useContext(isAdvancedViewContext);
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

  let advancedOptions = <></>;

  function handleCameraTypeChange(newValue: string): void {
    resource.setType(newValue as SupportedCameraContentResourceType);
    onCommit();
  }

  if (!advancedView){
    advancedOptions =
    <>
      <section className="space-y-4">
      <p className="text-base font-semibold text-slate-950">Position</p>
      
      <SliderInput
          idPrefix={`${idPrefix}-intensity`}
          value={(target?.getZ() ?? 0).toString()}
          MIN = {COORD_MIN}
          MAX = {COORD_MAX}
          STEP = {COORD_STEP}
          DEFAULT = {0}
          percent = {false}
          label={"Zoom: In-Out"}
          onCommit={(newValue) => {
            annotation.setZ(
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
          value={(target?.getX() ?? 0).toString()}
          MIN = {-COORD_MAX}
          MAX = {COORD_MAX}
          STEP = {COORD_STEP}
          DEFAULT = {0}
          percent = {false}
          label={"Pan: Left-Right"}
          onCommit={(newValue) => {
            annotation.setX(
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
          label={"Pan: Down-Up"}
          onCommit={(newValue) => {
            annotation.setY(
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
      <div className="grid gap-4 sm:grid-cols-3">
            <NumericDraftInput
              id={`${idPrefix}-x`}
              label="X"
              value={(target?.getX() ?? 0).toString()}
              step={COORD_STEP}
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
              step={COORD_STEP}
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
              step={COORD_STEP}
              placeholder="0"
              onCommit={(newValue) => {
                annotation.setZ(newValue ?? 0);
                onCommit();
              }}
            />
      </div>

      <section className="grid gap-4 sm:grid-cols-2">
        <NumericDraftInput
          id={`${idPrefix}-near`}
          label="Near"
          value={resource.getNear()?.toString() ?? ""}
          min={0}
          step={COORD_STEP}
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
          step={COORD_STEP}
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

      <SpatialCoordinatePreview
        x={target?.getX() ?? 0}
        y={target?.getY() ?? 0}
        z={target?.getZ() ?? 0}
        details={coordinatePreviewDetails}
      /></>
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

      {cameraType === "OrthographicCamera" ? (
        <NumericDraftInput
          id={`${idPrefix}-view-height`}
          label="View Height"
          value={resource.getViewHeight()?.toString() ?? ""}
          min={0}
          step={COORD_STEP}
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

      {advancedOptions}        
    </section>
  );
}

export default CameraResourceTechnicalEditor;
