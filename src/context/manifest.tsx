import { createContext } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";

type ManifestObjContext = {
  manifestObj: ManifestObject;
};

export const manifestObjContext = createContext<ManifestObjContext>({
  manifestObj: new ManifestObject("scene"),
});

export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const manifestObj = new ManifestObject("scene");

  return (
    <manifestObjContext.Provider value={{ manifestObj }}>
      {children}
    </manifestObjContext.Provider>
  );
};

