import { cameraPresets, clampNumber } from "@/utils/content-resource";
import ManifestField from "./manifest-field";
import Transform from "@/ManifestClasses/Transform";
import { Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Annotation from "@/ManifestClasses/Annotation";
import NumericDraftInput from "./numeric-draft-input";
import * as THREE from 'three';

function CameraPresets({annotation, resource, onCommit, id, manifestObj}){

    async function test(event){
        const zoomOut = [new Transform("TranslateTransform")];
        const topRight = [new Transform("TranslateTransform"), new Transform("RotateTransform")];
        zoomOut[0].setZ(5);
        zoomOut[0].setY(3);
        topRight[0].setZ(5);
        topRight[0].setY(3);
        topRight[1].setX(45);
        topRight[1].setY(45);

        
        if (event == "Top Right"){
          const allResources = manifestObj.getContainerObj().getAnnotationPage().getAllAnnotations()
          const loader = new GLTFLoader();
          const urls = ["https://raw.githubusercontent.com/IIIF/3d/main/assets/whale/whale_mandible.glb"];
          const group = new THREE.Group();
          const loadModels = async () => {
            const loadPromises = urls.map(url => {
                return new Promise((resolve, reject) => {
                    loader.load(url, (gltf) => {
                        group.add(gltf.scene); // 2. Add to group
                        resolve(gltf);
                    }, undefined, reject);
                });
            });

            await Promise.all(loadPromises);

            // 3. Update world matrices to ensure correct coordinates
            group.updateWorldMatrix(true, true);

            // 4. Get the combined bounding box
            const box = new THREE.Box3().setFromObject(group);
            
            // Usage: Get size or center
            const size = new THREE.Vector3();
            box.getSize(size);
            annotation.setZ(size.z);
            console.log('Total Size:', size);
            onCommit();
        };
        await loadModels();
      }
      console.log(annotation.getTarget().getCoordinates());
      onCommit();
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