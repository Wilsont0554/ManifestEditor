import type { Dispatch, SetStateAction } from "react";
import type ManifestObject from "../ManifestClasses/TypeScript/ManifestObject.ts";

export type CountSetter = Dispatch<SetStateAction<number>>;
export type BoolSetter = Dispatch<SetStateAction<boolean>>;

export interface ResourceEditorProps {
  manifestObj: ManifestObject;
  contentResourceIndex: number;
  count: number;
  setcount: CountSetter;
  setIsEditingMetadata: BoolSetter;
}

export interface MetadataElementProps {
  manifestObj: ManifestObject;
  metadataIndex: number;
  count: number;
  setcount: CountSetter;
}

export interface LabelChangeTarget {
  changeLabel(index: number, value: string, languageCode?: string): void;
}

export interface LabelElementProps {
  currentObject: LabelChangeTarget;
  count: number;
  setcount: CountSetter;
  labelIndex?: number;
}
