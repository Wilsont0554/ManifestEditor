import { createContext } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";

type ManifestEditableField =
  | "id"
  | "label"
  | "summary"
  | "rights"
  | "navDate"
  | "contentResources"
  | "viewingDirection"
  | "manifestOrderingBehavior"
  | "repeatBehavior"
  | "autoAdvanceBehavior"
  | "customBehaviors"
  | "lightTechnical"
  | "metadata";

export type ManifestObjContext = {
  manifestObj: ManifestObject;
  updateManifestObj: (newObj: ManifestObject) => void;
  isFieldEdited: (field: ManifestEditableField) => boolean;
};

const defaultManifestObj = new ManifestObject("Scene");

export const manifestObjContext = createContext<ManifestObjContext>({
  manifestObj: defaultManifestObj,
  updateManifestObj: () => {},
  isFieldEdited: () => false,
});
