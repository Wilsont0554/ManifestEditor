import React, { useState } from "react";
import Camera from "../ManifestClasses/TypeScript/SceneComponets/Camera.ts";
import OrthographicCamera from "../ManifestClasses/TypeScript/SceneComponets/OrthographicCamera.ts";

function CameraElement(props: any){
    const { camera, setcount, count } = props;

    const [type, setType] = useState("DEFAULT CAMERA");

    
    function handleCameraChange(e: any){
        if(e = "OrthographicCamera"){
            var orthoCamera = new OrthographicCamera(0.0 , "", "OrthographicCamera", 0.0, 0.0);
            // if(!perspectiveCamera) delete perspectiveCamera;
        }
    }

    if(!camera) return <p>No Camera Found</p>;

    const isOrthoGraphic = camera instanceof OrthographicCamera;
    // const isPerspective = camera instanceof PerspectiveCamera;


    if(!isOrthoGraphic /** && !isPerspective */) return <p>Camera is default Camera</p>

    var cameraTypes;
    
    if(camera.getType().includes("Ortho")){
        cameraTypes = "OrthographicCamera";;
    }
    else{
        cameraTypes = "PerspectiveCamera";
    }
    

    return (
        <div className="sidebar-editor-container">
            <div className="field-group">
                <label>Type</label>
                <select
                    value={camera.getType() || ""}
                    onChange={(e) => {handleCameraChange(e)}}>
                        <option value={"OrthographicCamera"}>OrthographicCamera</option>
                        <option value={"PerspectiveCamera"}>PerspectiveCamera</option>
                </select>
            </div>
        </div>
    );
} 