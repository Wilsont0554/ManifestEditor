import ManifestObject from "@/ManifestClasses/ManifestObject";
import Annotation from "@/ManifestClasses/Annotation";
import ContentResource from "@/ManifestClasses/ContentResource";
import Light from "@/ManifestClasses/Light";
import Camera from "@/ManifestClasses/Camera";
import TextAnnotation from "@/ManifestClasses/TextAnnotation";

export function downloadJsonFile(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function createManifestObjectFromUpload(uploadedManifest: ManifestObject): ManifestObject{
  const newManifest = new ManifestObject(uploadedManifest.type);
  newManifest.setAllValues(uploadedManifest);

  //for each annotation
  for (let i = 0; i < uploadedManifest.items[0].items[0].items.length; i++){
    try {
      const nextAnnotationIndex = newManifest.getContainerObj().getAnnotationPage().getAllAnnotations().length;
      let tempContentResource;
      
      const uploadedResource = uploadedManifest.items[0].items[0].items[i].body;

      if (uploadedResource!.type == "Model"){
        tempContentResource = new ContentResource("", "", "");
        tempContentResource!.setAllValues(uploadedResource!);
      }
      else if(uploadedResource!.type.includes("Light")){
          tempContentResource = new Light("", "");
          tempContentResource!.setAllLightValues(uploadedResource! as Light)
      }
      else if (uploadedResource!.type.includes("Camera")){
          tempContentResource = new Camera("");
          tempContentResource!.setAllCameraValues(uploadedResource! as Camera)
      }
      else if (uploadedResource!.type == "TextualBody"){
        tempContentResource = new TextAnnotation;
        tempContentResource!.setAllTextAnnotationValues(uploadedResource! as TextAnnotation);
      }
      else{
        console.log('test');
      }

      const tempAnnotation = new Annotation(nextAnnotationIndex + 1);
      tempAnnotation.setContentResource(tempContentResource!);

      newManifest.getContainerObj().getAnnotationPage().addAnnotation(tempAnnotation);
      newManifest.getContainerObj().getAnnotationPage().getAnnotation(i).setAllValues(uploadedManifest.items[0].items[0].items[i])
    } catch{
      return new ManifestObject("");
    }
  }

  return newManifest;
}