import { type KeyboardEvent as ReactKeyboardEvent, useContext } from "react";
import InputWithLanguage from "@/components/shared/inputWithLanguage";
import { manifestObjContext } from "@/context/manifest-context";
import type Annotation from "@/ManifestClasses/Annotation";
import type ContentResource from "@/ManifestClasses/ContentResource";
import EmptyStateCard from "../shared/empty-state-card";
import ManifestTabBody from "../shared/manifest-tab-body";
import SoftActionButton from "../shared/soft-action-button";

interface MetadataTabProps {
  selectedAnnotationIndex: number;
  onSelectedAnnotationIndexChange: (index: number) => void;
}

interface MetadataResourceItem {
  annotation: Annotation;
  resource: ContentResource;
  annotationIndex: number;
  resourceNumber: number;
}

function MetadataTab({
  selectedAnnotationIndex,
  onSelectedAnnotationIndexChange,
}: MetadataTabProps) {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const resourceItems: MetadataResourceItem[] = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations()
    .flatMap((annotation, annotationIndex, annotations) => {
      const resource = annotation.getContentResource();

      if (!resource) {
        return [];
      }

      const resourceNumber =
        annotations
          .slice(0, annotationIndex + 1)
          .filter((item) => !!item.getContentResource()).length;

      return [
        {
          annotation,
          resource,
          annotationIndex,
          resourceNumber,
        },
      ];
    });
  const selectedResourceItem =
    resourceItems.find((item) => item.annotationIndex === selectedAnnotationIndex) ??
    resourceItems[0] ??
    null;

  function commitManifestChange(): void {
    updateManifestObj();
  }

  function getAnnotationLabel(annotation: Annotation): string {
    return annotation.getLabel()?.getValue() ?? "";
  }

  function getResourceLabel(resource: ContentResource): string {
    return resource.getLabel().getValue();
  }

  function getResourceSummary(
    annotation: Annotation,
    resource: ContentResource,
  ): string {
    const resourceLabel = getResourceLabel(resource).trim();
    const annotationLabel = getAnnotationLabel(annotation).trim();
    const resourceId = resource.id.trim();

    return resourceLabel || annotationLabel || resourceId || "No label or URL yet";
  }

  function handleCardKeyDown(
    event: ReactKeyboardEvent<HTMLElement>,
    index: number,
  ): void {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onSelectedAnnotationIndexChange(index);
  }

  if (resourceItems.length === 0) {
    return <ManifestTabBody className="pb-6" />;
  }

  return (
    <ManifestTabBody className="pb-6">
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-950">Metadata</p>
          <p className="text-sm leading-6 text-slate-500">
            Choose a content resource to manage its metadata entries.
          </p>
        </div>

        <div className="space-y-3">
          {resourceItems.map(
            ({ annotation, resource, annotationIndex, resourceNumber }) => {
              const isSelected =
                selectedResourceItem?.annotationIndex === annotationIndex;
              const metadataEntryCount = resource.getMetadata().getEntryCount();

              return (
                <article
                  key={`${annotation.getID()}-${annotationIndex}`}
                  className={`rounded-xl border p-4 transition ${
                    isSelected
                      ? "border-pink-200 bg-slate-100"
                      : "cursor-pointer border-slate-200 bg-white hover:border-pink-200"
                  }`}
                  onClick={
                    isSelected
                      ? undefined
                      : () => onSelectedAnnotationIndexChange(annotationIndex)
                  }
                  onKeyDown={
                    isSelected
                      ? undefined
                      : (event) => handleCardKeyDown(event, annotationIndex)
                  }
                  role={isSelected ? undefined : "button"}
                  tabIndex={isSelected ? undefined : 0}
                >
                  <div className="space-y-3">
                    <button
                      type="button"
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isSelected
                          ? "bg-rose-50 text-rose-600 ring-1 ring-pink-200 hover:bg-rose-100"
                          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:border-pink-200 hover:bg-rose-50 hover:text-rose-600"
                      }`}
                      onClick={() =>
                        onSelectedAnnotationIndexChange(annotationIndex)
                      }
                    >
                      Content Resource {resourceNumber}
                    </button>

                    <div className="space-y-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {getResourceSummary(annotation, resource)}
                      </p>
                      <p className="text-sm text-slate-500">
                        {metadataEntryCount > 0
                          ? `${metadataEntryCount} metadata ${
                              metadataEntryCount === 1 ? "entry" : "entries"
                            }`
                          : "No metadata yet"}
                      </p>
                    </div>

                    {isSelected ? (
                      <section className="space-y-6 border-t border-pink-200 pt-5">
                        <div className="space-y-1">
                          <p className="text-base font-semibold text-slate-950">
                            Metadata
                          </p>
                          <p className="text-sm leading-6 text-slate-500">
                            Add, update, or remove metadata entries for this
                            content resource.
                          </p>
                        </div>

                        {metadataEntryCount === 0 ? (
                          <EmptyStateCard
                            title="No metadata entries"
                            description="Create the first metadata entry for this content resource."
                            align="left"
                            className="border border-slate-200 bg-slate-50"
                            descriptionClassName="max-w-none text-base leading-relaxed text-slate-500"
                          />
                        ) : null}

                        <div className="space-y-6">
                          {resource
                            .getMetadata()
                            .getAllEntries()
                            .map((entry, entryIndex) => (
                              <section
                                key={`${annotationIndex}-${entryIndex}`}
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

                        <SoftActionButton
                          onClick={() => {
                            resource.getMetadata().addEntry("", "", "en");
                            commitManifestChange();
                          }}
                        >
                          + Add Metadata Entry
                        </SoftActionButton>
                      </section>
                    ) : null}
                  </div>
                </article>
              );
            },
          )}
        </div>
      </section>
    </ManifestTabBody>
  );
}

export default MetadataTab;
