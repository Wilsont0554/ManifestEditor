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

export function createManifestObjectFromUpload(manifest: ManifestObject): ManifestObject{
  //const newManifest = new ManifestObject (manifest.type);
  const newManifest = Object.assign(new ManifestObject(manifest.type), manifest);
  const testManifest = new ManifestObject(newManifest.type);

  for (let i = 0; i < newManifest.items[0].items[0].items.length; i++){
    //console.log(newManifest.items[0].items[0].items[i]);
    const nextAnnotationIndex = testManifest.getContainerObj().getAnnotationPage().getAllAnnotations().length;
    
    console.log(newManifest.items[0].items[0].items[i].body!);

    const temp = new ContentResource("", "", "");
    temp.setAllValues(newManifest.items[0].items[0].items[i].body!)
  
    const tempAnnotation = new Annotation(nextAnnotationIndex + 1);
    tempAnnotation.setContentResource(temp)
    testManifest.getContainerObj().getAnnotationPage().addAnnotation(tempAnnotation);
  }

  return testManifest;
}