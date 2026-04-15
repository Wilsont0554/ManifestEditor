import { useContext } from "react";
import { manifestObjContext } from "@/context/manifest-context";
import {
  getContentResourceDisplayTitle,
  getDisplayableContentResourceItems,
  getTextAnnotationItems,
} from "@/utils/content-resource";
import ContentResourceEditor from "../shared/content-resource-editor";
import CollapsibleResourceCard from "../shared/collapsible-resource-card";
import EmptyStateCard from "../shared/empty-state-card";
import ManifestTabBody from "../shared/manifest-tab-body";
import SoftActionButton from "../shared/soft-action-button";
import TextAnnotationEditor from "../shared/text-annotation-editor";

function AssetsTab() {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const resourceItems = getDisplayableContentResourceItems(manifestObj);
  const textAnnotationItems = getTextAnnotationItems(manifestObj);

  function commitManifestChange(): void {
    updateManifestObj();
  }

  return (
    <ManifestTabBody className="pb-6">
      <section className="space-y-4">
        {/* Content Resources Section */}
        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-950">Content resources</p>
          <p className="text-sm leading-6 text-slate-500">
            Review and edit each image or model content resource and text
            annotation directly from the sidebar.
          </p>
        </div>

        {resourceItems.length > 0 ? (
          <div className="space-y-4">
            {resourceItems.map(
              ({ annotation, resource, annotationIndex, resourceNumber }) => (
                <CollapsibleResourceCard
                  key={`structure-content-resource-${annotationIndex}`}
                  badgeLabel={`Content Resource ${resourceNumber}`}
                  description={getContentResourceDisplayTitle(
                    annotation,
                    resource,
                    resourceNumber,
                  )}
                  collapsible
                >
                  <ContentResourceEditor
                    annotation={annotation}
                    resource={resource}
                    idPrefix={`structure-content-resource-${annotationIndex}`}
                    onCommit={commitManifestChange}
                    showMetadataAction={false}
                  />

                  <SoftActionButton
                    className="bg-white text-rose-600 ring-1 ring-pink-200 hover:bg-rose-50 mt-3"
                    onClick={() => {
                      manifestObj.getContainerObj().getAnnotationPage().removeAnnotation(annotationIndex);
                      commitManifestChange();
                    }}
                  >
                    Remove Content Resource
                  </SoftActionButton>
                </CollapsibleResourceCard>
              ),
            )}
          </div>
        ) : (
          <EmptyStateCard
            title="No content resources"
            description="Add an image or model content resource to populate editable fields here."
            align="left"
            className="border border-slate-200 bg-slate-50"
            titleClassName="text-slate-950 text-lg"
            descriptionClassName="max-w-none text-base leading-relaxed text-slate-500"
          />
        )}

        {/* Text Annotations Section */}
        {textAnnotationItems.length > 0 && (
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
                ({ annotation, resource, annotationIndex, resourceNumber }) => (
                  <section
                    key={`structure-text-annotation-${annotationIndex}`}
                    className="space-y-5 rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <div className="space-y-2">
                      <button
                        type="button"
                        className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-pink-200"
                      >
                        Text Annotation {resourceNumber}
                      </button>
                      <p className="text-sm text-slate-500">
                        {getContentResourceDisplayTitle(
                          annotation,
                          resource,
                          resourceNumber,
                        )}
                      </p>
                    </div>

                    <TextAnnotationEditor
                      annotationParent={annotation}
                      annotation={resource}
                      idPrefix={`structure-text-annotation-${annotationIndex}`}
                      onCommit={commitManifestChange}
                    />
                  </section>
                ),
              )}
            </div>
          </div>
        )}
      </section>
    </ManifestTabBody>
  );
}

export default AssetsTab;