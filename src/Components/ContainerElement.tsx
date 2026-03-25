import React from "react";
import Container from "./ManifestClasses/TypeScript/Container.ts";

function ContainerElement({ container, refresh }){

    const handleTypeChange = (e) => {
        container.setType(e.target.value);
        if(container.getType() === 'timeline'){
            container.SetDuration(0.0);
            container.deleteDimensions();
        }
        else if(container.getType() === 'scene'){
            container.deleteDimensions();
            container.deleteDuration();
        }
        else if(container.getType() === 'canvas'){
            container.setDimensions(0.0, 0.0);
            container.deleteDuration();
        }
        refresh();
    };

    const handleDurationChange = (e) => {
        container.SetDuration((number)(e.target.value));
        refresh();
    };

    return(
        <div id="containerUI">
            <label>Container: {container.getType}</label>
            
            <select name="containerType" id="containerType" >
                <option value="timeline" onChange={handleTypeChange}>Time Line</option>
                <option value="scene" onChange={handleTypeChange}>Scene</option>
                <option value="canvas" onChange={handleTypeChange}>Canvas</option>
            </select>

        </div>


    );
} export default ContainerElement;