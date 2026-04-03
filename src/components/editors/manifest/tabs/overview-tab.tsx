import InputWithLanguage from "@/components/shared/inputWithLanguage";
import { manifestObjContext } from "@/context/manifest-context";
import type ContentResource from "@/ManifestClasses/ContentResource";
import {
  getCameraContentResourceItems,
  getContentResourceDisplayTitle,
  getDisplayableContentResourceItems,
  getLightContentResourceItems,
  hasLightTechnicalChanges,
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
import { useContext, useState } from "react";
import CameraResourceTechnicalEditor from "../shared/camera-resource-technical-editor";
import LightResourceTechnicalEditor from "../shared/light-resource-technical-editor";
import ManifestCustomBehaviorEditor from "../shared/manifest-custom-behavior-editor";
import ContentResourceMediaList from "../shared/content-resource-media-list";
import ManifestInput from "../shared/manifest-input";
import ManifestTabBody from "../shared/manifest-tab-body";
import TechnicalOptionGroup from "../shared/technical-option-group";
import DropDownField from "@/components/shared/dropdown-field";
import ManifestField from "../shared/manifest-field";

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

interface OverviewBehaviorSummaryItem {
  sectionId: TechnicalSectionId;
  value: string;
}

interface OverviewMetadataSummaryItem {
  resourceIndex: number;
  resource: ContentResource;
}

function OverviewMetadataField({
  label,
  value,
  languageCode,
  multiline = false,
}: {
  label: string;
  value: string;
  languageCode?: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <div className="relative overflow-hidden border-b-2 border-pink-500 bg-slate-100">
        <p
          className={`px-4 py-3 text-base text-slate-900 ${
            languageCode ? "pr-16" : ""
          } ${multiline ? "whitespace-pre-wrap leading-6" : ""}`}
        >
          {value}
        </p>

        {languageCode ? (
          <span className="absolute right-2 top-2 rounded-md bg-slate-200 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {languageCode}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function OverviewTab() {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const behaviorSummaryItems: OverviewBehaviorSummaryItem[] = [];
  const metadataSummaryItems: OverviewMetadataSummaryItem[] = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations()
    .map((annotation, resourceIndex) => ({
      resourceIndex,
      resource: annotation.getContentResource(),
    }))
    .filter(
      (item): item is OverviewMetadataSummaryItem =>
        !!item.resource &&
        item.resource.getMetadata().getEntryCount() > 0,
    );
  const contentResourceMediaItems =
    getDisplayableContentResourceItems(manifestObj);
  const editedCameraResourceItems = getCameraContentResourceItems(manifestObj);
  const editedLightResourceItems = getLightContentResourceItems(manifestObj).filter(
    ({ annotation, resource }) => hasLightTechnicalChanges(annotation, resource),
  );

  function handleLanguageChange(newLanguageCode: string) {
    manifestObj.setLabelLanguage(newLanguageCode);
    updateManifestObj();
  };

  function handleInputChange(newValue: string){
    manifestObj.setLabel(newValue);
    updateManifestObj();
  };

  function handleSummaryLanguageChange(newLanguageCode: string) {
    manifestObj.setSummaryLanguage(newLanguageCode);
    updateManifestObj();
  };

  function handleSummaryChange(newValue: string) {
    manifestObj.setSummary(newValue);
    updateManifestObj();
  };

  function handleRightsChange(newValue: string) {
    manifestObj.setRights(newValue);
    updateManifestObj();
  };

  function handleNavDateChange(newValue: string){
    manifestObj.setNavDate(newValue);
    updateManifestObj();
  };

  function handleIdentifierChange(newValue: string) {
    manifestObj.setId(newValue);
    updateManifestObj();
  }

  function handleViewingDirectionChange(newValue: string) {
    manifestObj.setViewingDirection(newValue as ManifestViewingDirection | "");
    updateManifestObj();
  }

  function handleManifestOrderingChange(newValue: string) {
    manifestObj.setManifestOrderingBehavior(
      newValue as ManifestOrderingBehavior | "",
    );
    updateManifestObj();
  };

  function handleRepeatChange(newValue: string) {
    manifestObj.setRepeatBehavior(newValue as ManifestRepeatBehavior | "");
    updateManifestObj();
  }

  function handleAutoAdvanceChange(newValue: string) {
    manifestObj.setAutoAdvanceBehavior(
      newValue as ManifestAutoAdvanceBehavior | "",
    );
    updateManifestObj();
  };

  function handleAddCustomBehavior(value: string) {
    const wasAdded = manifestObj.addCustomBehavior(value);
    if (wasAdded) {
      updateManifestObj();
    }
    return wasAdded;
  };

  function handleRemoveCustomBehavior(value: string){
    manifestObj.removeCustomBehavior(value);
    updateManifestObj();
  }

  return (
    <ManifestTabBody className="pb-6">
        <section className="space-y-6">
            <InputWithLanguage
              label="Label"
              languageCode={manifestObj.getLabelLanguage()}
              value={manifestObj.getLabelValue()}
              onChange={handleInputChange}
              onLanguageChange={handleLanguageChange}
            />
            <InputWithLanguage
              label="Summary"
              languageCode={manifestObj.getSummaryLanguage()}
              value={manifestObj.getSummaryValue()}
              onChange={handleSummaryChange}
              onLanguageChange={handleSummaryLanguageChange}
              rows={3}
              textareaClassName="min-h-28"
            />
            <ManifestInput
              label="Rights"
              id="overview-manifest-rights"
              type="text"
              value={manifestObj.getRights()}
              onChange={handleRightsChange}
            />
            <ManifestInput
              label="Nav Date"
              id="overview-manifest-nav-date"
              type="datetime-local"
              value={manifestObj.getNavDate()}
              onChange={handleNavDateChange}
              appearance="outline"
            />
        </section>

        <section
          className={`space-y-4`}
        >
          <p className="text-lg font-medium text-slate-950">Media</p>

          <ContentResourceMediaList items={contentResourceMediaItems} />
        </section>

        <section className="space-y-4 border-t border-slate-200 pt-8">
          <div className="space-y-1">
            <p className="text-lg font-medium text-slate-950">Metadata</p>
            <p className="text-sm leading-6 text-slate-500">
              Metadata changes from the Metadata tab are summarized here.
            </p>
          </div>

          <div className="space-y-4">
            {metadataSummaryItems.map(({ resourceIndex, resource }) => (
              <section
                key={`overview-metadata-resource-${resourceIndex}`}
                className="overflow-hidden rounded-md border border-slate-200"
              >
                <div className="border-b border-slate-200 bg-white px-4 py-3">
                  <p className="text-[15px] font-semibold text-slate-950">
                    Content Resource {resourceIndex + 1}
                  </p>
                  {resource.id ? (
                    <p className="mt-1 text-sm text-slate-500">{resource.id}</p>
                  ) : null}
                </div>

                <div className="divide-y divide-slate-200">
                  {resource
                    .getMetadata()
                    .getAllEntries()
                    .map((entry, entryIndex) => (
                      <div
                        key={`overview-metadata-entry-${resourceIndex}-${entryIndex}`}
                        className="space-y-4 bg-white px-4 py-4"
                      >
                        <OverviewMetadataField
                          label="Label"
                          value={entry.getLabelText() || "Untitled metadata"}
                          languageCode={entry.getLabelLanguage()}
                        />

                        <OverviewMetadataField
                          label="Value"
                          value={entry.getValueText() || "No value"}
                          multiline
                        />
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </section>
        <ManifestField 
          className={`space-y-6 "border-t border-slate-200 pt-8`}
          label="Behaviors"
        >
            <ManifestInput
              label="Identifier"
              id="overview-manifest-identifier"
              type="text"
              value={manifestObj.getId()}
              onChange={handleIdentifierChange}
            />

            <section className="space-y-4">
              <div className="space-y-1">
                <p className="text-lg font-medium text-slate-950">Cameras</p>
                <p className="text-sm leading-6 text-slate-500">
                  Camera configuration changes from the Technical tab appear here.
                </p>
              </div>

              <div className="space-y-4">
                {editedCameraResourceItems.map(
                  ({ annotation, resource, annotationIndex, resourceNumber }) => (
                    <section
                      key={`overview-camera-resource-${annotationIndex}`}
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
                        idPrefix={`overview-camera-${annotationIndex}`}
                        onCommit={updateManifestObj}
                      />
                    </section>
                  ),
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="space-y-1">
                <p className="text-lg font-medium text-slate-950">Lights</p>
                <p className="text-sm leading-6 text-slate-500">
                  Light configuration changes from the Technical tab appear here.
                </p>
              </div>

              <div className="space-y-4">
                {editedLightResourceItems.map(
                  ({ annotation, resource, annotationIndex, resourceNumber }) => (
                    <section
                      key={`overview-light-resource-${annotationIndex}`}
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
                        idPrefix={`overview-light-${annotationIndex}`}
                        onCommit={updateManifestObj}
                      />
                    </section>
                  ),
                )}
              </div>
            </section>
            <ManifestField label="Viewing direction">
              <TechnicalOptionGroup
                options={viewingDirectionOptions}
                value={manifestObj.getViewingDirection()}
                onChange={handleViewingDirectionChange}
                allowDeselect
              />
            </ManifestField>
            <ManifestField label= "Behaviors">
                <DropDownField label="Manifest ordering">
                    <div className="pb-4">
                      <TechnicalOptionGroup
                        options={manifestOrderingOptions}
                        value={manifestObj.getManifestOrderingBehavior()}
                        onChange={handleManifestOrderingChange}
                      />
                    </div>
                </DropDownField>
                <DropDownField label="Repeat">
                    <div className="pb-4">
                      <TechnicalOptionGroup
                        options={repeatOptions}
                        value={manifestObj.getRepeatBehavior()}
                        onChange={handleRepeatChange}
                        orientation="horizontal"
                      />
                    </div>
                </DropDownField>
                <DropDownField label="Auto-advance">
                    <div className="pb-4">
                      <TechnicalOptionGroup
                        options={autoAdvanceOptions}
                        value={manifestObj.getAutoAdvanceBehavior()}
                        onChange={handleAutoAdvanceChange}
                        orientation="horizontal"
                      />
                    </div>
                </DropDownField>
            </ManifestField>
            <section className="space-y-4">
              <p className="text-lg font-medium text-slate-950">Behaviors</p>
              {behaviorSummaryItems.length > 0 ? (
                <div className="overflow-hidden border-t border-slate-200">
                  {behaviorSummaryItems.map((item) => (
                    <div
                      key={`${item.sectionId}-${item.value}`}
                      className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <span className="text-base text-slate-900">
                        {item.value}
                      </span>
                      <button
                        type="button"
                        className="text-base font-medium text-slate-500 transition hover:text-slate-700"
                        onClick={() => {}}
                      >
                        edit -&gt;
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <ManifestCustomBehaviorEditor
                behaviors={manifestObj.getCustomBehaviors()}
                reservedBehaviors={builtInManifestBehaviors}
                onAddBehavior={handleAddCustomBehavior}
                onRemoveBehavior={handleRemoveCustomBehavior}
              />
            </section>
        </ManifestField>
    </ManifestTabBody>
  );
}

export default OverviewTab;
