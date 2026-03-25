import Annotation from "@/ManifestClasses/Annotation";
import ContentResource from "@/ManifestClasses/ContentResource";
import ManifestObject from "@/ManifestClasses/ManifestObject";

export const contentResourceTypeToFormat = {
  Image: "image/jpeg",
  Model: "model/gltf-binary",
} as const;

export type EditableContentResourceType = keyof typeof contentResourceTypeToFormat;

interface LocalizedContentResourceFieldSnapshot {
  value: string;
  languageCode: string;
}

export interface ContentResourceSnapshot {
  annotationIndex: number;
  url: string;
  type: string;
  format: string;
  annotationLabel: LocalizedContentResourceFieldSnapshot;
  resourceLabel: LocalizedContentResourceFieldSnapshot;
}

export interface ContentResourceItem {
  annotation: Annotation;
  resource: ContentResource;
  annotationIndex: number;
  resourceNumber: number;
}

export function createDefaultContentResource(
  type: EditableContentResourceType = "Model",
): ContentResource {
  return new ContentResource("", type, contentResourceTypeToFormat[type]);
}

export function ensureAnnotationHasContentResource(
  annotation: Annotation,
): ContentResource {
  const existingResource = annotation.getContentResource();

  if (existingResource) {
    return existingResource;
  }

  const nextResource = createDefaultContentResource();
  annotation.setContentResource(nextResource);
  return nextResource;
}

export function getContentResourceItems(
  manifestObj: ManifestObject,
): ContentResourceItem[] {
  let resourceNumber = 0;

  return manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations()
    .flatMap((annotation, annotationIndex) => {
      const resource = annotation.getContentResource();

      if (!resource) {
        return [];
      }

      resourceNumber += 1;

      return [
        {
          annotation,
          resource,
          annotationIndex,
          resourceNumber,
        },
      ];
    });
}

export function hasContentResourceUrl(resource: ContentResource): boolean {
  return resource.id.trim().length > 0;
}

export function getDisplayableContentResourceItems(
  manifestObj: ManifestObject,
): ContentResourceItem[] {
  return getContentResourceItems(manifestObj).filter(({ resource }) =>
    hasContentResourceUrl(resource),
  );
}

export function getContentResourceDisplayTitle(
  annotation: Annotation,
  resource: ContentResource,
  resourceNumber: number,
): string {
  const resourceLabel = resource.getLabel().getValue().trim();
  const annotationLabel = annotation.getLabel()?.getValue().trim() ?? "";

  return resourceLabel || annotationLabel || `Content Resource ${resourceNumber}`;
}

export function createContentResourceSnapshot(
  manifestObj: ManifestObject,
): ContentResourceSnapshot[] {
  return getContentResourceItems(manifestObj).map(
    ({ annotation, resource, annotationIndex }) => ({
      annotationIndex,
      url: resource.id,
      type: resource.getType(),
      format: resource.getFormat(),
      annotationLabel: {
        value: annotation.getLabel()?.getValue() ?? "",
        languageCode: annotation.getLabel()?.getLanguage() ?? "en",
      },
      resourceLabel: {
        value: resource.getLabel().getValue(),
        languageCode: resource.getLabel().getLanguage() ?? "en",
      },
    }),
  );
}
