import type { Dispatch, SetStateAction } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject.ts";

//renamed Structure tab to Asset,Technical tab to Environment, and moved Asset and Environment ahead.
export const MANIFEST_TABS = [
  { id: "overview", label: "Overview" },
  { id: "descriptive", label: "Descriptive" },
   { id: "structure", label: "Asset" },
  { id: "technical", label: "Environment" },
  { id: "metadata", label: "Metadata" },
  { id: "linking", label: "Linking" },
  { id: "nav-place", label: "Nav place" },
]

export type ManifestTabId = (typeof MANIFEST_TABS)[number]["id"];

export interface ManifestTabProps {
  manifestObj: ManifestObject;
  setCount?: Dispatch<SetStateAction<number>>;
}
