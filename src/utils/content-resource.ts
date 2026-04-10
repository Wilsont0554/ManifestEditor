import Annotation from "@/ManifestClasses/Annotation";
import Camera, { type CameraContentResourceType } from "@/ManifestClasses/Camera";
import ContentResource from "@/ManifestClasses/ContentResource";
import Light, { type LightIntensity } from "@/ManifestClasses/Light";
import ManifestObject from "@/ManifestClasses/ManifestObject";
import TextAnnotation from "@/ManifestClasses/TextAnnotation";

export const contentResourceTypeToFormat = {
  Image: "image/jpeg",
  Model: "model/gltf-binary",
} as const;

export const lightContentResourceTypes = [
  "AmbientLight",
  "DirectionalLight",
  "PointLight",
  "SpotLight",
] as const;

export const cameraContentResourceTypes = [
  "OrthographicCamera",
  "PerspectiveCamera",
] as const;

export type LightContentResourceType = (typeof lightContentResourceTypes)[number];
export type SupportedCameraContentResourceType =
  (typeof cameraContentResourceTypes)[number];
export type EditableContentResourceType =
  | keyof typeof contentResourceTypeToFormat
  | "Light"
  | "Camera";

interface LocalizedContentResourceFieldSnapshot {
  value: string;
  languageCode: string;
}

export interface ContentResourceSnapshot {
  annotationIndex: number;
  url: string;
  type: string;
  format?: string;
  annotationLabel: LocalizedContentResourceFieldSnapshot;
  resourceLabel: LocalizedContentResourceFieldSnapshot;
  coordinates: LightCoordinatesSnapshot;
}

interface LightCoordinatesSnapshot {
  hasSpatialTarget: boolean;
  x: number;
  y: number;
  z: number;
}

export interface LightTechnicalSnapshot {
  annotationIndex: number;
  type: LightContentResourceType;
  color: string;
  intensity?: LightIntensity;
  lookAtId: string;
  angle?: number;
  coordinates: LightCoordinatesSnapshot;
}

export interface CameraTechnicalSnapshot {
  annotationIndex: number;
  type: CameraContentResourceType;
  near?: number;
  far?: number;
  viewHeight?: number;
  fieldOfView?: number;
  coordinates: LightCoordinatesSnapshot;
}

export interface ContentResourceItem {
  annotation: Annotation;
  resource: ContentResource;
  annotationIndex: number;
  resourceNumber: number;
}

export interface LightContentResourceItem extends Omit<ContentResourceItem, "resource"> {
  resource: Light;
}

export interface CameraContentResourceItem
  extends Omit<ContentResourceItem, "resource"> {
  resource: Camera;
}

export interface TextAnnotationItem extends Omit<ContentResourceItem, "resource"> {
  resource: TextAnnotation;
}

