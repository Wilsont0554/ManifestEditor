import { useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";

export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const [manifestObj, setManifestObj] = useState(() => new ManifestObject("Scene"));

  const updateManifestObj = () => {
    setManifestObj(prev => prev.clone());
  };

  // const handleManifestFieldChange = <T,>(setter: (value: T) => void) => {
  //   return (value: T) => {
  //     setter(value);
  //     updateManifestObj();
  //   };
  // };

  return (
    <manifestObjContext.Provider
      value={{ manifestObj, updateManifestObj}}
    >
      {children}
    </manifestObjContext.Provider>
  );
};

