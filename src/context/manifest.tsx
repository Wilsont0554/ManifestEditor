import { useRef, useEffect, useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";
import { manifestObjContext } from "./manifest-context";
import { isAdvancedViewContext } from "./manifest-context";
import { IndexedDB } from "@/utils/indexdb";
import { createManifestObjectFromUpload } from "@/utils/file";
import { useLocation, useNavigate } from "react-router";
import { serializeManifestForExport } from "../utils/file";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import samples from "@/examples";

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
  const exampleIdx = location.state?.exampleIdx;

  //load manifestObj on page load
  useEffect(() => {
    let isInterrupted = false;
    let loadedManifest = new ManifestObject("scene");
    /**
     * handle different cases of loading a manifest
     * @returns true if manifest is loaded successfully, false otherwise
     */
    async function loadManifest() {
      if (!id) {
        reRoute("/404");
        return false;
      }

      // CASE 1: manifest is loaded as an example
      if (isExampleManifest) {
        if (!exampleIdx) {
          reRoute("/404");
          return false;
        }
        loadedManifest = createManifestObjectFromUpload(samples[exampleIdx]);
        setManifestObj(loadedManifest);
        return true;
      }

      const db = dbRef.current;
      await db.open();
      if (isInterrupted) return false;

      // CASE 2: manifest that is created or imported by user (all will be saved in indexedDB)
      const manifestFromDB = await db.getProject(id!);
      if (isInterrupted) return false;
      if (!manifestFromDB) {
        reRoute("/404");
        return false;
      }
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
  }, [id, isExampleManifest, exampleIdx, location.pathname, reRoute]);

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
  }, [id, isDBLoaded, manifestObj, saveManifestToDB]);

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

