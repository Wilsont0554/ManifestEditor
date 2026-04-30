import { useRef, useEffect, useState, useCallback } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";
import { IndexedDB } from "@/utils/indexdb";
import { createManifestObjectFromUpload } from "@/utils/file";
import { useLocation, useNavigate } from "react-router";
import { serializeManifestForExport } from "../utils/file";
import { useDebouncedCallback } from "@/hooks/useDebounce";

type Props = {
  id: string | undefined; //unique id code of the manifest
  children: React.ReactNode; //children components that can access manifestObjContext
};

export const ManifestObjProvider = ({ id, children }: Props) => {
  const [manifestObj, setManifestObj] = useState(new ManifestObject("scene"));
  const [isDBLoaded, setIsDBLoaded] = useState(false);
  const dbRef = useRef<IndexedDB>(new IndexedDB());

  const reRoute = useNavigate();

  const location = useLocation();
  const isExampleManifest = location.state?.isExample;
  const importedManifest = location.state?.manifest;

  //load manifestObj on page load
  useEffect(() => {
    setIsDBLoaded(false);
    let isInterrupted = false;
    let loadedManifest: ManifestObject | null = null;

    /**
     * handle different cases of loading a manifest
     * @returns true if manifest is loaded successfully, false otherwise
     */
    async function loadManifest() {
      if (!id) {
        reRoute("/404");
      }

      if (importedManifest) {
        loadedManifest = createManifestObjectFromUpload(importedManifest);
      }

      // CASE 1: manifest is loaded as an example
      if (isExampleManifest) {
        if (!loadManifest) reRoute("/404");
        setManifestObj(loadedManifest!);
        return true;
      }

      const db = dbRef.current;
      await db.open();
      if (isInterrupted) return false;

      // CASE 2: manifest is imported by user or newly created
      if (loadedManifest) {
        setManifestObj(loadedManifest!);
        await db.saveProject(importedManifest, id!);
        reRoute(location.pathname, { replace: true, state: null });
        return true;
      }

      // CASE 3: manifest that previously edited by user and is accessed by clicking project in homepage
      const manifestFromDB = await db.getProject(id!);
      if (isInterrupted) return false;
      if (!manifestFromDB) reRoute("/404");
      loadedManifest = createManifestObjectFromUpload(manifestFromDB as ManifestObject);
      setManifestObj(loadedManifest);
      return true;
    }

    loadManifest()
      .then((loaded) => setIsDBLoaded(loaded))
      .catch((err) => {
        console.log("error loading manifest: ", err);
      });
    return () => {
      isInterrupted = true;
    };
  }, [id, isExampleManifest, importedManifest]);

  /**
   * debounced version of the function that saves manifest to indexedDB
   * save is delayed by 500ms 
   */
  const saveManifestToDB = useDebouncedCallback(() => {
    if (!isDBLoaded || !id || isExampleManifest) return;
    const db = dbRef.current;
    const parsedManifest = serializeManifestForExport(manifestObj);
    db.saveProject(parsedManifest, id).catch((err) => {
      console.log("error saving manifest to db: ", err);
    });
  }, 500);

  //save manifest to indexedDB whenever there is an update to manifestObj
  useEffect(() => {
    saveManifestToDB();
  }, [manifestObj, isDBLoaded, id]);

  /**
   * updates manifest after user makes changes by input
   */
  const updateManifestObj = () => {
    setManifestObj((prev) => prev.clone());
  };

  if (!isDBLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <manifestObjContext.Provider
      value={{ manifestObj, updateManifestObj, setManifestObj }}
    >
      {children}
    </manifestObjContext.Provider>
  );
};
