export const supportedLanguageCodes = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "ru",
  "zh",
  "ja",
  "pt",
  "ar",
  "hi",
  "sv",
  "nl",
  "ko",
  "tr",
  "vi",
] as const;

export const iiifContainerTypes = ["Timeline", "Canvas", "Scene"] as const;

export const manifestViewingDirections = [
  "left-to-right",
  "right-to-left",
  "top-to-bottom",
  "bottom-to-top",
] as const;

export const manifestOrderingBehaviors = [
  "unordered",
  "individuals",
  "continuous",
  "paged",
] as const;

export const manifestRepeatBehaviors = ["repeat", "no-repeat"] as const;

export const manifestAutoAdvanceBehaviors = [
  "auto-advance",
  "no-auto-advance",
] as const;

export const builtInManifestBehaviors = [
  ...manifestOrderingBehaviors,
  ...manifestRepeatBehaviors,
  ...manifestAutoAdvanceBehaviors,
] as const;

export type SupportedLanguageCode = (typeof supportedLanguageCodes)[number];
export type IiifContainerType = (typeof iiifContainerTypes)[number];
export type ManifestViewingDirection =
  (typeof manifestViewingDirections)[number];
export type ManifestOrderingBehavior =
  (typeof manifestOrderingBehaviors)[number];
export type ManifestRepeatBehavior = (typeof manifestRepeatBehaviors)[number];
export type ManifestAutoAdvanceBehavior =
  (typeof manifestAutoAdvanceBehaviors)[number];
export type BuiltInManifestBehavior =
  (typeof builtInManifestBehaviors)[number];

export type IiifLanguageMap = Record<string, string[]>;

export interface IiifMetadataItem {
  label: IiifLanguageMap;
  value: IiifLanguageMap;
}

export interface IiifLinkedResource {
  id: string;
  type: string;
  format?: string;
  label?: IiifLanguageMap;
}

export interface IiifResourceReference {
  id: string;
  type: string;
}

export interface IiifQuantity {
  type: "Value";
  unit: string;
  value: number;
}

export interface IiifPointSelector {
  id?: string;
  type: "PointSelector";
  x?: number;
  y?: number;
  z?: number;
  instant?: number;
}

export interface IiifTransForm {
  id?: string;
  type: "RotateTransform" | "ScaleTransform" | "TranslateTransform";
  x?: number;
  y?: number;
  z?: number;
}

export interface IiifSpecificResource {
  id?: string;
  type: "SpecificResource";
  source: IiifResourceReference[];
  selector: IiifPointSelector[];
}

export interface IiifTextualBody {
  id?: string;
  type: "TextualBody";
  value: string;
  format?: string;
  language?: string;
  purpose?: string;
  position?: IiifSpecificResource;
}

export interface IiifContentResource {
  id: string;
  type: string;
  format?: string;
  label?: IiifLanguageMap;
  metadata?: IiifMetadataItem[];
  height?: number;
  width?: number;
  duration?: number;
  summary?: IiifLanguageMap;
  color?: string;
  angle?: number;
  intensity?: IiifQuantity;
  lookAt?: IiifResourceReference;
  near?: number;
  far?: number;
  viewHeight?: number;
  fieldOfView?: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface IiifAnnotation {
  id: string;
  type: string;
  motivation: string[];
  body: IiifContentResource | IiifTextualBody;
  target: IiifResourceReference | IiifSpecificResource;
  label?: IiifLanguageMap;
}

export interface IiifAnnotationPage {
  id: string;
  type: string;
  items: IiifAnnotation[];
}

export interface IiifCanvasLike {
  id: string;
  type: IiifContainerType;
  items: IiifAnnotationPage[];
  duration?: number;
  height?: number;
  width?: number;
}

export interface IiifManifest {
  "@context"?: string | string[];
  id: string;
  type: string;
  label: IiifLanguageMap;
  summary?: IiifLanguageMap;
  metadata?: IiifMetadataItem[];
  homepage?: IiifLinkedResource[];
  seeAlso?: IiifLinkedResource[];
  navPlace?: string;
  rights?: string;
  navDate?: string;
  viewingDirection?: ManifestViewingDirection;
  behavior?: string[];
  items: IiifCanvasLike[];
  annotations?: IiifAnnotationPage[];
}