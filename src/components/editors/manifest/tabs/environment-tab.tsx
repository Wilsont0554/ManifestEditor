import { manifestObjContext } from "@/context/manifest-context";
import { useContext } from "react";
import CameraResourceTechnicalEditor from "../shared/camera-resource-technical-editor";
import CollapsibleResourceCard from "../shared/collapsible-resource-card";
import LightResourceTechnicalEditor from "../shared/light-resource-technical-editor";
import ManifestCustomBehaviorEditor from "../shared/manifest-custom-behavior-editor";
import ManifestInput from "../shared/manifest-input";
import ManifestTabBody from "../shared/manifest-tab-body";
import SoftActionButton from "../shared/soft-action-button";
import ManifestField from "../shared/manifest-field";
import TechnicalOptionGroup from "../shared/technical-option-group";
import DropDownField from "@/components/shared/dropdown-field";
import { getCameraItems, getContentResourceItems, getLightItems, getResourceTypeItems } from "@/utils/content-resource";
import Camera from "@/ManifestClasses/Camera";
import Light from "@/ManifestClasses/Light";

function EnvironmentTab() {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const customBehaviors = manifestObj.getCustomBehaviors();
  const isCanvasContainer = manifestObj.getContainerObj().getType() === "Canvas";

  const cameraItems = getResourceTypeItems(manifestObj, Camera);
  const lightItems = getResourceTypeItems(manifestObj, Light);

  function handleRemoveResource(annotationIndex: number): void {
    manifestObj
      .getContainerObj()
      .getAnnotationPage()
      .removeAnnotation(annotationIndex);
    updateManifestObj();
  }

  return (
    <ManifestTabBody className="pb-6">
      <ManifestInput
        label="Identifier"
        id="manifest-identifier"
        type="text"
        value={manifestObj.getId()}
        onChange={() => console.log('')}
      />

      {cameraItems.length > 0 ? (
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-lg font-medium text-slate-950">Cameras</p>
            <p className="text-sm leading-6 text-slate-500">
              Edit camera type, clipping planes, position, and type-specific
              settings for each camera content resource.
            </p>
          </div>

          <div className="space-y-4">
            {cameraItems.map(
              ({ annotation, resource, annotationIndex, resourceNumber}) => (<>
                  <CollapsibleResourceCard
                    key={`technical-camera-resource-${annotationIndex}`}
                    badgeLabel={`Camera ${resourceNumber}`}
                    description=""
                    collapsible
                    defaultOpen={false}
                  >
                    <CameraResourceTechnicalEditor
                      annotation={annotation}
                      resource={resource}
                      idPrefix={`technical-camera-${annotationIndex}`}
                      onCommit={updateManifestObj}
                    />
                    <div className="pt-3">
                      <SoftActionButton
                        className="bg-white text-rose-600 ring-1 ring-pink-200 hover:bg-rose-50"
                        onClick={() => handleRemoveResource(annotationIndex)}
                      >
                        Remove {`Camera ${resourceNumber}`}
                      </SoftActionButton>
                    </div>
                  </CollapsibleResourceCard>
              </>),
            )}
          </div>
        </section>
      ) : null}

      {lightItems.length > 0 ? (
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-lg font-medium text-slate-950">Lights</p>
            <p className="text-sm leading-6 text-slate-500">
              Edit light type, color, intensity, and 3D coordinates for each light
              content resource.
            </p>
          </div>

          <div className="space-y-4">
            {lightItems.map(
              ({ annotation, resource, annotationIndex, resourceNumber}) => (<>
                  <CollapsibleResourceCard
                    key={`technical-light-resource-${annotationIndex}`}
                    badgeLabel={`Light ${resourceNumber}`}
                    description=""
                    collapsible
                    defaultOpen={false}
                  >
                    <LightResourceTechnicalEditor
                      annotation={annotation}
                      resource={resource}
                      idPrefix={`technical-light-${annotationIndex}`}
                      onCommit={updateManifestObj}
                    />
                    <div className="pt-3">
                      <SoftActionButton
                        className="bg-white text-rose-600 ring-1 ring-pink-200 hover:bg-rose-50"
                        onClick={() => handleRemoveResource(annotationIndex)}
                      >
                        Remove {`Light ${resourceNumber}`}
                      </SoftActionButton>
                    </div>
                  </CollapsibleResourceCard>
              </>),
            )}
          </div>
        </section>
      ) : null}

      {isCanvasContainer ? (
        <>
          <ManifestField label="Viewing direction" className="space-y-3">
            <TechnicalOptionGroup
              options={["temp"]}
              value={manifestObj.getViewingDirection()}
              onChange={() => {console.log('')}}
              allowDeselect
            />
          </ManifestField>

          <ManifestField label="Built in behaviors" className="space-y-2">
            <DropDownField label="Manifest ordering">
              <TechnicalOptionGroup
                options={["manifestOrderingOptions"]}
                value={manifestObj.getManifestOrderingBehavior()}
              onChange={() => {console.log('')}}
              />
            </DropDownField>
            <DropDownField label="Repeat">
              <TechnicalOptionGroup
                options={["repeatOptions"]}
                value={manifestObj.getRepeatBehavior()}
              onChange={() => {console.log('')}}
                orientation="horizontal"
              />
            </DropDownField>
            <DropDownField label="Auto-advance">
              <TechnicalOptionGroup
                options={["autoAdvanceOptions"]}
                value={manifestObj.getAutoAdvanceBehavior()}
              onChange={() => {console.log('')}}
                orientation="horizontal"
              />
            </DropDownField>
          </ManifestField>

          <ManifestField
            label="Custom behaviors"
            className="space-y-4 border-t border-slate-200 pt-6"
          >
            <ManifestCustomBehaviorEditor
              behaviors={customBehaviors}
              reservedBehaviors={builtInManifestBehaviors}
              onChange={() => {console.log('')}}
              onChange={() => {console.log('')}}
            />
          </ManifestField>
        </>
      ) : null}
    </ManifestTabBody>
  );
}

export default EnvironmentTab;
