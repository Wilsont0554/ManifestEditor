import React from "react";
import LabelElement from "./LabelElement.jsx";

function ContentResourceElement(props) {
    const { manifestObj, contentResourceIndex, setcount, count } = props;

    // Grab the specific resource from the class instance
    const resource = manifestObj
        .getContainerObj()
        .getAnnotationPage()
        .getAnnotation(0)
        .getContentResource(contentResourceIndex);

    var types;

    if (resource.getType().includes("Light")){
        types = {
            "AmbientLight" : undefined,
            "DirectionalLight" : undefined,
            "PointLight" : undefined,
            "SpotLight" : undefined
        }
    }
    else{
        types = {
            "Image": "image/jpeg",
            "Model": "model/gltf-binary",
        };
    }

    function updateResource(e){
        resource.setType(e.target.value);
        resource.setFormat(types[e.target.value]);
        setcount(count + 1); // Trigger re-render of App.js
    }

    if (!resource) return <p>No resource found.</p>;

    return (
        <div className="sidebar-editor-container">
            <div className="field-group">
                <label>Type </label>
                <select
                    value={resource.getType() || ""} 
                    onChange={(e) => {updateResource(e)}}
                >
                    <option value="" disabled>Select Type</option>
                    {Object.keys(types).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {resource.getType().includes("Light") ? (
                <div className="field-group">
                    <label>Color </label>
                    <input
                        placeholder="#FFFFF"
                        type="color"
                        value={resource.color || ""} 
                        onChange={(e) => {
                            resource.setColor(e.target.value);
                            setcount(count + 1);
                        }}
                    />
                    <br/>
                    <label>Intensity </label>
                    <input
                        placeholder="5"
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={(e) => {
                            resource.setIntensity("Quantity", e.target.value, "relative");
                            setcount(count + 1);
                        }}
                    />
                </div>
            ) : null}

            {!resource.getType().includes("Light") ? (

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
            ) : null}
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
        </div>
    );
}

export default ContentResourceElement;