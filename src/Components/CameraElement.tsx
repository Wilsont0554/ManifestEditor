import React, { useState } from "react";
import Camera from "../ManifestClasses/TypeScript/SceneComponets/Camera.ts";
import OrthographicCamera from "../ManifestClasses/TypeScript/SceneComponets/OrthographicCamera.ts";

function CameraElement(props: any){
    const { camera, setcount, count } = props;
    const [type, setType] = useState("OrthographicCamera");

    // here we get the container items index for an object with a camera type
    // var containerItems = container.getItems();
    // var cameraIndex: number;
    // for(let i = 0; i < containerItems.length(); i++){
    //     if(containerItems[i] instanceof Camera){ cameraIndex = i; break; }
    // }

    // Creates new camera object when called
    // updates the items array in container with the new object
    // this is used when the drop down changes options in the UI  
    function handleCameraChange(e: any){
        const newType = e.target.value;

        let newCamera;

        if(newType === "OrthographicCamera") {
            newCamera = new OrthographicCamera(
                0.0,
                camera.getID() || undefined,
                "OrthographicCamera",
                camera.getNear() || undefined,
                camera.getFar() || undefined,
                camera.getLabel() || undefined
            );
        }

        if(newType === "PerspectiveCamera") {
            // newCamera = new PerspectiveCamera();
        }

        setcount(count + 1);
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
                        handleCameraChange(e);
                        setcount(count + 1);
                    }}>
                        <option value={"OrthographicCamera"}>OrthographicCamera</option>
                        <option value={"PerspectiveCamera"}>PerspectiveCamera</option>
                </select>
            </div>

        {/*Shared componets of camera UI */}
            <div className="field-group">
                <label>ID</label>
                <input
                    placeholder="https://..."
                    type="text"
                    value={camera.getID() || ""} 
                        onChange={(e) => {
                            camera.setID(e.target.value);
                            setcount(count + 1);
                        }}
                />
                <br></br>
                <label>Near</label>
                <input
                    placeholder="0.0"
                    type="text"
                    value={camera.getNear() || ""}
                        onChange={(e) => {
                            camera.setNear(e.target.value);
                            setcount(count + 1);
                        }}
                />
                

            </div>
        

        {/* Ternary operator to choose whats displayed based on camera type */}
            

        </div>
    );
} export default CameraElement