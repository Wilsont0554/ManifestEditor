import { useContext } from "react";
import { JsonEditor } from "json-edit-react";
import { manifestObjContext } from "@/context/manifest-context";
import ManifestTabBody from "../shared/manifest-tab-body";

function JsonPreviewTab() {
  const { manifestObj } = useContext(manifestObjContext);
  const manifestPreview = JSON.parse(JSON.stringify(manifestObj)) as object;

  return (
    <ManifestTabBody className="pb-6">
      <JsonEditor data={manifestPreview} />
    </ManifestTabBody>
  );
}

export default JsonPreviewTab;
