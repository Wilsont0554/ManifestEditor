import { useEffect, useRef, useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";
import { IndexedDB } from "@/utils/indexdb";
import {
  createManifestObjectFromUpload,
  serializeManifestForExport,
} from "@/utils/file";

export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const [manifestObj, setManifestObj] = useState(() => new ManifestObject("Scene"));
  const [db] = useState(() => new IndexedDB());
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (!hydratedRef.current) {
      let isMounted = true;

      async function initDB() {
        await db.open();
        const currentSavedManifest = await db.getProject("current");

        if (currentSavedManifest) {
          const manifestFromDB = createManifestObjectFromUpload(
            currentSavedManifest as ManifestObject,
          );

          if (isMounted) {
            setManifestObj(manifestFromDB);
          }
        } else {
          await db.saveProject(serializeManifestForExport(manifestObj));
        }

        hydratedRef.current = true;
      }

      void initDB().catch((error) => {
        console.error("Failed to initialize IndexedDB:", error);
      });

      return () => {
        isMounted = false;
      };
    }

    db.saveProject(serializeManifestForExport(manifestObj)).catch((error) => {
      console.error("Failed to save manifest to IndexedDB:", error);
    });
  }, [manifestObj, db]);

  const updateManifestObj = () => {
    setManifestObj((prev) => prev.clone());
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

