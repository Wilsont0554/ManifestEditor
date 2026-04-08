import { createContext } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";

export type ManifestObjContext = {
  manifestObj: ManifestObject;
  updateManifestObj: () => void;
  // handleManifestFieldChange: <T>(
  //   setter: (value: T) => void
  // ) => (value: T) => void;
};

const defaultManifestObj = new ManifestObject("Scene");

export const manifestObjContext = createContext<ManifestObjContext>({
  manifestObj: defaultManifestObj,
  updateManifestObj: () => {},
  // handleManifestFieldChange: <T>(_setter: (value: T) => void) => {
  //   return (_value: T) => {};
  // },
});