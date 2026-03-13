import React from "react";
import LabelElement from "./LabelElement.jsx";

function ContentResourceElement(props) {
    const { manifestObj, contentResourceIndex, setcount, count } = props;

    var types;
    var coords = {x: 0, y: 0, z: 0};

    // Grab the specific resource from the class instance
    const resource = manifestObj
        .getContainerObj()
        .getAnnotationPage()
        .getAnnotation(contentResourceIndex)
        .getContentResource();

    const annotation = manifestObj
        .getContainerObj()
        .getAnnotationPage()
        .getAnnotation(contentResourceIndex);

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
                        placeholder="0.5"
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        onChange={(e) => {
                            resource.setIntensity("Quantity", Number(e.target.value), "relative");
                            setcount(count + 1);
                        }}
                    />

                    {resource.getType() == ("DirectionalLight") ? (
                        <div>
                            <br/>
                            <label>LookAt </label>
                            <input
                                placeholder="https://..."
                                type="text"
                                onChange={(e) => {
                                    resource.setLookAt(e.target.value);
                                    setcount(count + 1);
                                }}
                            />
                        </div>
                    ) : null}

                    {resource.getType() == ("SpotLight") ? (
                        <div>
                            <br/>
                            <label>Angle </label>
                            <input
                                placeholder="5"
                                type="number"
                                min={0}
                                max={360}
                                step={10}
                                onChange={(e) => {
                                    resource.setAngle(Number(e.target.value));
                                    setcount(count + 1);
                                }}
                            />
                        </div>
                    ) : null}

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

            <div>
                <h4>Position</h4>
                <div className="field-group">
                    <label>X</label>
                    <input
                        placeholder="0"
                        type="number"
                        value={annotation.getTarget().getSelector().x} 
                        onChange={(e) => {
                            coords.x = Number(e.target.value);
                            annotation.setX(Number(e.target.value));
                            setcount(count + 1);
                        }}
                    />
                </div>
                <div className="field-group">
                    <label>Y</label>
                    <input
                        placeholder="0"
                        type="number"
                        value={annotation.getTarget().getSelector().y} 
                        onChange={(e) => {
                            coords.y = Number(e.target.value);
                            annotation.setY(Number(e.target.value));
                            setcount(count + 1);
                        }}
                    />
                </div>
                <div className="field-group">
                    <label>Z</label>
                    <input
                        placeholder="0"
                        type="number"
                        value={annotation.getTarget().getSelector().z} 
                        onChange={(e) => {
                            coords.z = Number(e.target.value);
                            annotation.setZ(Number(e.target.value));
                            setcount(count + 1);
                        }}
                    />
                </div>
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