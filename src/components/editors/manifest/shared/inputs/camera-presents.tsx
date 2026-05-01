import { cameraPresets, clampNumber, getResourceTypeItems } from "@/utils/content-resource";
import ManifestField from "./manifest-field";
import Transform from "@/ManifestClasses/Transform";
import { Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Annotation from "@/ManifestClasses/Annotation";
import NumericDraftInput from "./numeric-draft-input";
import * as THREE from 'three';
import { useContext } from "react";
import { manifestObjContext } from "@/context/manifest-context";
import ContentResource from "@/ManifestClasses/ContentResource";

function CameraPresets({annotation, resource, onCommit, id}){
  const { manifestObj } = useContext(manifestObjContext);

    async function test(event){
        const zoomOut = [new Transform("TranslateTransform")];
        const topRight = [new Transform("TranslateTransform"), new Transform("RotateTransform")];
        zoomOut[0].setZ(5);
        zoomOut[0].setY(3);
        topRight[0].setZ(5);
        topRight[0].setY(3);
        topRight[1].setX(45);
        topRight[1].setY(45);
        
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
            annotation.setZ(Math.max(size.y, size.y, size.x) * 2);
            annotation.setY(Math.max(size.y, size.y, size.x) / 2);

            console.log('Total Size:', size);
            onCommit();
        };
        await loadModels();
      
      console.log(annotation.getTarget().getCoordinates());
      onCommit();
    }

    return(
        <div id={id}>
            <button onClick={test}>test</button>
        </div>
    )
} export default CameraPresets