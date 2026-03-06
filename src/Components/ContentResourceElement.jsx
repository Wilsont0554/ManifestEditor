import React from "react";
import LabelElement from "./LabelElement.jsx";

function ContentResourceElement(props) {
    const { manifestObj, contentResourceIndex, setcount, count, setIsEditingMetadata } = props;

    // Grab the specific resource from the class instance
    const resource = manifestObj
        .getContainerObj()
        .getAnnotationPage()
        .getAnnotation(0)
        .getContentResource(contentResourceIndex);

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
                    currentObject={manifestObj.getContainerObj().getAnnotationPage().getAnnotation()} 
                />

                <h4>Content Resource Label</h4>
                <LabelElement 
                    {...props} 
                    currentObject={resource} 
                />
            </div>

            <div className="field-group" style={{ marginTop: '20px' }}>
                <button
                    type="button"
                    onClick={() => setIsEditingMetadata(true)}
                    style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9em'
                    }}
                >
                    Edit Metadata
                </button>
            </div>
        </div>
    );
}

export default ContentResourceElement;