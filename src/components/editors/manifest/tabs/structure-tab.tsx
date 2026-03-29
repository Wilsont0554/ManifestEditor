import { useContext } from "react";
import { manifestObjContext } from "@/context/manifest-context";
import {
  getContentResourceDisplayTitle,
  getContentResourceItems,
  getTextAnnotationDisplayTitle,
  getTextAnnotationItems,
} from "@/utils/content-resource";
import ContentResourceEditor from "../shared/content-resource-editor";
import EmptyStateCard from "../shared/empty-state-card";
import ManifestTabBody from "../shared/manifest-tab-body";
import TextAnnotationEditor from "../shared/text-annotation-editor";

function StructureTab() {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const resourceItems = getContentResourceItems(manifestObj);
  const textAnnotationItems = getTextAnnotationItems(manifestObj);

  function commitManifestChange(): void {
    updateManifestObj(manifestObj.clone());
  }

  function syncManifestLabel({
    previousValue,
    previousLanguageCode,
    value,
    languageCode,
  }: {
    previousValue: string;
    previousLanguageCode: string;
    value: string;
    languageCode: string;
  }): void {
    const currentManifestLabel = manifestObj.getLabelValue().trim();
    const currentManifestLabelLanguage = manifestObj.getLabelLanguage();
    const isManifestLabelBlank =
      currentManifestLabel.length === 0 ||
      currentManifestLabel === "Blank Manifest";
    const matchesPreviousResourceLabel =
      currentManifestLabel === previousValue.trim() &&
      currentManifestLabelLanguage === previousLanguageCode;

    if (!value.trim() || (!isManifestLabelBlank && !matchesPreviousResourceLabel)) {
      return;
    }

    manifestObj.setLabel(value);
    manifestObj.setLabelLanguage(languageCode);
  }

  return (
    <ManifestTabBody className="pb-6">
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-950">Content resources</p>
          <p className="text-sm leading-6 text-slate-500">
            Review and edit each content resource and text annotation directly
            from the sidebar.
          </p>
        </div>

        {resourceItems.length > 0 ? (
          <div className="space-y-4">
            {resourceItems.map(
              ({ annotation, resource, annotationIndex, resourceNumber }) => (
                <section
                  key={`structure-content-resource-${annotationIndex}`}
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

                  <ContentResourceEditor
                    annotation={annotation}
                    resource={resource}
                    idPrefix={`structure-content-resource-${annotationIndex}`}
                    onCommit={commitManifestChange}
                    onResourceLabelSync={syncManifestLabel}
                    showMetadataAction={false}
                  />
                </section>
              ),
            )}
          </div>
        ) : (
          <EmptyStateCard
            title="No content resources"
            description="Add a content resource to populate editable fields here."
            align="left"
            className="border border-slate-200 bg-slate-50"
            titleClassName="text-slate-950 text-lg"
            descriptionClassName="max-w-none text-base leading-relaxed text-slate-500"
          />
        )}

        {textAnnotationItems.length > 0 ? (
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <div className="space-y-1">
              <p className="text-lg font-medium text-slate-950">
                Text annotations
              </p>
              <p className="text-sm leading-6 text-slate-500">
                Edit comment text and 3D coordinates for each text annotation.
              </p>
            </div>

            <div className="space-y-4">
              {textAnnotationItems.map(
                ({ annotation, annotationIndex, annotationNumber }) => (
                  <section
                    key={`structure-text-annotation-${annotationIndex}`}
                    className="space-y-5 rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <div className="space-y-2">
                      <button
                        type="button"
                        className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-pink-200"
                      >
                        Text Annotation {annotationNumber}
                      </button>
                      <p className="text-sm text-slate-500">
                        {getTextAnnotationDisplayTitle(
                          annotation,
                          annotationNumber,
                        )}
                      </p>
                    </div>

                    <TextAnnotationEditor
                      annotation={annotation}
                      idPrefix={`structure-text-annotation-${annotationIndex}`}
                      onCommit={commitManifestChange}
                    />
                  </section>
                ),
              )}
            </div>
          </div>
        ) : null}
      </section>
    </ManifestTabBody>
  );
}

export default StructureTab;
