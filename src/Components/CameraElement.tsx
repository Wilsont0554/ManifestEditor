import React, { useState } from "react";
import Camera from "../ManifestClasses/TypeScript/SceneComponets/Camera.ts";
import OrthographicCamera from "../ManifestClasses/TypeScript/SceneComponets/OrthographicCamera.ts";

function CameraElement(props: any){
    const { camera, setcount, count } = props;
    const [type, setType] = useState("DEFAULT CAMERA");

    var cameraTypes; // used just for logic should always be <cameraType>.getType();
    
    function handleCameraChange(e: any){
        setCameraType();
        if(e = "OrthographicCamera"){
            var orthoCamera = new OrthographicCamera(0.0 , "", "OrthographicCamera", 0.0, 0.0);
            // if(!perspectiveCamera) delete perspectiveCamera;
        }
    }

    function setCameraType(){
        if(camera.getType().includes("Ortho")){
            cameraTypes = "OrthographicCamera";;
        }
        else if(camera.getType().includes("Persp")){
            cameraTypes = "PerspectiveCamera";
        }
        else{
            cameraTypes = "Default Camera";
        }
    }

    if(!camera) return <p>No Camera Found</p>;

    const isOrthoGraphic = camera instanceof OrthographicCamera;
    // const isPerspective = camera instanceof PerspectiveCamera;


    if(!isOrthoGraphic /** && !isPerspective */) return <p>Camera is default Camera</p>
    
    

    return (
        <div className="sidebar-editor-container">
        {/* Drop down menu to choose camera type */}  
            <div className="field-group">
                <label>Type</label>
                <select
                    value={camera.getType() || ""}
                    onChange={(e) => {
                        handleCameraChange(e);
                        setcount(count + 1);
                    }}>
                        <option value={"OrthographicCamera"}>OrthographicCamera</option>
                        <option value={"PerspectiveCamera"}>PerspectiveCamera</option>
                </select>
            </div>

        {/* Shared componets of camera UI */}
            <div className="field-group">
                <label>ID</label>
                <input
                    placeholder="https://..."
                    type="text"
                    value={camera}
                <label></label>

            </div>
        

        {/* Ternary operator to choose whats displayed based on camera type */}
            

        </div>
    );
} 