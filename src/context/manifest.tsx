import { useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";
import { isAdvancedViewContext } from "./manifest-context";

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

export const AdvancedViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [advancedView, setAdvancedView] = useState(false);

  const toggleAdvancedView = () => {
    setAdvancedView(!advancedView);
  };

  return (
    <isAdvancedViewContext.Provider
      value={{ advancedView, toggleAdvancedView }}
    >
      {children}
    </isAdvancedViewContext.Provider>
  );
};

