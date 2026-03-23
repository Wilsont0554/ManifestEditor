import LabelElement from "./LabelElement.tsx";
import type { ResourceEditorProps } from "./types.ts";

const resourceTypes = {
  Image: "image/jpeg",
  Model: "model/gltf-binary",
} as const;

type ResourceType = keyof typeof resourceTypes;

function ContentResourceElement({
  manifestObj,
  contentResourceIndex,
  setcount,
  count,
  setIsEditingMetadata,
}: ResourceEditorProps) {
  const resource = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAnnotation(contentResourceIndex)
    .getContentResource();

  if (!resource) {
    return <p>No resource found.</p>;
  }

  const annotation = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAnnotation(contentResourceIndex);

  return (
    <div className="sidebar-editor-container">
      <div className="field-group">
        <label>Type</label>
        <select
          value={resource.getType() || ""}
          onChange={(event) => {
            const nextType = event.target.value as ResourceType;
            resource.setType(nextType);
            resource.setFormat(resourceTypes[nextType]);
            setcount(count + 1);
          }}
        >
          <option value="" disabled>
            Select Type
          </option>
          {Object.keys(resourceTypes).map((resourceType) => (
            <option key={resourceType} value={resourceType}>
              {resourceType}
            </option>
          ))}
        </select>
      </div>

      <div className="field-group">
        <label>URL</label>
        <input
          placeholder="https://..."
          type="text"
          value={resource.id || ""}
          onChange={(event) => {
            resource.setID(event.target.value);
            setcount(count + 1);
          }}
        />
      </div>

      <div className="label-section">
        <h4>Annotation Label</h4>
        <LabelElement count={count} setcount={setcount} currentObject={annotation} />

        <h4>Content Resource Label</h4>
        <LabelElement count={count} setcount={setcount} currentObject={resource} />
      </div>

      <div className="field-group" style={{ marginTop: "20px" }}>
        <button
          type="button"
          onClick={() => setIsEditingMetadata(true)}
          style={{
            width: "100%",
            padding: "8px 12px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9em",
          }}
        >
          Edit Metadata
        </button>
      </div>
    </div>
  );
}

export default ContentResourceElement;
