import { useEffect, useState } from "react";
import InputWithLanguage from "@/components/shared/inputWithLanguage";
import Camera from "@/ManifestClasses/Camera";
import Light from "@/ManifestClasses/Light";
import { transformTypes } from "@/ManifestClasses/Transform";
import {
  contentResourceTypeToFormat,
} from "@/utils/content-resource";
import ManifestField from "../inputs/manifest-field";
import ManifestInput from "../inputs/manifest-input";
import SoftActionButton from "../inputs/soft-action-button";
import SpatialCoordinatePreview from "../cards/spatial-coordinate-preview";
import TechnicalOptionGroup from "../technical-option-group";
import NumericDraftInput from "../inputs/numeric-draft-input";

const contentResourceTypeOptions = Object.keys(contentResourceTypeToFormat).map(
  (value) => ({
    value,
    label: value,
  }),
);

const transformTypeOptions = transformTypes.map((value) => ({
  value,
  label: value.replace("Transform", ""),
}));

function ContentResourceEditor({
  annotation,
  resource,
  idPrefix,
  onCommit,
  className = "",
  showTypeSelector = true,
}) {
  const isLightResource = resource instanceof Light;
  const isCameraResource = resource instanceof Camera;
  const isModelResource = resource.isModelResource();
  const transforms = resource.getTransforms();
  const shouldShowTypeSelector =
    showTypeSelector && !isLightResource && !isCameraResource;
  const target = annotation.getTarget();

  function getResourceLabel(): string {
    return resource.getLabel().getValue();
  }

  function getResourceLabelLanguage(): string {
    return resource.getLabel().getLanguage() ?? "en";
  }

  function handleContentResourceTypeChange(nextType: string): void {
    if (!(nextType in contentResourceTypeToFormat)) {
      return;
    }

    const previousType = resource.getType();
    const editableType = nextType as keyof typeof contentResourceTypeToFormat;
    resource.setType(editableType);
    resource.setFormat(contentResourceTypeToFormat[editableType]);

    if (previousType === "Model" && editableType !== "Model") {
      resource.clearTransforms();
    }

    onCommit();
   }

  function handleResourceLabelChange(newValue: string): void {
    const languageCode = getResourceLabelLanguage();

    resource.changeLabel(0, newValue, languageCode);
    onCommit();
  }

  function handleResourceLabelLanguageChange(newLanguageCode: string): void {
    const currentValue = getResourceLabel();

    resource.changeLabel(0, currentValue, newLanguageCode);
    onCommit();
  }

  return (
    <section className={`space-y-6 ${className}`}>
      {shouldShowTypeSelector ? (
        <section className="space-y-3">
          <p className="text-base font-semibold text-slate-950">Type</p>
          <TechnicalOptionGroup
            options={contentResourceTypeOptions}
            value={resource.getType()}
            onChange={handleContentResourceTypeChange}
            orientation="horizontal"
            selectedVariant="pink"
          />
        </section>
      ) : null}

      {isLightResource || isCameraResource ? (
        <ManifestInput
          label={isLightResource ? "Light Identifier" : "Camera Identifier"}
          id={`${idPrefix}-${isLightResource ? "light" : "camera"}-identifier`}
          type="text"
          value={resource.id}
          onChange={() => {}}
          appearance="outline"
          readOnly
          inputClassName="bg-slate-50 text-slate-500"
        />
      ) : (
        <ManifestInput
          label="Resource URL"
          id={`${idPrefix}-resource-url`}
          type="text"
          value={resource.id}
          onChange={(newValue) => {
            resource.setID(newValue);
            onCommit();
          }}
        />
      )}

{/**<InputWithLanguage
        label="Annotation Label"
        languageCode={getAnnotationLabelLanguage()}
        value={getAnnotationLabel()}
        onChange={handleAnnotationLabelChange}
        onLanguageChange={handleAnnotationLabelLanguageChange}
      />
 */}
      
      <InputWithLanguage
        label="Content Resource Label"
        languageCode={getResourceLabelLanguage()}
        value={getResourceLabel()}
        onChange={handleResourceLabelChange}
        onLanguageChange={handleResourceLabelLanguageChange}
      />

      {!isLightResource && !isCameraResource ? (
        <section className="space-y-4">
          <p className="text-base font-semibold text-slate-950">Position</p>

          <div className="grid gap-4 sm:grid-cols-3">
            <NumericDraftInput
              id={`${idPrefix}-position-x`}
              label="X"
              value={(target?.getX() ?? 0).toString()}
              step={0.1}
              placeholder="0"
              onCommit={(newValue) => {
                annotation.setX(newValue);
                onCommit();
              }}
            />

            <NumericDraftInput
              id={`${idPrefix}-position-y`}
              label="Y"
              value={(target?.getY() ?? 0).toString()}
              step={0.1}
              placeholder="0"
              onCommit={(newValue) => {
                annotation.setY(newValue);
                onCommit();
              }}
            />

            <NumericDraftInput
              id={`${idPrefix}-position-z`}
              label="Z"
              value={(target?.getZ() ?? 0).toString()}
              step={0.1}
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
      ) : null}

      {isModelResource ? (
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
      ) : null}
    </section>
  );
}

export default ContentResourceEditor;
