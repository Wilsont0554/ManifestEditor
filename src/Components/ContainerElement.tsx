import React from "react";
import Container from "./ManifestClasses/TypeScript/Container.ts";

function ContainerElement({ container, refresh }){

    const handleTypeChange = (e) => {
        container.setType(e.target.value);
        refresh();
    };

    const handleDurationChange = (e) => {
        container.SetDuration((number)(e.target.value));
        refresh();
    };

    return(
        <div id="containerUI">
            <label>Container: {container.getType}</label>
            
            <select name="containerType" id="containerType">
                <option value="timeline" onChange={handleTypeChange}>Time Line</option>
                <option value="scene" onChange={handleTypeChange}>Scene</option>
                <option value="canvas" onChange={handleTypeChange}>Canvas</option>
            </select>
        </div>
    );
} export default ContainerElement;