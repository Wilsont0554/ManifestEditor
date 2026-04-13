import { useContext } from "react";
import { manifestObjContext } from "@/context/manifest-context";

import { JsonEditor } from "json-edit-react";

function JsonTab() {
    const { manifestObj} = useContext(manifestObjContext);
    
    return <JsonEditor className="previewTest" data={JSON.parse(JSON.stringify(manifestObj)) as object} />
}

export default JsonTab;
