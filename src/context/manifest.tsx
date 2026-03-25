import { useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";
import {
  createContentResourceSnapshot,
  type ContentResourceSnapshot,
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
        initialResource.resourceLabel.languageCode
    );
  });
}

const defaultManifestSnapshot = createManifestEditableSnapshot(
  new ManifestObject("scene"),
);

export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const [manifestObj, setManifestObj] = useState(() => new ManifestObject("scene"));
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

    if (field === "metadata") {
      return isMetadataFieldEdited(currentSnapshot.metadata, initialSnapshot.metadata);
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

