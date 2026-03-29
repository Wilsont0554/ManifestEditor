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
import { type ReactNode, useContext, useState } from "react";
import CameraResourceTechnicalEditor from "../shared/camera-resource-technical-editor";
import LightResourceTechnicalEditor from "../shared/light-resource-technical-editor";
import ManifestCustomBehaviorEditor from "../shared/manifest-custom-behavior-editor";
import ManifestInput from "../shared/manifest-input";
import ManifestTabBody from "../shared/manifest-tab-body";
import TechnicalOptionGroup from "../shared/technical-option-group";

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

type TechnicalSectionId = "manifestOrdering" | "repeat" | "autoAdvance";

interface TechnicalBehaviorSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 12 8"
      className={`h-3 w-3 text-slate-500 transition-transform ${
        isOpen ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path
        d="M1 1.5 6 6.5 11 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TechnicalBehaviorSection({
  title,
  isOpen,
  onToggle,
  children,
}: TechnicalBehaviorSectionProps) {
  return (
    <section className="border-t border-slate-200">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-[15px] font-semibold uppercase tracking-[0.02em] text-slate-500">
          {title}
        </span>
        <ChevronIcon isOpen={isOpen} />
      </button>
      {isOpen ? <div className="pb-4"><TechnicalOptionGroupContent>{children}</TechnicalOptionGroupContent></div> : null}
    </section>
  );
}

function TechnicalOptionGroupContent({ children }: { children: ReactNode }) {
  return <div className="space-y-3">{children}</div>;
}

function TechnicalTab() {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const cameraResourceItems = getCameraContentResourceItems(manifestObj);
  const lightResourceItems = getLightContentResourceItems(manifestObj);
  const [openSections, setOpenSections] = useState<
    Record<TechnicalSectionId, boolean>
  >({
    manifestOrdering: true,
    repeat: true,
    autoAdvance: true,
  });
  const customBehaviors = manifestObj.getCustomBehaviors();

  function commitManifestChange(): void {
    updateManifestObj(manifestObj.clone());
  }

  function toggleSection(sectionId: TechnicalSectionId): void {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId],
    }));
  }

  function handleIdentifierChange(newValue: string): void {
    manifestObj.setId(newValue);
    commitManifestChange();
  }

  function handleViewingDirectionChange(newValue: string): void {
    manifestObj.setViewingDirection(newValue as ManifestViewingDirection | "");
    commitManifestChange();
  }

  function handleManifestOrderingChange(newValue: string): void {
    manifestObj.setManifestOrderingBehavior(
      newValue as ManifestOrderingBehavior | "",
    );
    commitManifestChange();
  }

  function handleRepeatChange(newValue: string): void {
    manifestObj.setRepeatBehavior(newValue as ManifestRepeatBehavior | "");
    commitManifestChange();
  }

  function handleAutoAdvanceChange(newValue: string): void {
    manifestObj.setAutoAdvanceBehavior(
      newValue as ManifestAutoAdvanceBehavior | "",
    );
    commitManifestChange();
  }

  function handleAddCustomBehavior(value: string): boolean {
    const wasAdded = manifestObj.addCustomBehavior(value);

    if (wasAdded) {
      commitManifestChange();
    }

    return wasAdded;
  }

  function handleRemoveCustomBehavior(value: string): void {
    manifestObj.removeCustomBehavior(value);
    commitManifestChange();
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
                    onCommit={commitManifestChange}
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
                    onCommit={commitManifestChange}
                  />
                </section>
              ),
            )}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <p className="text-lg font-medium text-slate-950">Viewing direction</p>
        <TechnicalOptionGroup
          options={viewingDirectionOptions}
          value={manifestObj.getViewingDirection()}
          onChange={handleViewingDirectionChange}
          allowDeselect
        />
      </section>

      <section className="space-y-2">
        <p className="text-lg font-medium text-slate-950">Built-in behaviors</p>

        <TechnicalBehaviorSection
          title="Manifest ordering"
          isOpen={openSections.manifestOrdering}
          onToggle={() => toggleSection("manifestOrdering")}
        >
          <TechnicalOptionGroup
            options={manifestOrderingOptions}
            value={manifestObj.getManifestOrderingBehavior()}
            onChange={handleManifestOrderingChange}
          />
        </TechnicalBehaviorSection>

        <TechnicalBehaviorSection
          title="Repeat"
          isOpen={openSections.repeat}
          onToggle={() => toggleSection("repeat")}
        >
          <TechnicalOptionGroup
            options={repeatOptions}
            value={manifestObj.getRepeatBehavior()}
            onChange={handleRepeatChange}
            orientation="horizontal"
          />
        </TechnicalBehaviorSection>

        <TechnicalBehaviorSection
          title="Auto-advance"
          isOpen={openSections.autoAdvance}
          onToggle={() => toggleSection("autoAdvance")}
        >
          <TechnicalOptionGroup
            options={autoAdvanceOptions}
            value={manifestObj.getAutoAdvanceBehavior()}
            onChange={handleAutoAdvanceChange}
            orientation="horizontal"
          />
        </TechnicalBehaviorSection>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-6">
        <p className="text-lg font-medium text-slate-950">Behaviors</p>
        <ManifestCustomBehaviorEditor
          behaviors={customBehaviors}
          reservedBehaviors={builtInManifestBehaviors}
          onAddBehavior={handleAddCustomBehavior}
          onRemoveBehavior={handleRemoveCustomBehavior}
        />
      </section>
    </ManifestTabBody>
  );
}

export default TechnicalTab;
