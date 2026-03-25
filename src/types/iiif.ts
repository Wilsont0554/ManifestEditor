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

export interface IiifContentResource {
  id: string;
  type: string;
  format: string;
  label?: IiifLanguageMap;
  metadata?: IiifMetadataItem[];
  height?: number;
  width?: number;
  duration?: number;
  summary?: IiifLanguageMap;
}

export interface IiifAnnotation {
  id: string;
  type: string;
  motivation: string[];
  body: IiifContentResource[];
  target: string;
  label?: IiifLanguageMap;
}

export interface IiifAnnotationPage {
  id: string;
  type: string;
  items: IiifAnnotation[];
}

export interface IiifCanvasLike {
  id?: string;
  type: string;
  items: IiifAnnotationPage[];
}

export interface IiifManifest {
  "@context"?: string | string[];
  id: string;
  type: string;
  label?: IiifLanguageMap;
  summary?: IiifLanguageMap;
  metadata?: IiifMetadataItem[];
  homepage?: IiifLinkedResource[];
  seeAlso?: IiifLinkedResource[];
  navPlace?: string;
  viewingDirection?: ManifestViewingDirection;
  behavior?: string[];
  items: IiifCanvasLike[];
}
