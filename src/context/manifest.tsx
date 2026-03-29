import { useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";
import {
  createCameraTechnicalSnapshot,
  createContentResourceSnapshot,
  createLightTechnicalSnapshot,
  type CameraTechnicalSnapshot,
  type ContentResourceSnapshot,
  type LightTechnicalSnapshot,
} from "@/utils/content-resource";

type ManifestEditableField =
  | "id"
  | "label"
  | "summary"
  | "rights"
  | "navDate"
  | "contentResources"
  | "viewingDirection"
  | "manifestOrderingBehavior"
  | "repeatBehavior"
  | "autoAdvanceBehavior"
  | "customBehaviors"
  | "cameraTechnical"
  | "lightTechnical"
  | "metadata";

interface LocalizedManifestFieldSnapshot {
  value: string;
  languageCode: string;
}

interface ManifestEditableSnapshot {
  id: string;
  label: LocalizedManifestFieldSnapshot;
  summary: LocalizedManifestFieldSnapshot;
  rights: string;
  navDate: string;
  contentResources: ContentResourceSnapshot[];
  viewingDirection: string;
  manifestOrderingBehavior: string;
  repeatBehavior: string;
  autoAdvanceBehavior: string;
  customBehaviors: string[];
  cameraTechnical: CameraTechnicalSnapshot[];
  lightTechnical: LightTechnicalSnapshot[];
  metadata: ContentResourceMetadataSnapshot[];
}

interface MetadataEntrySnapshot {
  label: LocalizedManifestFieldSnapshot;
  value: LocalizedManifestFieldSnapshot;
}

interface ContentResourceMetadataSnapshot {
  resourceIndex: number;
  entries: MetadataEntrySnapshot[];
}

function createMetadataSnapshot(
  manifestObj: ManifestObject,
): ContentResourceMetadataSnapshot[] {
  return manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations()
    .map((annotation, resourceIndex) => {
      const resource = annotation.getContentResource();
      const entries =
        resource?.getMetadata()
          .getAllEntries()
          .map((entry) => ({
            label: {
              value: entry.getLabelText(),
              languageCode: entry.getLabelLanguage(),
            },
            value: {
              value: entry.getValueText(),
              languageCode: entry.getValueLanguage(),
            },
          })) ?? [];

      return {
        resourceIndex,
        entries,
      };
    })
    .filter((resourceMetadata) => resourceMetadata.entries.length > 0);
}

function createManifestEditableSnapshot(
  manifestObj: ManifestObject,
): ManifestEditableSnapshot {
  return {
    id: manifestObj.getId(),
    label: {
      value: manifestObj.getLabelValue(),
      languageCode: manifestObj.getLabelLanguage(),
    },
    summary: {
      value: manifestObj.getSummaryValue(),
      languageCode: manifestObj.getSummaryLanguage(),
    },
    rights: manifestObj.getRights(),
    navDate: manifestObj.getNavDate(),
    contentResources: createContentResourceSnapshot(manifestObj),
    viewingDirection: manifestObj.getViewingDirection(),
    manifestOrderingBehavior: manifestObj.getManifestOrderingBehavior(),
    repeatBehavior: manifestObj.getRepeatBehavior(),
    autoAdvanceBehavior: manifestObj.getAutoAdvanceBehavior(),
    customBehaviors: manifestObj.getCustomBehaviors(),
    cameraTechnical: createCameraTechnicalSnapshot(manifestObj),
    lightTechnical: createLightTechnicalSnapshot(manifestObj),
    metadata: createMetadataSnapshot(manifestObj),
  };
}

function isLocalizedFieldEdited(
  currentField: LocalizedManifestFieldSnapshot,
  initialField: LocalizedManifestFieldSnapshot,
): boolean {
  return (
    currentField.value !== initialField.value ||
    currentField.languageCode !== initialField.languageCode
  );
}

function isStringArrayFieldEdited(
  currentField: string[],
  initialField: string[],
): boolean {
  if (currentField.length !== initialField.length) {
    return true;
  }

  return currentField.some((value, index) => value !== initialField[index]);
}

function isMetadataFieldEdited(
  currentField: ContentResourceMetadataSnapshot[],
  initialField: ContentResourceMetadataSnapshot[],
): boolean {
  if (currentField.length !== initialField.length) {
    return true;
  }

  return currentField.some((currentResourceMetadata, resourceIndex) => {
    const initialResourceMetadata = initialField[resourceIndex];

    if (
      currentResourceMetadata.resourceIndex !== initialResourceMetadata.resourceIndex
    ) {
      return true;
    }

    if (
      currentResourceMetadata.entries.length !==
      initialResourceMetadata.entries.length
    ) {
      return true;
    }

    return currentResourceMetadata.entries.some((currentEntry, entryIndex) => {
      const initialEntry = initialResourceMetadata.entries[entryIndex];

      return (
        currentEntry.label.value !== initialEntry.label.value ||
        currentEntry.label.languageCode !== initialEntry.label.languageCode ||
        currentEntry.value.value !== initialEntry.value.value ||
        currentEntry.value.languageCode !== initialEntry.value.languageCode
      );
    });
  });
}

function isLightTechnicalFieldEdited(
  currentField: LightTechnicalSnapshot[],
  initialField: LightTechnicalSnapshot[],
): boolean {
  if (currentField.length !== initialField.length) {
    return true;
  }

  return currentField.some((currentLight, lightIndex) => {
    const initialLight = initialField[lightIndex];
    const currentIntensity = currentLight.intensity;
    const initialIntensity = initialLight.intensity;

    return (
      currentLight.annotationIndex !== initialLight.annotationIndex ||
      currentLight.type !== initialLight.type ||
      currentLight.color !== initialLight.color ||
      currentLight.lookAtId !== initialLight.lookAtId ||
      currentLight.angle !== initialLight.angle ||
      currentLight.coordinates.hasSpatialTarget !==
        initialLight.coordinates.hasSpatialTarget ||
      currentLight.coordinates.x !== initialLight.coordinates.x ||
      currentLight.coordinates.y !== initialLight.coordinates.y ||
      currentLight.coordinates.z !== initialLight.coordinates.z ||
      currentIntensity?.type !== initialIntensity?.type ||
      currentIntensity?.value !== initialIntensity?.value ||
      currentIntensity?.unit !== initialIntensity?.unit
    );
  });
}

function isCameraTechnicalFieldEdited(
  currentField: CameraTechnicalSnapshot[],
  initialField: CameraTechnicalSnapshot[],
): boolean {
  if (currentField.length !== initialField.length) {
    return true;
  }

  return currentField.some((currentCamera, cameraIndex) => {
    const initialCamera = initialField[cameraIndex];

    return (
      currentCamera.annotationIndex !== initialCamera.annotationIndex ||
      currentCamera.type !== initialCamera.type ||
      currentCamera.near !== initialCamera.near ||
      currentCamera.far !== initialCamera.far ||
      currentCamera.viewHeight !== initialCamera.viewHeight ||
      currentCamera.fieldOfView !== initialCamera.fieldOfView ||
      currentCamera.coordinates.hasSpatialTarget !==
        initialCamera.coordinates.hasSpatialTarget ||
      currentCamera.coordinates.x !== initialCamera.coordinates.x ||
      currentCamera.coordinates.y !== initialCamera.coordinates.y ||
      currentCamera.coordinates.z !== initialCamera.coordinates.z
    );
  });
}

function isContentResourceFieldEdited(
  currentField: ContentResourceSnapshot[],
  initialField: ContentResourceSnapshot[],
): boolean {
  if (currentField.length !== initialField.length) {
    return true;
  }

  return currentField.some((currentResource, resourceIndex) => {
    const initialResource = initialField[resourceIndex];

    return (
      currentResource.annotationIndex !== initialResource.annotationIndex ||
      currentResource.url !== initialResource.url ||
      currentResource.type !== initialResource.type ||
      currentResource.format !== initialResource.format ||
      currentResource.annotationLabel.value !==
        initialResource.annotationLabel.value ||
      currentResource.annotationLabel.languageCode !==
        initialResource.annotationLabel.languageCode ||
      currentResource.resourceLabel.value !== initialResource.resourceLabel.value ||
      currentResource.resourceLabel.languageCode !==
        initialResource.resourceLabel.languageCode ||
      currentResource.coordinates.hasSpatialTarget !==
        initialResource.coordinates.hasSpatialTarget ||
      currentResource.coordinates.x !== initialResource.coordinates.x ||
      currentResource.coordinates.y !== initialResource.coordinates.y ||
      currentResource.coordinates.z !== initialResource.coordinates.z
    );
  });
}

const defaultManifestSnapshot = createManifestEditableSnapshot(
  new ManifestObject("Scene"),
);

export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const [manifestObj, setManifestObj] = useState(() => new ManifestObject("Scene"));
  const [initialSnapshot] = useState(defaultManifestSnapshot);
  const currentSnapshot = createManifestEditableSnapshot(manifestObj);

  const updateManifestObj = (newObj: ManifestObject) => {
    setManifestObj(newObj);
  };

  const isFieldEdited = (field: ManifestEditableField) => {
    if (field === "label" || field === "summary") {
      return isLocalizedFieldEdited(currentSnapshot[field], initialSnapshot[field]);
    }

    if (field === "customBehaviors") {
      return isStringArrayFieldEdited(
        currentSnapshot.customBehaviors,
        initialSnapshot.customBehaviors,
      );
    }

    if (field === "contentResources") {
      return isContentResourceFieldEdited(
        currentSnapshot.contentResources,
        initialSnapshot.contentResources,
      );
    }

    if (field === "cameraTechnical") {
      return isCameraTechnicalFieldEdited(
        currentSnapshot.cameraTechnical,
        initialSnapshot.cameraTechnical,
      );
    }

    if (field === "metadata") {
      return isMetadataFieldEdited(currentSnapshot.metadata, initialSnapshot.metadata);
    }

    if (field === "lightTechnical") {
      return isLightTechnicalFieldEdited(
        currentSnapshot.lightTechnical,
        initialSnapshot.lightTechnical,
      );
    }

    return currentSnapshot[field] !== initialSnapshot[field];
  };

  return (
    <manifestObjContext.Provider
      value={{ manifestObj, updateManifestObj, isFieldEdited }}
    >
      {children}
    </manifestObjContext.Provider>
  );
};

