import { createContext, useState } from "react";
import ManifestObject from "@ManifestClasses/ManifestObject";

type ManifestEditableField = "label" | "summary" | "rights" | "navDate";

interface LocalizedManifestFieldSnapshot {
  value: string;
  languageCode: string;
}

interface ManifestEditableSnapshot {
  label: LocalizedManifestFieldSnapshot;
  summary: LocalizedManifestFieldSnapshot;
  rights: string;
  navDate: string;
}

type ManifestObjContext = {
  manifestObj: ManifestObject;
  updateManifestObj: (newObj: ManifestObject) => void;
  isFieldEdited: (field: ManifestEditableField) => boolean;
};

function createManifestEditableSnapshot(
  manifestObj: ManifestObject,
): ManifestEditableSnapshot {
  return {
    label: {
      value: manifestObj.getLabelValue(),
      languageCode: manifestObj.getLabelLanguage(),
    },
    summary: {
      value: manifestObj.getSummaryValue(),
      languageCode: manifestObj.getSummaryLanguage(),
    },
    rights: manifestObj.getRights(),
    navDate: manifestObj.getNavDate(),
  };
}

function isLocalizedFieldEdited(
  currentField: LocalizedManifestFieldSnapshot,
  initialField: LocalizedManifestFieldSnapshot,
): boolean {
  return (
    currentField.value !== initialField.value ||
    currentField.languageCode !== initialField.languageCode
  );
}

const defaultManifestObj = new ManifestObject("scene");
const defaultManifestSnapshot =
  createManifestEditableSnapshot(defaultManifestObj);

export const manifestObjContext = createContext<ManifestObjContext>({
  manifestObj: defaultManifestObj,
  updateManifestObj: () => {},
  isFieldEdited: () => false,
});

export const ManifestObjProvider = ({ children }: { children: React.ReactNode }) => {
  const [manifestObj, setManifestObj] = useState(() => new ManifestObject("scene"));
  const [initialSnapshot] = useState(defaultManifestSnapshot);
  const currentSnapshot = createManifestEditableSnapshot(manifestObj);

  const updateManifestObj = (newObj: ManifestObject) => {
    setManifestObj(newObj);
  };

  const isFieldEdited = (field: ManifestEditableField) => {
    if (field === "label" || field === "summary") {
      return isLocalizedFieldEdited(currentSnapshot[field], initialSnapshot[field]);
    }

    return currentSnapshot[field] !== initialSnapshot[field];
  };

  return (
    <manifestObjContext.Provider
      value={{ manifestObj, updateManifestObj, isFieldEdited }}
    >
      {children}
    </manifestObjContext.Provider>
  );
};

