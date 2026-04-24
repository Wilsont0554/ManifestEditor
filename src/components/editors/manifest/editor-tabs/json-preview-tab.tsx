import { useContext } from "react";
import { JsonEditor } from "json-edit-react";
import { manifestObjContext } from "@/context/manifest-context";

function JsonPreviewTab() {
  const { manifestObj } = useContext(manifestObjContext);
  const manifestPreview = JSON.parse(JSON.stringify(manifestObj)) as object;

  return (
    <div className="min-h-40 space-y-8 pb-6">
      <JsonEditor data={manifestPreview} />
    </div>
  );
}

export default JsonPreviewTab;
