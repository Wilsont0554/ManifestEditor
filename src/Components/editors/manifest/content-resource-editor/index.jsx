import { useState } from "react";
import Input from "../../../shared/input/index.jsx";
import LabelEditor from "../label-editor/index.jsx";

const CONTENT_RESOURCE_TYPES = {
  Image: "image/jpeg",
  Model: "model/gltf-binary",
};

function ContentResourceEditor({ manifestObj, contentResourceIndex, index, setCount }) {
  const [annotationURL, setAnnotationURL] = useState("");
  const [selectedType, setSelectedType] = useState("Model");

  return (
    <li className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
          value={selectedType}
          onChange={(event) => {
            const nextType = event.target.value;
            setSelectedType(nextType);

            manifestObj
              .getContainerObj()
              .getAnnotationPage()
              .getAnnotation(0)
              .getContentResource(contentResourceIndex)
              .setType(nextType);

            manifestObj
              .getContainerObj()
              .getAnnotationPage()
              .getAnnotation(0)
              .getContentResource(contentResourceIndex)
              .setFormat(CONTENT_RESOURCE_TYPES[nextType]);

            setCount((value) => value + 1);
          }}
        >
          {Object.keys(CONTENT_RESOURCE_TYPES).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <Input
          className="max-w-lg"
          placeholder="URL"
          type="text"
          value={annotationURL}
          onChange={(event) => {
            const nextURL = event.target.value;
            setAnnotationURL(nextURL);

            manifestObj
              .getContainerObj()
              .getAnnotationPage()
              .getAnnotation()
              .getContentResource(index)
              .setID(nextURL);

            setCount((value) => value + 1);
          }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Annotation Label</p>
        <LabelEditor
          setCount={setCount}
          currentObject={manifestObj.getContainerObj().getAnnotationPage().getAnnotation()}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-700">Content Resource Label</p>
        <LabelEditor
          setCount={setCount}
          currentObject={
            manifestObj
              .getContainerObj()
              .getAnnotationPage()
              .getAnnotation()
              .getContentResource(contentResourceIndex)
          }
        />
      </div>
    </li>
  );
}

export default ContentResourceEditor;
