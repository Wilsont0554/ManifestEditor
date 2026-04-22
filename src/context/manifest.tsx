import { useEffect, useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";
import { IndexedDB } from "@/utils/indexdb";
import { createManifestObjectFromUpload, serializeManifestForExport } from "@/utils/file";


export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const [manifestObj, setManifestObj] = useState(() => (new ManifestObject("scene")));
  const [db] = useState(() => new IndexedDB());

  /**
   * initialize IndexedDB and save the initial manifest object.
   */
  async function initDB() {
    await db.open();
    const currentSavedManifest = await db.getProject("current");
    if (currentSavedManifest) {
      //TO DO: convert the plain object back to ManifestObject instance and set it to state
      const manifestFromDB = createManifestObjectFromUpload(currentSavedManifest as ManifestObject);
      setManifestObj(manifestFromDB);
    } else {
      await db.saveProject(serializeManifestForExport(manifestObj));
      console.log("Saved initial manifest to IndexedDB");
    }
  }

  useEffect(() =>{
    initDB();
  }, []);

  const updateManifestObj = () => {
   setManifestObj(prev => {
     const updatedManifest = prev.clone();
     db.saveProject(serializeManifestForExport(updatedManifest)).catch((error) => {
       console.error("Failed to save manifest to IndexedDB:", error);
     });
     return updatedManifest;
   });
  };

  return (
    <manifestObjContext.Provider
      value={{ manifestObj, updateManifestObj, setManifestObj }}
    >
      {children}
    </manifestObjContext.Provider>
  );
};

