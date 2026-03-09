import React from "react";
import LabelElement from "./LabelElement.jsx";

function ContentResourceElement(props) {
    const { manifestObj, contentResourceIndex, setcount, count } = props;

    // Grab the specific resource from the class instance
    const resource = manifestObj
        .getContainerObj()
        .getAnnotationPage()
        .getAnnotation(contentResourceIndex)
        .getContentResource();

    const types = {
        "Image": "image/jpeg",
        "Model": "model/gltf-binary"
    };

    if (!resource) return <p>No resource found.</p>;

    return (
        <div className="sidebar-editor-container">
            <div className="field-group">
                <label>Type</label>
                <select
                    value={resource.getType() || ""} 
                    onChange={(e) => {
                        resource.setType(e.target.value);
                        resource.setFormat(types[e.target.value]);
                        setcount(count + 1); // Trigger re-render of App.js
                    }}
                >
                    <option value="" disabled>Select Type</option>
                    {Object.keys(types).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="field-group">
                <label>URL</label>
                <input
                    placeholder="https://..."
                    type="text"
                    value={resource.id || ""} 
                    onChange={(e) => {
                        resource.setID(e.target.value);
                        setcount(count + 1);
                    }}
                />
            </div>

            <div className="label-section">
                <h4>Annotation Label</h4>
                <LabelElement 
                    {...props} 
                    currentObject={manifestObj.getContainerObj().getAnnotationPage().getAnnotation(contentResourceIndex)} 
                />

                <h4>Content Resource Label</h4>
                <LabelElement 
                    {...props} 
                    currentObject={resource} 
                />
            </div>
        </div>
    );
}

export default ContentResourceElement;