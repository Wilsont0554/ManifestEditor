import { createContext, useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";

type ManifestObjContext = {
  manifestObj: ManifestObject;
  updateManifestObj: (newObj: ManifestObject) => void;
};

export const manifestObjContext = createContext<ManifestObjContext>({
  manifestObj: new ManifestObject("scene"),
  updateManifestObj: () => {},
});

export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const [manifestObj, setManifestObj] = useState(new ManifestObject("scene"));

  const updateManifestObj = (newObj: ManifestObject) => {
    setManifestObj(newObj);
  };

  return (
    <manifestObjContext.Provider value={{ manifestObj, updateManifestObj }}>
      {children}
    </manifestObjContext.Provider>
  );
};

