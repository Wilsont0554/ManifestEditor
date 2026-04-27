import { cameraPresets } from "@/utils/content-resource";
import ManifestField from "./manifest-field";
import Transform from "@/ManifestClasses/Transform";

function CameraPresets({annotation, resource, onCommit, id}){

    function test(event){
        const zoomOut = [new Transform("TranslateTransform")];
        const topRight = [new Transform("TranslateTransform"), new Transform("RotateTransform")];
        zoomOut[0].setZ(5);
        zoomOut[0].setY(3);
        topRight[0].setZ(5);
        topRight[0].setY(3);
        topRight[1].setX(45);
        topRight[1].setY(45);

        if (event == "Top Right"){
            annotation.getTarget().setZ(0.5);
            annotation.getTarget().setY(0.2);
            console.log(annotation);
            onCommit();
        }
    }

    return(
        <div id={id}>
           <ManifestField
                label="Transform Type"
                htmlFor={``}
                className="space-y-2"
              >
                <select
                    id={``}
                    value={``}
                    className="w-full border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 focus:border-pink-500 focus:outline-none"
                    onChange={(event) => {
                        console.log(event.target.value)
                        test(event.target.value);
                    }}
                >
                  {cameraPresets.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </ManifestField>
        </div>
    )
} export default CameraPresets