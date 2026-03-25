import InputWithLanguage from "@/components/shared/inputWithLanguage";
import { manifestObjContext } from "@/context/manifest-context";
import type Annotation from "@/ManifestClasses/Annotation";
import type ContentResource from "@/ManifestClasses/ContentResource";
import {
  contentResourceTypeToFormat,
  ensureAnnotationHasContentResource,
  type EditableContentResourceType,
} from "@/utils/content-resource";
import { useContext, useState } from "react";
import EmptyStateCard from "../shared/empty-state-card";
import ManifestField from "../shared/manifest-field";
import ManifestInput from "../shared/manifest-input";
import ManifestTabBody from "../shared/manifest-tab-body";
import SoftActionButton from "../shared/soft-action-button";
import TechnicalOptionGroup from "../shared/technical-option-group";

const contentResourceTypeOptions = Object.keys(contentResourceTypeToFormat).map(
  (value) => ({
    value,
    label: value,
  }),
);

function MetadataTab() {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const [selectedAnnotationIndex, setSelectedAnnotationIndex] = useState(0);
  const [isEditingMetadata, setIsEditingMetadata] = useState(false);
  const annotations = manifestObj.getContainerObj().getAnnotationPage().getAllAnnotations();
  const activeAnnotationIndex =
    annotations.length === 0
      ? null
      : Math.min(selectedAnnotationIndex, annotations.length - 1);

  const selectedAnnotation =
    activeAnnotationIndex === null
      ? null
      : annotations[activeAnnotationIndex] ?? null;
  const selectedResource = selectedAnnotation?.getContentResource() ?? null;

  function commitManifestChange(): void {
    updateManifestObj(manifestObj.clone());
  }

  function getAnnotationLabel(annotation: Annotation): string {
    return annotation.getLabel()?.getValue() ?? "";
  }

  function getAnnotationLabelLanguage(annotation: Annotation): string {
    return annotation.getLabel()?.getLanguage() ?? "en";
  }

  function getResourceLabel(resource: ContentResource): string {
    return resource.getLabel().getValue();
  }

  function getResourceLabelLanguage(resource: ContentResource): string {
    return resource.getLabel().getLanguage() ?? "en";
  }

  function handleSelectAnnotation(index: number): void {
    setSelectedAnnotationIndex(index);
    setIsEditingMetadata(false);
  }

  function handleContentResourceTypeChange(
    resource: ContentResource,
    nextType: string,
  ): void {
    const editableType = nextType as EditableContentResourceType;
    resource.setType(editableType);
    resource.setFormat(contentResourceTypeToFormat[editableType]);
    commitManifestChange();
  }

  function handleAnnotationLabelChange(newValue: string): void {
    if (!selectedAnnotation) {
      return;
    }

    selectedAnnotation.changeLabel(
      0,
      newValue,
      getAnnotationLabelLanguage(selectedAnnotation),
    );
    commitManifestChange();
  }

  function handleAnnotationLabelLanguageChange(newLanguageCode: string): void {
    if (!selectedAnnotation) {
      return;
    }

    selectedAnnotation.changeLabel(
      0,
      getAnnotationLabel(selectedAnnotation),
      newLanguageCode,
    );
    commitManifestChange();
  }

  function handleResourceLabelChange(newValue: string): void {
    if (!selectedResource) {
      return;
    }

    selectedResource.changeLabel(
      0,
      newValue,
      getResourceLabelLanguage(selectedResource),
    );
    commitManifestChange();
  }

  function handleResourceLabelLanguageChange(newLanguageCode: string): void {
    if (!selectedResource) {
      return;
    }

    selectedResource.changeLabel(
      0,
      getResourceLabel(selectedResource),
      newLanguageCode,
    );
    commitManifestChange();
  }

  function handleOpenMetadata(index: number): void {
    const resource = ensureAnnotationHasContentResource(annotations[index]);
    const metadata = resource.getMetadata();

    if (metadata.getEntryCount() === 0) {
      metadata.addEntry("", "", "en");
      commitManifestChange();
    }

    setSelectedAnnotationIndex(index);
    setIsEditingMetadata(true);
  }

  function handleInitializeResource(index: number): void {
    ensureAnnotationHasContentResource(annotations[index]);
    setSelectedAnnotationIndex(index);
    setIsEditingMetadata(false);
    commitManifestChange();
  }

  if (annotations.length === 0) {
    return (
      <ManifestTabBody>
        <EmptyStateCard
          title="No content resources"
          description="Use Add Content Resource in the editor toolbar to create a resource, then manage its labels and metadata here."
          align="left"
          className="border border-slate-200 bg-slate-50"
          descriptionClassName="max-w-none text-base leading-relaxed text-slate-500"
        />
      </ManifestTabBody>
    );
  }

  return (
    <ManifestTabBody className="pb-6">
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-950">Content resources</p>
          <p className="text-sm leading-6 text-slate-500">
            Select a resource to edit its fields or jump directly into metadata.
          </p>
        </div>

        <div className="space-y-3">
          {annotations.map((annotation, index) => {
            const resource = annotation.getContentResource();
            const hasMetadata = resource?.getMetadata().getEntryCount() ?? 0;
            const isSelected = activeAnnotationIndex === index;

            return (
              <div
                key={`${annotation.getID()}-${index}`}
                className="flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3"
              >
                <button
                  type="button"
                  className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                    isSelected
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => handleSelectAnnotation(index)}
                >
                  Content Resource {index + 1}
                </button>

                {resource ? (
                  <SoftActionButton onClick={() => handleOpenMetadata(index)}>
                    {hasMetadata > 0 ? "Edit Metadata" : "Add Metadata"}
                  </SoftActionButton>
                ) : (
                  <SoftActionButton onClick={() => handleInitializeResource(index)}>
                    Initialize Resource
                  </SoftActionButton>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {selectedAnnotation ? (
        selectedResource ? (
          !isEditingMetadata ? (
            <section className="space-y-6 border-t border-slate-200 pt-8">
              <div className="space-y-1">
                <p className="text-lg font-medium text-slate-950">
                  Resource {activeAnnotationIndex! + 1}
                </p>
                <p className="text-sm leading-6 text-slate-500">
                  Update the selected content resource and its annotation label.
                </p>
              </div>

              <section className="space-y-3">
                <p className="text-base font-semibold text-slate-950">Type</p>
                <TechnicalOptionGroup
                  options={contentResourceTypeOptions}
                  value={selectedResource.getType()}
                  onChange={(newValue) =>
                    handleContentResourceTypeChange(selectedResource, newValue)
                  }
                  orientation="horizontal"
                />
              </section>

              <ManifestInput
                label="Resource URL"
                id="metadata-resource-url"
                type="text"
                value={selectedResource.id}
                onChange={(newValue) => {
                  selectedResource.setID(newValue);
                  commitManifestChange();
                }}
              />

              <InputWithLanguage
                label="Annotation Label"
                languageCode={getAnnotationLabelLanguage(selectedAnnotation)}
                value={getAnnotationLabel(selectedAnnotation)}
                onChange={handleAnnotationLabelChange}
                onLanguageChange={handleAnnotationLabelLanguageChange}
              />

              <InputWithLanguage
                label="Content Resource Label"
                languageCode={getResourceLabelLanguage(selectedResource)}
                value={getResourceLabel(selectedResource)}
                onChange={handleResourceLabelChange}
                onLanguageChange={handleResourceLabelLanguageChange}
              />

              <section className="space-y-3">
                <ManifestField label="Metadata">
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {selectedResource.getMetadata().getEntryCount() > 0
                      ? "Open the metadata editor to review or update existing entries."
                      : "This resource does not have metadata yet. Start by creating your first entry."}
                  </p>
                </ManifestField>
                <SoftActionButton
                  onClick={() => handleOpenMetadata(activeAnnotationIndex!)}
                >
                  {selectedResource.getMetadata().getEntryCount() > 0
                    ? "Edit Metadata"
                    : "Add Metadata"}
                </SoftActionButton>
              </section>
            </section>
          ) : (
            <section className="space-y-6 border-t border-slate-200 pt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-lg font-medium text-slate-950">
                    Metadata for Resource {activeAnnotationIndex! + 1}
                  </p>
                  <p className="text-sm leading-6 text-slate-500">
                    Add, update, or remove metadata entries for this content resource.
                  </p>
                </div>
                <SoftActionButton onClick={() => setIsEditingMetadata(false)}>
                  Back to Resource
                </SoftActionButton>
              </div>

              {selectedResource.getMetadata().getEntryCount() === 0 ? (
                <EmptyStateCard
                  title="No metadata entries"
                  description="Create the first metadata entry for this content resource."
                  align="left"
                  className="border border-slate-200 bg-slate-50"
                  descriptionClassName="max-w-none text-base leading-relaxed text-slate-500"
                />
              ) : null}

              <div className="space-y-6">
                {selectedResource.getMetadata().getAllEntries().map((entry, index) => (
                  <section
                    key={`${activeAnnotationIndex}-${index}`}
                    className="space-y-4 rounded-md border border-slate-200 bg-slate-50 p-4"
                  >
                    <InputWithLanguage
                      label="Metadata Label"
                      languageCode={entry.getLabelLanguage()}
                      value={entry.getLabelText()}
                      onChange={(newValue) => {
                        entry.setLabel(newValue);
                        commitManifestChange();
                      }}
                      onLanguageChange={(newLanguageCode) => {
                        entry.setLanguage(newLanguageCode);
                        commitManifestChange();
                      }}
                    />

                    <InputWithLanguage
                      label="Metadata Value"
                      languageCode={entry.getValueLanguage()}
                      value={entry.getValueText()}
                      onChange={(newValue) => {
                        entry.setValue(newValue);
                        commitManifestChange();
                      }}
                      onLanguageChange={(newLanguageCode) => {
                        entry.setLanguage(newLanguageCode);
                        commitManifestChange();
                      }}
                      rows={3}
                      textareaClassName="min-h-28"
                    />

                    <SoftActionButton
                      className="bg-white text-slate-700 hover:bg-slate-100"
                      onClick={() => {
                        selectedResource.getMetadata().removeEntry(index);
                        commitManifestChange();
                      }}
                    >
                      Remove Entry
                    </SoftActionButton>
                  </section>
                ))}
              </div>

              <SoftActionButton
                onClick={() => {
                  selectedResource.getMetadata().addEntry("", "", "en");
                  commitManifestChange();
                }}
              >
                + Add Metadata Entry
              </SoftActionButton>
            </section>
          )
        ) : (
          <section className="border-t border-slate-200 pt-8">
            <EmptyStateCard
              title="Resource details unavailable"
              description="Initialize the selected annotation as a content resource before editing metadata."
              align="left"
              className="border border-slate-200 bg-slate-50"
              descriptionClassName="max-w-none text-base leading-relaxed text-slate-500"
              action={
                <SoftActionButton
                  className="bg-white text-slate-700 hover:bg-slate-100"
                  onClick={() => handleInitializeResource(activeAnnotationIndex!)}
                >
                  Initialize Resource
                </SoftActionButton>
              }
            />
          </section>
        )
      ) : null}
    </ManifestTabBody>
  );
}

export default MetadataTab;
