import { manifestObjContext } from "@/context/manifest-context";
import {
  getCameraContentResourceItems,
  getContentResourceDisplayTitle,
  getLightContentResourceItems,
} from "@/utils/content-resource";
import {
  builtInManifestBehaviors,
  manifestAutoAdvanceBehaviors,
  manifestOrderingBehaviors,
  manifestRepeatBehaviors,
  manifestViewingDirections,
  type ManifestAutoAdvanceBehavior,
  type ManifestOrderingBehavior,
  type ManifestRepeatBehavior,
  type ManifestViewingDirection,
} from "@/types/iiif";
import { useContext } from "react";
import CameraResourceTechnicalEditor from "../shared/camera-resource-technical-editor";
import LightResourceTechnicalEditor from "../shared/light-resource-technical-editor";
import ManifestCustomBehaviorEditor from "../shared/manifest-custom-behavior-editor";
import ManifestInput from "../shared/manifest-input";
import ManifestTabBody from "../shared/manifest-tab-body";
import ManifestField from "../shared/manifest-field";
import TechnicalOptionGroup from "../shared/technical-option-group";
import DropDownField from "@/components/shared/dropdown-field";

const viewingDirectionOptions = manifestViewingDirections.map((value) => ({
  value,
  label: value
    .replace(/-/g, " ")
    .replace(/^\w/, (character: string) => character.toUpperCase()),
}));

const manifestOrderingOptions = [
  { value: "", label: "None" },
  ...manifestOrderingBehaviors.map((value) => ({
    value,
    label: value,
  })),
];

const repeatOptions = [
  { value: "", label: "None" },
  ...manifestRepeatBehaviors.map((value) => ({
    value,
    label: value,
  })),
];

const autoAdvanceOptions = [
  { value: "", label: "None" },
  ...manifestAutoAdvanceBehaviors.map((value) => ({
    value,
    label: value,
  })),
];

function TechnicalTab() {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const cameraResourceItems = getCameraContentResourceItems(manifestObj);
  const lightResourceItems = getLightContentResourceItems(manifestObj);
  const customBehaviors = manifestObj.getCustomBehaviors();

  function handleIdentifierChange(newValue: string): void {
    manifestObj.setId(newValue);
    updateManifestObj();
  }

  function handleViewingDirectionChange(newValue: string): void {
    manifestObj.setViewingDirection(newValue as ManifestViewingDirection | "");
    updateManifestObj();
  }

  function handleManifestOrderingChange(newValue: string): void {
    manifestObj.setManifestOrderingBehavior(
      newValue as ManifestOrderingBehavior | "",
    );
    updateManifestObj();
  }

  function handleRepeatChange(newValue: string): void {
    manifestObj.setRepeatBehavior(newValue as ManifestRepeatBehavior | "");
    updateManifestObj();
  }

  function handleAutoAdvanceChange(newValue: string): void {
    manifestObj.setAutoAdvanceBehavior(
      newValue as ManifestAutoAdvanceBehavior | "",
    );
    updateManifestObj();
  }

  function handleAddCustomBehavior(value: string): boolean {
    const wasAdded = manifestObj.addCustomBehavior(value);

    if (wasAdded) {
      updateManifestObj();
    }

    return wasAdded;
  }

  function handleRemoveCustomBehavior(value: string): void {
    manifestObj.removeCustomBehavior(value);
    updateManifestObj();
  }

  return (
    <ManifestTabBody className="pb-6">
      <ManifestInput
        label="Identifier"
        id="manifest-identifier"
        type="text"
        value={manifestObj.getId()}
        onChange={handleIdentifierChange}
      />

      {cameraResourceItems.length > 0 ? (
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-lg font-medium text-slate-950">Cameras</p>
            <p className="text-sm leading-6 text-slate-500">
              Edit camera type, clipping planes, position, and type-specific
              settings for each camera content resource.
            </p>
          </div>

          <div className="space-y-4">
            {cameraResourceItems.map(
              ({ annotation, resource, annotationIndex, resourceNumber }) => (
                <section
                  key={`technical-camera-resource-${annotationIndex}`}
                  className="space-y-5 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-pink-200"
                    >
                      Content Resource {resourceNumber}
                    </button>
                    <p className="text-sm text-slate-500">
                      {getContentResourceDisplayTitle(
                        annotation,
                        resource,
                        resourceNumber,
                      )}
                    </p>
                  </div>

                  <CameraResourceTechnicalEditor
                    annotation={annotation}
                    resource={resource}
                    idPrefix={`technical-camera-${annotationIndex}`}
                    onCommit={updateManifestObj}
                  />
                </section>
              ),
            )}
          </div>
        </section>
      ) : null}

      {lightResourceItems.length > 0 ? (
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-lg font-medium text-slate-950">Lights</p>
            <p className="text-sm leading-6 text-slate-500">
              Edit light type, color, intensity, and 3D coordinates for each light
              content resource.
            </p>
          </div>

          <div className="space-y-4">
            {lightResourceItems.map(
              ({ annotation, resource, annotationIndex, resourceNumber }) => (
                <section
                  key={`technical-light-resource-${annotationIndex}`}
                  className="space-y-5 rounded-xl border border-slate-200 bg-white p-5"
                >
                  <div className="space-y-2">
                    <button
                      type="button"
                      className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-pink-200"
                    >
                      Content Resource {resourceNumber}
                    </button>
                    <p className="text-sm text-slate-500">
                      {getContentResourceDisplayTitle(
                        annotation,
                        resource,
                        resourceNumber,
                      )}
                    </p>
                  </div>

                  <LightResourceTechnicalEditor
                    annotation={annotation}
                    resource={resource}
                    idPrefix={`technical-light-${annotationIndex}`}
                    onCommit={updateManifestObj}
                  />
                </section>
              ),
            )}
          </div>
        </section>
      ) : null}

      <ManifestField label="Viewing direction" className="space-y-3">
        <TechnicalOptionGroup
          options={viewingDirectionOptions}
          value={manifestObj.getViewingDirection()}
          onChange={handleViewingDirectionChange}
          allowDeselect
        />
      </ManifestField>

      <ManifestField label="Built in behaviors" className="space-y-2">
        <DropDownField label="Manifest ordering">
          <TechnicalOptionGroup
            options={manifestOrderingOptions}
            value={manifestObj.getManifestOrderingBehavior()}
            onChange={handleManifestOrderingChange}
          />
        </DropDownField>
        <DropDownField label="Repeat">
          <TechnicalOptionGroup
            options={repeatOptions}
            value={manifestObj.getRepeatBehavior()}
            onChange={handleRepeatChange}
            orientation="horizontal"
          />
        </DropDownField>
        <DropDownField label="Auto-advance">
          <TechnicalOptionGroup
            options={autoAdvanceOptions}
            value={manifestObj.getAutoAdvanceBehavior()}
            onChange={handleAutoAdvanceChange}
            orientation="horizontal"
          />
        </DropDownField>
      </ManifestField>
      <ManifestField label="Custom behaviors" className="space-y-4 border-t border-slate-200 pt-6">
        <ManifestCustomBehaviorEditor
          behaviors={customBehaviors}
          reservedBehaviors={builtInManifestBehaviors}
          onAddBehavior={handleAddCustomBehavior}
          onRemoveBehavior={handleRemoveCustomBehavior}
        />
      </ManifestField>
    </ManifestTabBody>
  );
}

export default TechnicalTab;
