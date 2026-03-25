import Annotation from "@/ManifestClasses/Annotation";
import ContentResource from "@/ManifestClasses/ContentResource";

export const contentResourceTypeToFormat = {
  Image: "image/jpeg",
  Model: "model/gltf-binary",
} as const;

export type EditableContentResourceType = keyof typeof contentResourceTypeToFormat;

export function createDefaultContentResource(): ContentResource {
  return new ContentResource("", "Model", contentResourceTypeToFormat.Model);
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
