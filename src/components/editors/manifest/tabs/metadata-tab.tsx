import { type KeyboardEvent as ReactKeyboardEvent, useContext } from "react";
import InputWithLanguage from "@/components/shared/inputWithLanguage";
import { manifestObjContext } from "@/context/manifest-context";
import type Annotation from "@/ManifestClasses/Annotation";
import type ContentResource from "@/ManifestClasses/ContentResource";
import {
  contentResourceTypeToFormat,
  ensureAnnotationHasContentResource,
  type EditableContentResourceType,
} from "@/utils/content-resource";
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

interface MetadataTabProps {
  selectedAnnotationIndex: number;
  isEditingMetadata: boolean;
  onEditingMetadataChange: (isEditing: boolean) => void;
  onSelectedAnnotationIndexChange: (index: number) => void;
}

function MetadataTab({
  selectedAnnotationIndex,
  isEditingMetadata,
  onEditingMetadataChange,
  onSelectedAnnotationIndexChange,
}: MetadataTabProps) {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const annotations = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations();
  const activeAnnotationIndex =
    annotations.length === 0
      ? null
      : Math.min(selectedAnnotationIndex, annotations.length - 1);

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

  function getResourceSummary(
    annotation: Annotation,
    resource: ContentResource | undefined,
  ): string {
    const resourceLabel = resource ? getResourceLabel(resource).trim() : "";
    const annotationLabel = getAnnotationLabel(annotation).trim();
    const resourceId = resource?.id?.trim() ?? "";

    return resourceLabel || annotationLabel || resourceId || "No label or URL yet";
  }

  function handleSelectAnnotation(index: number): void {
    onSelectedAnnotationIndexChange(index);
    onEditingMetadataChange(false);
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

  function handleAnnotationLabelChange(
    annotation: Annotation,
    newValue: string,
  ): void {
    annotation.changeLabel(
      0,
      newValue,
      getAnnotationLabelLanguage(annotation),
    );
    commitManifestChange();
  }

  function handleAnnotationLabelLanguageChange(
    annotation: Annotation,
    newLanguageCode: string,
  ): void {
    annotation.changeLabel(
      0,
      getAnnotationLabel(annotation),
      newLanguageCode,
    );
    commitManifestChange();
  }

  function handleResourceLabelChange(
    resource: ContentResource,
    newValue: string,
  ): void {
    resource.changeLabel(0, newValue, getResourceLabelLanguage(resource));
    commitManifestChange();
  }

  function handleResourceLabelLanguageChange(
    resource: ContentResource,
    newLanguageCode: string,
  ): void {
    resource.changeLabel(0, getResourceLabel(resource), newLanguageCode);
    commitManifestChange();
  }

  function handleOpenMetadata(index: number): void {
    const resource = ensureAnnotationHasContentResource(annotations[index]);
    const metadata = resource.getMetadata();

    if (metadata.getEntryCount() === 0) {
      metadata.addEntry("", "", "en");
      commitManifestChange();
    }

    onSelectedAnnotationIndexChange(index);
    onEditingMetadataChange(true);
  }

  function handleInitializeResource(index: number): void {
    ensureAnnotationHasContentResource(annotations[index]);
    onSelectedAnnotationIndexChange(index);
    onEditingMetadataChange(false);
    commitManifestChange();
  }

  function handleDeleteAnnotation(index: number): void {
    const annotationPage = manifestObj.getContainerObj().getAnnotationPage();
    const nextAnnotationCount = Math.max(
      annotationPage.getAllAnnotations().length - 1,
      0,
    );

    annotationPage.removeAnnotation(index);
    onEditingMetadataChange(false);
    onSelectedAnnotationIndexChange(
      nextAnnotationCount === 0 ? 0 : Math.min(index, nextAnnotationCount - 1),
    );
    commitManifestChange();
  }

  function handleCardKeyDown(
    event: ReactKeyboardEvent<HTMLElement>,
    index: number,
  ): void {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleSelectAnnotation(index);
  }

  function renderSelectedResourceEditor(
    annotation: Annotation,
    resource: ContentResource,
    index: number,
  ) {
    if (isEditingMetadata) {
      return (
        <section className="space-y-6 border-t border-pink-200 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-base font-semibold text-slate-950">Metadata</p>
              <p className="text-sm leading-6 text-slate-500">
                Add, update, or remove metadata entries for this content
                resource.
              </p>
            </div>
          </div>

          {resource.getMetadata().getEntryCount() === 0 ? (
            <EmptyStateCard
              title="No metadata entries"
              description="Create the first metadata entry for this content resource."
              align="left"
              className="border border-slate-200 bg-slate-50"
              descriptionClassName="max-w-none text-base leading-relaxed text-slate-500"
            />
          ) : null}

          <div className="space-y-6">
            {resource.getMetadata().getAllEntries().map((entry, entryIndex) => (
              <section
                key={`${index}-${entryIndex}`}
                className="space-y-4 rounded-xl border border-slate-200 bg-slate-100 p-5"
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
                  className="bg-white text-rose-600 ring-1 ring-pink-200 hover:bg-rose-50"
                  onClick={() => {
                    resource.getMetadata().removeEntry(entryIndex);
                    commitManifestChange();
                  }}
                >
                  Remove Entry
                </SoftActionButton>
              </section>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SoftActionButton
              onClick={() => {
                resource.getMetadata().addEntry("", "", "en");
                commitManifestChange();
              }}
            >
              + Add Metadata Entry
            </SoftActionButton>

            <SoftActionButton
              className="ring-1 ring-pink-200"
              onClick={() => onEditingMetadataChange(false)}
            >
              Back to Resource
            </SoftActionButton>
          </div>
        </section>
      );
    }

    return (
      <section className="space-y-6 border-t border-pink-200 pt-5">
        <section className="space-y-3">
          <p className="text-base font-semibold text-slate-950">Type</p>
          <TechnicalOptionGroup
            options={contentResourceTypeOptions}
            value={resource.getType()}
            onChange={(newValue) => handleContentResourceTypeChange(resource, newValue)}
            orientation="horizontal"
            selectedVariant="pink"
          />
        </section>

        <ManifestInput
          label="Resource URL"
          id={`metadata-resource-url-${index}`}
          type="text"
          value={resource.id}
          onChange={(newValue) => {
            resource.setID(newValue);
            commitManifestChange();
          }}
        />

        <InputWithLanguage
          label="Annotation Label"
          languageCode={getAnnotationLabelLanguage(annotation)}
          value={getAnnotationLabel(annotation)}
          onChange={(newValue) => handleAnnotationLabelChange(annotation, newValue)}
          onLanguageChange={(newLanguageCode) =>
            handleAnnotationLabelLanguageChange(annotation, newLanguageCode)
          }
        />

        <InputWithLanguage
          label="Content Resource Label"
          languageCode={getResourceLabelLanguage(resource)}
          value={getResourceLabel(resource)}
          onChange={(newValue) => handleResourceLabelChange(resource, newValue)}
          onLanguageChange={(newLanguageCode) =>
            handleResourceLabelLanguageChange(resource, newLanguageCode)
          }
        />

        <section className="space-y-3 rounded-xl border border-dashed border-pink-200 bg-white p-4">
          <ManifestField label="Metadata">
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {resource.getMetadata().getEntryCount() > 0
                ? "Open the metadata editor to review or update existing entries."
                : "This resource does not have metadata yet. Start by creating your first entry."}
            </p>
          </ManifestField>
          <SoftActionButton onClick={() => handleOpenMetadata(index)}>
            {resource.getMetadata().getEntryCount() > 0
              ? "Edit Metadata"
              : "Add Metadata"}
          </SoftActionButton>
        </section>
      </section>
    );
  }

  function renderSelectedResourceEmptyState(index: number) {
    return (
      <section className="border-t border-pink-200 pt-5">
        <EmptyStateCard
          title="Resource details unavailable"
          description="Initialize the selected annotation as a content resource before editing metadata."
          align="left"
          className="border border-slate-200 bg-slate-50"
          descriptionClassName="max-w-none text-base leading-relaxed text-slate-500"
          action={
            <SoftActionButton
              className="bg-white text-rose-600 ring-1 ring-pink-200 hover:bg-rose-50"
              onClick={() => handleInitializeResource(index)}
            >
              Initialize Resource
            </SoftActionButton>
          }
        />
      </section>
    );
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
            Select a resource to edit its fields and metadata in the same card.
          </p>
        </div>

        <div className="space-y-3">
          {annotations.map((annotation, index) => {
            const resource = annotation.getContentResource();
            const isSelected = activeAnnotationIndex === index;
            const helperText = isSelected
              ? isEditingMetadata
                ? "Edit metadata for this content resource below."
                : "Edit this content resource directly in this card."
              : resource
                ? "Select this content resource to edit labels, URL, and metadata."
                : "Select this content resource to initialize and edit it.";

            return (
              <article
                key={`${annotation.getID()}-${index}`}
                className={`rounded-xl border p-4 transition ${
                  isSelected
                    ? "border-pink-200 bg-slate-100"
                    : "cursor-pointer border-slate-200 bg-white hover:border-pink-200"
                }`}
                onClick={
                  isSelected ? undefined : () => handleSelectAnnotation(index)
                }
                onKeyDown={
                  isSelected
                    ? undefined
                    : (event) => handleCardKeyDown(event, index)
                }
                role={isSelected ? undefined : "button"}
                tabIndex={isSelected ? undefined : 0}
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1 space-y-3">
                    <button
                      type="button"
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isSelected
                          ? "bg-rose-50 text-rose-600 ring-1 ring-pink-200 hover:bg-rose-100"
                          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:border-pink-200 hover:bg-rose-50 hover:text-rose-600"
                      }`}
                      onClick={() => handleSelectAnnotation(index)}
                    >
                      Content Resource {index + 1}
                    </button>

                    <div className="space-y-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {getResourceSummary(annotation, resource)}
                      </p>
                      <p className="text-sm text-slate-500">{helperText}</p>
                    </div>

                    {isSelected
                      ? resource
                        ? renderSelectedResourceEditor(annotation, resource, index)
                        : renderSelectedResourceEmptyState(index)
                      : null}
                  </div>

                  <button
                    type="button"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-pink-200 bg-white text-lg leading-none text-rose-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDeleteAnnotation(index);
                    }}
                    aria-label={`Delete content resource ${index + 1}`}
                    title="Delete content resource"
                  >
                    &times;
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </ManifestTabBody>
  );
}

export default MetadataTab;
