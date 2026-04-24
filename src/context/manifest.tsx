import { useEffect, useRef, useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";
import { IndexedDB } from "@/utils/indexdb";
import { createManifestObjectFromUpload, serializeManifestForExport } from "@/utils/file";


export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const [manifestObj, setManifestObj] = useState(() => (new ManifestObject("scene")));
  const [db] = useState(() => new IndexedDB());
  const hydratedRef = useRef(false);

  /**
   * initialize IndexedDB and save the initial manifest object.
   */
  async function initDB() {
    await db.open();
    const currentSavedManifest = await db.getProject("current");
    if (currentSavedManifest) {
      const manifestFromDB = createManifestObjectFromUpload(currentSavedManifest as ManifestObject);
      setManifestObj(manifestFromDB);
    } else {
      await db.saveProject(serializeManifestForExport(manifestObj));
    }
    hydratedRef.current = true;
  }

  // Persist any manifest change after the DB has been hydrated. Routing persistence
  // through this effect instead of each setter ensures imports, snapshot restores,
  // and future callsites all save without having to remember to call the DB.
  useEffect(() => {
    if (!hydratedRef.current) {
      initDB().catch((error) => {
        console.error("Failed to initialize IndexedDB:", error);
      });
      return;
    }

    if (!hydratedRef.current) return;
    db.saveProject(serializeManifestForExport(manifestObj)).catch((error) => {
      console.error("Failed to save manifest to IndexedDB:", error);
    });
  }, [manifestObj, db]);

  /**
   * use this function when you want to mutate the manifest object without replacing it with a new instance of the manifest object. This is useful for when you want to trigger a re-render after mutating the manifest object, since React won't detect changes to object if it's mutated directly without creating a new instance.
   * 
   */
  const updateManifestObj = () => {
    setManifestObj(prev => prev.clone());
  };

  return (
    <manifestObjContext.Provider
      value={{ manifestObj, updateManifestObj, setManifestObj }}
    >
      {children}
    </manifestObjContext.Provider>
  );
};

