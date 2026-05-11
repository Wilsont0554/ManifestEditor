import ManifestObject from "@/ManifestClasses/ManifestObject";

export const SAVED_MANIFESTS_KEY = "manifestEditor.savedManifests";

export interface SavedManifest {
  id: string;
  manifestId?: string;
  title: string;
  containerType: string;
  annotationCount: number;
  updatedAt: string;
  manifestJson: string;
}

export function readSavedManifests(): SavedManifest[] {
  try {
    const savedValue = localStorage.getItem(SAVED_MANIFESTS_KEY);

    if (!savedValue) {
      return [];
    }

    const parsedValue = JSON.parse(savedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue;
  } catch {
    return [];
  }
}

export function writeSavedManifests(savedManifests: SavedManifest[]): void {
  localStorage.setItem(SAVED_MANIFESTS_KEY, JSON.stringify(savedManifests));
}

function createSavedManifestId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function saveManifestToLibrary(manifestObj: ManifestObject): SavedManifest {
  const annotationCount = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations().length;
  const title = manifestObj.getLabelValue().trim() || "Untitled Manifest";
  const manifestId = manifestObj.getId().trim();
  const savedManifest: SavedManifest = {
    id: createSavedManifestId(),
    manifestId: manifestId || undefined,
    title,
    containerType: manifestObj.getContainerObj().getType(),
    annotationCount,
    updatedAt: new Date().toISOString(),
    manifestJson: JSON.stringify(manifestObj),
  };
  const existingManifests = readSavedManifests();
  const nextManifests = [savedManifest, ...existingManifests];

  writeSavedManifests(nextManifests);

  return savedManifest;
}

export function deleteSavedManifest(savedManifestId: string): SavedManifest[] {
  const nextManifests = readSavedManifests().filter(
    (manifest) => manifest.id !== savedManifestId,
  );

  writeSavedManifests(nextManifests);

  return nextManifests;
}
