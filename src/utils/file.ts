import ManifestObject from "@/ManifestClasses/ManifestObject";
import Annotation from "@/ManifestClasses/Annotation";
import ContentResource from "@/ManifestClasses/ContentResource";

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
      const tempContentResource = new ContentResource("", "", "");
      const tempAnnotation = new Annotation(nextAnnotationIndex + 1);

      tempContentResource.setAllValues(uploadedManifest.items[0].items[0].items[i].body!);
      tempAnnotation.setContentResource(tempContentResource);

      newManifest.getContainerObj().getAnnotationPage().addAnnotation(tempAnnotation);
      newManifest.getContainerObj().getAnnotationPage().getAnnotation(i).setAllValues(uploadedManifest.items[0].items[0].items[i])
    } catch{
      return new ManifestObject("");
    }
  }

  return newManifest;
}