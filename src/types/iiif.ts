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

export interface IiifResourceReference {
  id: string;
  type: string;
}

export interface IiifPointSelector {
  id?: string;
  type: "PointSelector";
  x?: number;
  y?: number;
  z?: number;
}