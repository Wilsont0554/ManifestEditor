import { JsonEditor } from "json-edit-react";
import ContentResourceEditor from "../../Components/editors/manifest/content-resource-editor/index.jsx";
import Button from "../../Components/shared/button/index.jsx";

function ManifestEditorPage({
  setCount,
  containerType,
  onContainerTypeChange,
  onAddContentResource,
  onDownloadManifest,
  contentResources,
  manifestObj,
}) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="cursor-pointer text-sm font-medium text-slate-700 underline underline-offset-2 hover:text-slate-900"
          type="button"
          onClick={onDownloadManifest}
        >
          Download JSON
        </button>

        <label htmlFor="container-type" className="sr-only">
          Container Type
        </label>

        <select
          id="container-type"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
          value={containerType}
          onChange={(event) => onContainerTypeChange(event.target.value)}
        >
          <option>Canvas</option>
          <option>Scene</option>
        </select>

        <Button type="button" onClick={onAddContentResource}>
          Add Content Resource
        </Button>
      </div>

      <ol className="space-y-3">
        {contentResources.map((_resource, contentResourceIndex) => (
          <ContentResourceEditor
            key={contentResourceIndex}
            setCount={setCount}
            index={contentResourceIndex}
            contentResourceIndex={contentResourceIndex}
            manifestObj={manifestObj}
          />
        ))}
      </ol>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <JsonEditor data={manifestObj} />
      </div>
    </section>
  );
}

export default ManifestEditorPage;
