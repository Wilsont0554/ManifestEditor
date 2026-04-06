import { useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";

export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const [manifestObj, setManifestState] = useState(() => new ManifestObject("Scene"));

  const updateManifestObj = () => {
    setManifestState(prev => prev.clone());
  };

  const setManifestObj = (nextManifestObj: ManifestObject) => {
    setManifestState(nextManifestObj);
  };

  // const handleManifestFieldChange = <T,>(setter: (value: T) => void) => {
  //   return (value: T) => {
  //     setter(value);
  //     updateManifestObj();
  //   };
  // };

  return (
    <manifestObjContext.Provider
      value={{ manifestObj, updateManifestObj, setManifestObj }}
    >
      {children}
    </manifestObjContext.Provider>
  );
};

