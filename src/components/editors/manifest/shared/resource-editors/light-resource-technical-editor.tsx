import { manifestObjContext } from "@/context/manifest-context";
import ManifestField from "../inputs/manifest-field";
import ManifestInput from "../inputs/manifest-input";
import SpatialCoordinatePreview from "../cards/spatial-coordinate-preview";
import TechnicalOptionGroup from "../technical-option-group";
import {
  lightContentResourceTypes,
  getAllContentResourceIDs,
  type LightContentResourceType,
} from "@/utils/content-resource";
import NumericDraftInput from "../inputs/numeric-draft-input";
import { clampNumber } from "@/utils/content-resource";
import SliderInput from "../inputs/slider-input";
import { isAdvancedViewContext } from "@/context/manifest-context";
import { useContext } from "react";
import { couldStartTrivia } from "typescript";

const lightTypeOptions = Object.keys(lightContentResourceTypes).map((value) => ({
  value,
  label: lightContentResourceTypes[value]
}));

const DEFAULT_LIGHT_INTENSITY = 0.50;
const LIGHT_INTENSITY_MIN     = 0.00;
const LIGHT_INTENSITY_MAX     = 1.00;
const LIGHT_INTENSITY_STEP    = 0.01;

const DEFAULT_LIGHT_CORDS = 0.00;
const LIGHT_CORDS_MIN     = -100;
const LIGHT_CORDS_MAX     = 100;
const LIGHT_CORDS_STEP    = 0.1;

function LightResourceTechnicalEditor({
  annotation,
  resource,
  idPrefix,
  onCommit,
}) {
  const { advancedView } = useContext(isAdvancedViewContext);
  const { manifestObj } = useContext(manifestObjContext);
  
  const lightType = resource.getType() as LightContentResourceType;
  const intensity = resource.getIntensity();
  const target = annotation.getTarget();
  const coordinatePreviewDetails = [
    {
      label: "Type",
      value: lightType,
    },
    ...(lightType === "SpotLight" && resource.getAngle() !== undefined
      ? [
          {
            label: "Angle",
            value: `${resource.getAngle()}\u00b0`,
          },
        ]
      : []),
  ];
  const testIDs = getAllContentResourceIDs(manifestObj);
  console.log(testIDs);
  let advancedOptions = <></>;

    if (!advancedView){
      advancedOptions = <>
      <p className="text-base font-semibold text-slate-950">Position</p>
      
      <SliderInput
          idPrefix={`${idPrefix}-intensity`}
          value={(target?.getZ() ?? 0).toString()}
          MIN = {LIGHT_CORDS_MIN}
          MAX = {LIGHT_CORDS_MAX}
          STEP = {LIGHT_CORDS_STEP}
          DEFAULT = {DEFAULT_LIGHT_CORDS}
          percent = {false}
          label={"In-Out"}
          onCommit={(newValue) => {
            annotation.setZ(
                clampNumber(
                  newValue,
                  LIGHT_CORDS_MIN,
                  LIGHT_CORDS_MAX,
                ),
              );
            onCommit();
          }}
        />

      <SliderInput
          idPrefix={`${idPrefix}-intensity`}
          value={(target?.getX() ?? 0).toString()}
          MIN = {LIGHT_CORDS_MIN}
          MAX = {LIGHT_CORDS_MAX}
          STEP = {LIGHT_CORDS_STEP}
          DEFAULT = {DEFAULT_LIGHT_CORDS}
          percent = {false}
          label={"Left-Right"}
          onCommit={(newValue) => {
            annotation.setX(
                clampNumber(
                  newValue,
                  LIGHT_CORDS_MIN,
                  LIGHT_CORDS_MAX,
                ),
              );
            onCommit();
          }}
        />
        <SliderInput
          idPrefix={`${idPrefix}-intensity`}
          value={(target?.getY() ?? 0).toString()}
          MIN = {LIGHT_CORDS_MIN}
          MAX = {LIGHT_CORDS_MAX}
          STEP = {LIGHT_CORDS_STEP}
          DEFAULT = {DEFAULT_LIGHT_CORDS}
          percent = {false}
          label={"Down-Up"}
          onCommit={(newValue) => {
            annotation.setY(
                clampNumber(
                  newValue,
                  LIGHT_CORDS_MIN,
                  LIGHT_CORDS_MAX,
                ),
              );
            onCommit();
          }}
        />
      </>
    }
    else{
      advancedOptions = 
      <>
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
      </>
    }

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

        <SliderInput
          idPrefix={`${idPrefix}-intensity`}
          value={intensity?.value}
          onCommit={(newValue) => {
            if (newValue === undefined) {
              resource.removeIntensity();
            } else {
              resource.setIntensity(
                "Value",
                clampNumber(
                  newValue,
                  LIGHT_INTENSITY_MIN,
                  LIGHT_INTENSITY_MAX,
                ),
                "relative",
              );
            }

            onCommit();
          }}
          MIN = {LIGHT_INTENSITY_MIN}
          MAX = {LIGHT_INTENSITY_MAX}
          STEP = {LIGHT_INTENSITY_STEP}
          DEFAULT = {DEFAULT_LIGHT_INTENSITY}
          exact = {true}
          label={"Intensity"}
        />
        
      </section>

      {lightType === "DirectionalLight" ? (<>
        <ManifestField
          label="Looking At"
          htmlFor={``}
          className="space-y-2"
        >
          <select
            id={`${idPrefix}`}
            value={resource.getLookAtId()}
            className="w-full border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 focus:border-pink-500 focus:outline-none"
            onChange={(event) => {
              resource.setLookAt(event.target.value);
              onCommit();
            }}
          >
            {testIDs.map((annotationTest) =>
              <option key={annotationTest.getID()} value={annotationTest.getID()}>{annotationTest.getContentResource()?.getLabel().getValue()}</option>
            )}
          </select>
        </ManifestField>
        
        {advancedView ? (
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
        ) : (null)}
      </>) : null}

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

      <section className="space-y-4">
        {advancedOptions}
      </section>
    </section>
  );
}

export default LightResourceTechnicalEditor;
