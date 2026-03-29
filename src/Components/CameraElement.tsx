import React, { useState } from "react";
import LabelElement from "./LabelElement.jsx";
import OrthographicCamera from "../ManifestClasses/TypeScript/SceneComponets/OrthographicCamera.ts";
import PerspectiveCamera from "../ManifestClasses/TypeScript/SceneComponets/PerspectiveCamera.ts";



function CameraElement(props: any){
    const { camera, setcount, count, currentObject } = props;

    // Creates new camera object when called
    // updates the items array in container with the new object
    // this is used when the drop down changes options in the UI  
    function handleCameraChange(e: string){
        const newType = e;

        let newCamera;

        if(newType === "OrthographicCamera") {
            newCamera = new OrthographicCamera(
                0.0,
                camera.getID() || undefined,
                camera.getNear(),
                camera.getFar(),
                camera.getLabel()
            );
        }

        if(newType === "PerspectiveCamera") {
            newCamera = new PerspectiveCamera(
                0.0,
                camera.getID() || undefined,
                camera.getNear(),
                camera.getFar(),
                camera.getLabel()
            );
        }
        currentObject.setContentResource(newCamera);
        setcount((value:number) => count + 1);
    }

    if(!camera) return <p>No Camera Found</p>;

    return (
        <div className="sidebar-editor-container">
        {/* Drop down menu to choose camera type */}  
            <div className="field-group">
                <label>Type</label>
                <select
                    value={camera.getType() || ""}
                    onChange={(e) => {
                        handleCameraChange(e.target.value);
                        setcount(count + 1);
                    }}>
                        <option value={"OrthographicCamera"}>OrthographicCamera</option>
                        <option value={"PerspectiveCamera"}>PerspectiveCamera</option>
                </select>
            </div>

        {/*Shared componets of camera UI */}
            <div className="field-group">

                {/* The far and near values should be bounded by
                    the scene dimesions evenutally */}

                <br></br>
                <label>Near</label>
                <input
                    placeholder="0.0"
                    type="number"
                    min={0}
                    step={1}
                    value={camera.getNear() || ""}
                    onChange={(e) => {
                        camera.setNear(Number(e.target.value));
                        setcount(count + 1);
                    }}
                />
                <br></br>
                <label>Far</label>
                <input
                    placeholder={camera.getNear()}
                    type="number"
                    min={camera.getNear() + 1}
                    step={1}
                    value={camera.getFar() || ""}
                    onChange={(e) => {
                        camera.setFar(Number(e.target.value));
                        setcount(count + 1);
                    }}
                />
            </div>
        {camera.getType() == "OrthographicCamera" ? (
            <div>
                <label>View Height</label>
                <input
                    placeholder={camera.getViewHeight()}
                    type="number"
                    min={0.0}
                    step={.1}
                    value={camera.getViewHeight() || ""}
                    onChange={(e) => {
                        camera.setViewHeight(Number(e.target.value));
                        setcount(count + 1);
                    }}
                />
            </div>
            ) : (
                <div>
                    <label>Field of View</label>
                    <input
                        placeholder={camera.getFieldOfView()}
                        type="number"
                        min={camera.getNear()}
                        max={camera.getFar() || undefined}
                        step={1}
                        value={camera.getFieldOfView() || ""}
                        onChange={(e) => {
                            camera.setFieldOfView(Number(e.target.value));
                            setcount(count + 1);
                        }}
                    />
                </div>
            )}

            <div>
                <h4>Position</h4>
                <div className="field-group">
                    <label>X</label>
                    <input
                        placeholder="0"
                        type="number"
                        value={currentObject.getTarget().getX()} 
                        onChange={(e) => {
                            currentObject.setX(Number(e.target.value));
                            setcount(count + 1);
                        }}
                    />
                </div>
                <div className="field-group">
                    <label>Y</label>
                    <input
                        placeholder="0"
                        type="number"
                        value={currentObject.getTarget().getY()} 
                        onChange={(e) => {
                            currentObject.setY(Number(e.target.value));
                            setcount(count + 1);
                        }}
                    />
                </div>
                <div className="field-group">
                    <label>Z</label>
                    <input
                        placeholder="0"
                        type="number"
                        value={currentObject.getTarget().getZ()} 
                        onChange={(e) => {
                            currentObject.setZ(Number(e.target.value));
                            setcount(count + 1);
                        }}
                    />
                </div>
            </div>

            <div>
                <h3>Camera Label</h3>
                <LabelElement
                    {...props}
                    currentObject={camera}
                />
            </div>
    </div>     

    );
} export default CameraElement