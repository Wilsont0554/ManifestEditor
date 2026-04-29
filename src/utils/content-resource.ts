import ContentResource from "@/ManifestClasses/ContentResource";
import ManifestObject from "@/ManifestClasses/ManifestObject";

export const contentResourceTypeToFormat = {
  Image: "image/jpeg",
  Model: "model/gltf-binary",
} as const;

export const lightContentResourceTypes = {
  AmbientLight: "Ambient Light",
  DirectionalLight: "Directional Light",
  PointLight: "Point Light",
  SpotLight: "Spot Light"
 } as const;

export const cameraContentResourceTypes = {
  OrthographicCamera : "Orthographic Camera",
  PerspectiveCamera : "Perspective Camera",
} as const;

export type LightContentResourceType =
  keyof typeof lightContentResourceTypes;
export type SupportedCameraContentResourceType =
  keyof typeof cameraContentResourceTypes;
export type EditableContentResourceType =
  | keyof typeof contentResourceTypeToFormat
  | "Light"
  | "Camera";

export function getResourceTypeItems(manifestObj: ManifestObject, resourceType: object) {
  let resourceNumber = 0;

  return manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations()
    .flatMap((annotation, annotationIndex) => {
      const resource = annotation.getContentResource();

      if (resource!.constructor == resourceType){
        resourceNumber += 1;

        return [
          {
            annotation,
            resource,
            annotationIndex,
            resourceNumber,
          },
        ];
      }
      else{
        return [];
      }
    });
}

export function clampNumber(value: number, min?: number, max?: number): number {
  let nextValue = value;

  if (min !== undefined) {
      nextValue = Math.max(nextValue, min);
  }

  if (max !== undefined) {
      nextValue = Math.min(nextValue, max);
  }

  return nextValue;
}