export function createDefaultContentResource(
  type: EditableContentResourceType = "Model",
  _annotationIndex?: number,
): ContentResource {
  if (type === "Light") {
    return new Light("", "AmbientLight");
  }

  if (type === "Camera") {
    return new Camera("", "OrthographicCamera");
  }

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

export function getLightContentResourceTypeLabel(
  value: LightContentResourceType,
): string {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function getCameraContentResourceTypeLabel(
  value: SupportedCameraContentResourceType,
): string {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function isLightContentResourceType(
  value: string,
): value is LightContentResourceType {
  return lightContentResourceTypes.includes(value as LightContentResourceType);
}

export function isCameraContentResourceType(
  value: string,
): value is SupportedCameraContentResourceType {
  return cameraContentResourceTypes.includes(
    value as SupportedCameraContentResourceType,
  );
}

export function getLightContentResourceItems(
  manifestObj: ManifestObject,
): LightContentResourceItem[] {
  return getContentResourceItems(manifestObj).flatMap((item) =>
    item.resource instanceof Light
      ? [
          {
            ...item,
            resource: item.resource,
          },
        ]
      : [],
  );
}

export function getCameraContentResourceItems(
  manifestObj: ManifestObject,
): CameraContentResourceItem[] {
  return getContentResourceItems(manifestObj).flatMap((item) =>
    item.resource instanceof Camera
      ? [
          {
            ...item,
            resource: item.resource,
          },
        ]
      : [],
  );
}

export function getTextAnnotationItems(
  manifestObj: ManifestObject,
): TextAnnotationItem[] {

  return getContentResourceItems(manifestObj).flatMap((item) =>
    item.resource instanceof TextAnnotation
      ? [
          {
            ...item,
            resource: item.resource,
          },
        ]
      : [],
  );
}

export function hasLightTechnicalChanges(
  annotation: Annotation,
  resource: Light,
): boolean {
  const target = annotation.getTarget();
  const hasCoordinateChange =
    !!target &&
    (target.getX() !== 0 || target.getY() !== 0 || target.getZ() !== 0);

  return (
    resource.getType() !== undefined ||
    resource.getColor() !== undefined ||
    resource.getIntensity() !== undefined ||
    resource.getLookAtId().trim().length > 0 ||
    resource.getAngle() !== undefined ||
    hasCoordinateChange
  );
}

export function getDisplayableContentResourceItems(
  manifestObj: ManifestObject,
): ContentResourceItem[] {
  return getContentResourceItems(manifestObj).filter(({ resource }) =>
    !(resource instanceof Light) &&
    !(resource instanceof Camera),
  );
}

export function getContentResourceDisplayTitle(
  annotation: Annotation,
  resource: ContentResource,
  resourceNumber: number,
): string {
  const resourceLabel = resource.getLabel().getValue().trim();
  const annotationLabel = annotation.getLabel()?.getValue().trim() ?? "";

  return "" //resourceLabel || annotationLabel || `Content Resource ${resourceNumber}`;
}

export function getTextAnnotationDisplayTitle(
  annotation: TextAnnotation,
  annotationNumber: number,
): string {
  const bodyValue = annotation.getBodyValue().trim();
  const annotationLabel = annotation.getLabel()?.getValue().trim() ?? "";

  return bodyValue || annotationLabel || `Text Annotation ${annotationNumber}`;
}

function createSpatialCoordinatesSnapshot(
  annotation: Annotation,
): LightCoordinatesSnapshot {
  const target = annotation.getTarget();

  return {
    hasSpatialTarget: !!target,
    x: target?.getX() ?? 0,
    y: target?.getY() ?? 0,
    z: target?.getZ() ?? 0,
  };
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
      coordinates: createSpatialCoordinatesSnapshot(annotation),
    }),
  );
}

export function createLightTechnicalSnapshot(
  manifestObj: ManifestObject,
): LightTechnicalSnapshot[] {
  return getLightContentResourceItems(manifestObj)
    .filter(({ annotation, resource }) =>
      hasLightTechnicalChanges(annotation, resource),
    )
    .map(({ annotation, resource, annotationIndex }) => {
      return {
        annotationIndex,
        type: resource.getType() as LightContentResourceType,
        color: resource.getColor() ?? "",
        intensity: resource.getIntensity(),
        lookAtId: resource.getLookAtId(),
        angle: resource.getAngle(),
        coordinates: createSpatialCoordinatesSnapshot(annotation),
      };
    });
}

export function createCameraTechnicalSnapshot(
  manifestObj: ManifestObject,
): CameraTechnicalSnapshot[] {
  return getCameraContentResourceItems(manifestObj).map(
    ({ annotation, annotationIndex, resource }) => ({
      annotationIndex,
      type: resource.getType(),
      near: resource.getNear(),
      far: resource.getFar(),
      viewHeight: resource.getViewHeight(),
      fieldOfView: resource.getFieldOfView(),
      coordinates: createSpatialCoordinatesSnapshot(annotation),
    }),
  );
}
