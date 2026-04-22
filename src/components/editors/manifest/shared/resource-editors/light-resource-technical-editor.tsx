import ManifestField from "../inputs/manifest-field";
import ManifestInput from "../inputs/manifest-input";
import SpatialCoordinatePreview from "../cards/spatial-coordinate-preview";
import TechnicalOptionGroup from "../technical-option-group";
import {
  lightContentResourceTypes,
  type LightContentResourceType,
} from "@/utils/content-resource";
import NumericDraftInput from "../inputs/numeric-draft-input";
import { clampNumber } from "@/utils/content-resource";
import { transformTypes } from "@/ManifestClasses/Transform";
import SoftActionButton from "../inputs/soft-action-button";

const lightTypeOptions = Object.keys(lightContentResourceTypes).map((value) => ({
  value,
  label: lightContentResourceTypes[value]
}));

const DEFAULT_LIGHT_INTENSITY = 0.50;
const LIGHT_INTENSITY_MIN = 0.00;
const LIGHT_INTENSITY_MAX = 1.00;
const LIGHT_INTENSITY_STEP = 0.01;

function LightIntensityInput({
  idPrefix,
  value,
  onCommit,
}) {
  const sliderValue = clampNumber(
    value ?? DEFAULT_LIGHT_INTENSITY,
    LIGHT_INTENSITY_MIN,
    LIGHT_INTENSITY_MAX,
  );
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
        clampDraftToRange
        onCommit={onCommit}
      />
    </section>
  );
}

function LightResourceTechnicalEditor({
  annotation,
  resource,
  idPrefix,
  onCommit,
}) {
  const lightType = resource.getType() as LightContentResourceType;
  const transformTypeOptions = transformTypes.map((value) => ({
    value,
    label: value.replace("Transform", ""),
  }));
  const transforms = resource.getTransforms();
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
        />
      </section>

      {lightType === "DirectionalLight" ? (<>
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

export default LightResourceTechnicalEditor;
