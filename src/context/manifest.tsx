import { useEffect, useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";
import { IndexedDB } from "@/utils/indexdb";


export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const [manifestObj, setManifestObj] = useState(() => new ManifestObject("Scene"));
  const [db] = useState(() => new IndexedDB());

  /**
   * initialize IndexedDB and save the initial manifest object.
   */
  async function initDB() {
    await db.open();
    const currentSavedManifest = await db.getProject("current");
    if (currentSavedManifest) {
      //TO DO: convert the plain object back to ManifestObject instance and set it to state
    } else {
      await db.saveProject(manifestObj.toJSON());
    }
  }

  useEffect(() =>{
    initDB();
  }, []);

  const updateManifestObj = () => {
   setManifestObj(prev => prev.clone());
    db.saveProject(manifestObj.toJSON()).catch((error) => {
      console.error("Failed to save manifest to IndexedDB:", error);
    });
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

