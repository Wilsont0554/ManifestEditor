import React from "react";
import Container from "./ManifestClasses/TypeScript/Container.ts";

function ContainerElement(props){

    const [type, setType] = useState("");
    const { container, setcount, count } = props;

    const containerObj = container

    return(
    <>
        <div className="sidebar-editor-container">
            <div className="field-group">
                <label>Type</label>
                <select
                    value={containerObj.getType() || ""}
                    onChange={(e) => {
                        containerObj.setType(e.target.value);
                        setcount(count + 1);
                    }}
                >
                    <option value="scene">Scene</option>
                    <option value="timeline">Time Line</option>
                    <option value="canvas">Canvas</option>
                </select>
            </div>

            <div className="field-group">
                <label></label>
            </div>
        </div>
        
    </>);

} export default ContainerElement;
