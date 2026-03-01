import React, { useMemo, useState } from "react";
import LabelElement from "./LabelElement.jsx";

function ContentResourceElement(props) {
  const [annotationURL, setAnnotationURL] = useState("");
  const [selectedType, setSelectedType] = useState("Image");

  const canvasIndex = props.canvasIndex ?? 0;
  const types = useMemo(
    () => ({
      Image: "image/jpeg",
      Model: "model/gltf-binary",
    }),
    [],
  );

  const container = props.manifestObj.getContainerObj(canvasIndex);
  const annotation = container.getAnnotationPage().getAnnotation(0);
  const contentResource = annotation.getContentResource(props.contentResourceIndex);

  const bumpCount = () => {
    if (typeof props.setcount === "function") {
      props.setcount(props.count + 1);
    }
  };

  return (
    <li>
      <select
        value={selectedType}
        onChange={(event) => {
          const nextType = event.target.value;
          setSelectedType(nextType);
          contentResource.setType(nextType);
          contentResource.setFormat(types[nextType]);
          bumpCount();
        }}
        style={{ padding: "5px" }}
      >
        {Object.keys(types).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <input
        placeholder="URL"
        type="text"
        value={annotationURL}
        onChange={(event) => {
          const nextUrl = event.target.value;
          setAnnotationURL(nextUrl);
          if (typeof contentResource.changeID === "function") {
            contentResource.changeID(nextUrl);
          } else {
            contentResource.setID(nextUrl);
          }
          bumpCount();
        }}
      />

      <p>Annotation Label</p>
      <LabelElement {...props} currentObject={annotation} labelIndex={0} />

      <p>Content Resource Label</p>
      <LabelElement {...props} currentObject={contentResource} labelIndex={0} />
    </li>
  );
}

export default ContentResourceElement;
