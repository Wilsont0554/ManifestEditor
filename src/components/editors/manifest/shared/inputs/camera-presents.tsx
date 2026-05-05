import { cameraPresets, getResourceTypeItems } from "@/utils/content-resource";
import ManifestField from "./manifest-field";
import Transform from "@/ManifestClasses/Transform";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { useContext, useState } from "react";
import { manifestObjContext } from "@/context/manifest-context";
import ContentResource from "@/ManifestClasses/ContentResource";

function CameraPresets({annotation, resource, onCommit, id}){
    const { manifestObj } = useContext(manifestObjContext);
    const [selectedPreset, setSelectedPreset] = useState(resource.getPreset());

    async function test(event){
        let allResources: string[] | undefined[]//manifestObj.getContainerObj().getAnnotationPage().getAllAnnotations()
        // eslint-disable-next-line prefer-const
        allResources = [];
        const loader = new GLTFLoader();

        const test = getResourceTypeItems(manifestObj, ContentResource)
        test.map((annotationTest) => {
            allResources.push(annotationTest.resource?.getID())
        })

        const urls = allResources;
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
            resource.clearTransforms();
            annotation.setX(0)
            annotation.setY(0);
            annotation.setZ(0);

            if (event == "Front Facing"){
                annotation.setY(Math.max(size.y, size.z, size.x) / 2);
                annotation.setZ(Math.max(size.y, size.z, size.x) * 2);
                
            }
            else if (event == "Back Facing"){
                annotation.setY(Math.max(size.y, size.z, size.x) / 2);
                annotation.setZ(Math.max(size.y, size.z, size.x) * 2);
                const rotateYZ = new Transform;
                rotateYZ.setType("RotateTransform")
                rotateYZ.setY(180);
                rotateYZ.setZ(180);
                const allTransforms = [rotateYZ];
                resource.setTransforms(allTransforms);
            }
            else if (event == "Right Facing"){
                annotation.setY(Math.max(size.y, size.z, size.x) / 2);
                annotation.setX(Math.max(size.y, size.z, size.x) * 2);
                const rotateYZ = new Transform;
                rotateYZ.setType("RotateTransform")
                rotateYZ.setY(90);
                const allTransforms = [rotateYZ];
                resource.setTransforms(allTransforms);
            }
            else if (event == "Left Facing"){
                annotation.setY(Math.max(size.y, size.z, size.x) / 2);
                annotation.setX(Math.max(size.y, size.z, size.x) * -2);
                const rotateYZ = new Transform;
                rotateYZ.setType("RotateTransform")
                rotateYZ.setY(-90);
                const allTransforms = [rotateYZ];
                resource.setTransforms(allTransforms);
            }
            else if (event == "Top Left"){
                const translateY = new Transform;
                translateY.setType("TranslateTransform")
                translateY.setY(Math.max(size.y, size.z, size.x) / 2);
                translateY.setZ(Math.max(size.y, size.z, size.x) * 2);
                const rotateY = new Transform;
                rotateY.setY(-40);
                const rotateXZ = new Transform;
                rotateXZ.setX(Math.max(size.y) * -4);
                rotateXZ.setZ(Math.max(size.y) * -4);

                const allTransforms = [translateY, rotateY, rotateXZ]
                resource.setTransforms(allTransforms);
            }
            else if (event == "Top Right"){
                const translateY = new Transform;
                translateY.setType("TranslateTransform")
                translateY.setY(Math.max(size.y, size.z, size.x) / 2);
                translateY.setZ(Math.max(size.y, size.z, size.x) * 2);
                const rotateY = new Transform;
                rotateY.setY(40);
                const rotateXZ = new Transform;
                rotateXZ.setX(Math.max(size.y) * -4);
                rotateXZ.setZ(Math.max(size.y) * 4);

                const allTransforms = [translateY, rotateY, rotateXZ]
                resource.setTransforms(allTransforms);
            }
            
            console.log('Total Size:', size);
            onCommit();
        };
        await loadModels();
      
      console.log(annotation.getTarget().getCoordinates());
      onCommit();
    }

    return(
        <div id={id}>
            <ManifestField
                label="Camera Presets"
                htmlFor={``}
                className="space-y-2"
              >
                <select
                    id={``}
                    value={selectedPreset}
                    className="w-full border border-slate-400 bg-white px-3 py-2 text-base text-slate-900 focus:border-pink-500 focus:outline-none"
                    onChange={(event) => {
                        setSelectedPreset(event.target.value)
                        resource.setPreset(event.target.value)
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