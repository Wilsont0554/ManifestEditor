import { cameraPresets, clampNumber } from "@/utils/content-resource";
import ManifestField from "./manifest-field";
import Transform from "@/ManifestClasses/Transform";
import { Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Annotation from "@/ManifestClasses/Annotation";
import NumericDraftInput from "./numeric-draft-input";


    const DEFAULT_LIGHT_INTENSITY = 0.50;
    const LIGHT_INTENSITY_MIN = 0.00;
    const LIGHT_INTENSITY_MAX = 1.00;
    const LIGHT_INTENSITY_STEP = 0.01;

function LightIntensityInput({
  idPrefix,
  value,
  onCommit,
}) {
  const sliderValue = clampNumber(
    value ?? DEFAULT_LIGHT_INTENSITY,
    LIGHT_INTENSITY_MIN,
    LIGHT_INTENSITY_MAX,
  );
  const sliderPercentage = Math.round(sliderValue * 100);


  return (
    <section className="space-y-3">
      <ManifestField
        label="Intensity"
        htmlFor={`${idPrefix}-slider`}
        className="space-y-3"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              id={`${idPrefix}-slider`}
              type="range"
              min={LIGHT_INTENSITY_MIN}
              max={LIGHT_INTENSITY_MAX}
              step={LIGHT_INTENSITY_STEP}
              value={sliderValue}
              className="h-2 w-full cursor-pointer accent-pink-500"
              onChange={(event) => {
                const nextValue = Number(event.target.value);
                onCommit(nextValue);
              }}
            />
            <span className="min-w-12 text-right text-sm font-semibold text-slate-700">
              {sliderPercentage}%
            </span>
          </div>

        </div>
      </ManifestField>

      <NumericDraftInput
        id={`${idPrefix}-value`}
        label="Exact intensity"
        value={value?.toString() ?? ""}
        min={LIGHT_INTENSITY_MIN}
        max={LIGHT_INTENSITY_MAX}
        step={LIGHT_INTENSITY_STEP}
        placeholder={DEFAULT_LIGHT_INTENSITY.toString()}
        allowBlank
        clampDraftToRange
        onCommit={onCommit}
      />
    </section>
  );
}

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
            let maxScale = [0,0,0];
            const loader = new GLTFLoader();

            await allResources.map((currentAnnotation, index) => {
                const url = currentAnnotation.getContentResource().getID();
                if(url){
                    console.log(url);
                    loader.load(currentAnnotation.getContentResource().getID(), (gltf) => {
                    const object = gltf.scene;
                    
                    // Create a bounding box for the object
                    const box = new Box3().setFromObject(object);
                    
                    // Get the size of the box
                    const size = new Vector3();
                    box.getSize(size);
                    
                    console.log(`Content resource ${index}: (${size.x}, ${size.y}, ${size.z})`);
                    maxScale[0] = Math.max(maxScale[0], size.x);
                    maxScale[1] = Math.max(maxScale[1], size.y);
                    maxScale[2] = Math.max(maxScale[2], size.z);
                });
                }
            })

            console.log("test")
            console.log(maxScale[1])
            console.log(maxScale[2])
            annotation.getTarget().setZ(Math.max(maxScale[0], maxScale[1]));
            annotation.getTarget().setY(maxScale[1] / 2);
            onCommit();
        }
        
    }


    return(
        <div id={id}>
            <LightIntensityInput
                idPrefix={`${id}-intensity`}
                value={annotation.getTarget().getZ()}
                onCommit={(newValue) => {
                if (newValue === undefined) {
                    console.log('test')
                } else {
                    annotation.getTarget().setZ(newValue);
                    console.log(annotation.getTarget().getZ())
                }

                onCommit();
                }}
            />
        </div>
    )
} export default CameraPresets