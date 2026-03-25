import { useContext } from "react";
import { manifestObjContext } from "@/context/manifest-context";
import { getDisplayableContentResourceItems } from "@/utils/content-resource";
import ContentResourceMediaList from "../shared/content-resource-media-list";
import ManifestTabBody from "../shared/manifest-tab-body";

function StructureTab() {
  const { manifestObj } = useContext(manifestObjContext);
  const mediaItems = getDisplayableContentResourceItems(manifestObj);

  return (
    <ManifestTabBody className="pb-6">
      <section className="space-y-4">
        <p className="text-lg font-medium text-slate-950">Media</p>

        {mediaItems.length > 0 ? <ContentResourceMediaList items={mediaItems} /> : null}
      </section>
    </ManifestTabBody>
  );
}

export default StructureTab;
