export const supportedLanguageCodes = [
  "en",
  "es",
  "fr",
  "de",
  "it",
  "ru",
  "zh",
  "jp",
  "pt",
  "ar",
  "hi",
  "sv",
  "nl",
  "ko",
  "tr",
  "vi",
] as const;

export type SupportedLanguageCode = (typeof supportedLanguageCodes)[number];

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
  items: IiifCanvasLike[];
}
