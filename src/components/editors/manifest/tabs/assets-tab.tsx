import { useContext } from "react";
import { manifestObjContext } from "@/context/manifest-context";
import ContentResourceEditor from "../shared/content-resource-editor";
import CollapsibleResourceCard from "../shared/collapsible-resource-card";
import EmptyStateCard from "../shared/empty-state-card";
import ManifestTabBody from "../shared/manifest-tab-body";
import SoftActionButton from "../shared/soft-action-button";
import TextAnnotationEditor from "../shared/text-annotation-editor";
import { getResourceTypeItems } from "@/utils/content-resource";
import ContentResource from "@/ManifestClasses/ContentResource";
import TextAnnotation from "@/ManifestClasses/TextAnnotation";

function AssetsTab() {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const resourceItems = getResourceTypeItems(manifestObj, ContentResource);
  const textAnnotationItems = getResourceTypeItems(manifestObj, TextAnnotation);

  function commitManifestChange(): void {
    updateManifestObj();
  }

  for (let i = 0; i < resourceItems.length; i++){
    console.log(resourceItems[i]);
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
                <div>
                  <CollapsibleResourceCard
                    badgeLabel={`Content Resource ${resourceNumber}`}
                    key={`structure-content-resource-${annotationIndex}`}
                    description="temp"
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
                    className="bg-white text-rose-600 ring-1 ring-pink-200 hover:bg-rose-50"
                    onClick={() => {
                      manifestObj.getContainerObj().getAnnotationPage().removeAnnotation(annotationIndex);
                      commitManifestChange();
                    }}
                  >
                    Remove Content Resource
                      </SoftActionButton>
                  </CollapsibleResourceCard>
                </div>
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

        <div className="space-y-1">
          <p className="text-lg font-medium text-slate-950">
            Text annotations
          </p>
          <p className="text-sm leading-6 text-slate-500">
            Edit comment text and 3D coordinates for each text annotation.
          </p>
        </div>

        {textAnnotationItems.length > 0 ? (
          <div className="space-y-4">
            {textAnnotationItems.map(
              ({ annotation, resource, annotationIndex, resourceNumber }) => (
                <div>
                  <CollapsibleResourceCard
                    badgeLabel={`Text Annotation ${resourceNumber}`}
                    key={`structure-content-resource-${annotationIndex}`}
                    description="temp"
                    collapsible
                  >
                    <div className="space-y-4">
                        <TextAnnotationEditor
                          annotationParent={annotation}
                          annotation={resource}
                          idPrefix={`structure-text-annotation-${annotationIndex}`}
                          onCommit={commitManifestChange}
                        />
                    </div>
                    <SoftActionButton
                      className="bg-white text-rose-600 ring-1 ring-pink-200 hover:bg-rose-50"
                      onClick={() => {
                        manifestObj.getContainerObj().getAnnotationPage().removeAnnotation(annotationIndex);
                        commitManifestChange();
                      }}
                    >
                    Remove Content Resource
                    </SoftActionButton>
                  </CollapsibleResourceCard>
                </div>
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
      </section>
    </ManifestTabBody>
  );
}

export default AssetsTab;