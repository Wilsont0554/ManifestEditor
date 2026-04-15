import type { Dispatch, SetStateAction } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject.ts";

export const MANIFEST_TABS = [
  { id: "overview", label: "Overview" },
  { id: "descriptive", label: "Descriptive" },
  { id: "metadata", label: "Metadata" },
  { id: "technical", label: "Environment" },
  { id: "linking", label: "Linking" },
  { id: "structure", label: "Assets" },
  { id: "nav-place", label: "Nav place" },
  { id: "json-preview", label: "JSON Preview" },
]

export type ManifestTabId = (typeof MANIFEST_TABS)[number]["id"];

export interface ManifestTabProps {
  manifestObj: ManifestObject;
  setCount?: Dispatch<SetStateAction<number>>;
}
