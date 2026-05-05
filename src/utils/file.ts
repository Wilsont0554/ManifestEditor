import ManifestObject from "@/ManifestClasses/ManifestObject";
import Annotation from "@/ManifestClasses/Annotation";
import ContentResource from "@/ManifestClasses/ContentResource";
import Light from "@/ManifestClasses/Light";
import Camera from "@/ManifestClasses/Camera";
import TextAnnotation from "@/ManifestClasses/TextAnnotation";
import type { IiifContainerType } from "@/types/iiif";

type SerializedManifestBody = {
  id?: string;
  type?: string;
  transforms?: unknown[];
  source?: SerializedManifestBody[];
  transform?: unknown[];
};

type SerializedManifestAnnotation = {
  body?: SerializedManifestBody;
};

type SerializedManifestPage = {
  items?: SerializedManifestAnnotation[];
};

type SerializedManifestContainer = {
  items?: SerializedManifestPage[];
};

type SerializedManifest = {
  items?: SerializedManifestContainer[];
};

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

export function serializeManifestForExport(manifestObj: ManifestObject): object {
  const exported = JSON.parse(
    JSON.stringify(manifestObj),
  ) as SerializedManifest;

  for (const container of exported.items ?? []) {
    for (const page of container.items ?? []) {
      for (const annotation of page.items ?? []) {
        const body = annotation.body;

        
        if (!body || body.type == "TextualBody") {
          continue;
        }
        
        /*
        if (!body || body.type !== "Model") {
          continue;
        }*/

        const { transforms, ...source } = body;

        annotation.body = {
          type: "SpecificResource",
          source: [source],
          ...(Array.isArray(transforms) && transforms.length > 0
            ? { transform: transforms }
            : {}),
        };
      }
    }
  }

  return exported;
}

function hasNonEmptyId(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function isVoyagerRenderableManifest(serializedManifest: object): boolean {
  const manifest = serializedManifest as SerializedManifest & {
    items?: Array<{
      items?: Array<{
        items?: Array<{
          body?: {
            id?: unknown;
            type?: unknown;
            source?: Array<{ id?: unknown }>;
          };
        }>;
      }>;
    }>;
  };

  for (const container of manifest.items ?? []) {
    for (const page of container.items ?? []) {
      for (const annotation of page.items ?? []) {
        const body = annotation.body;

        if (!body || typeof body.type !== "string") {
          continue;
        }

        if (body.type === "Image" || body.type === "Model") {
          if (!hasNonEmptyId(body.id)) {
            return false;
          }

          continue;
        }

        if (body.type === "SpecificResource") {
          if (!Array.isArray(body.source) || body.source.length === 0) {
            return false;
          }

          if (!body.source.every((source) => hasNonEmptyId(source?.id))) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

export function createManifestObjectFromUpload(uploadedManifest: any): ManifestObject{
  const newManifest = new ManifestObject(uploadedManifest.type);
  newManifest.setAllValues(uploadedManifest);

  let endIndex = 0;

  //for each annotation
  for (let i = 0; i < uploadedManifest.items[0].items[0].items.length; i++){
    try {
      const nextAnnotationIndex = newManifest.getContainerObj().getAnnotationPage().getAllAnnotations().length;
      
      const uploadedResource = uploadedManifest.items[0].items[0].items[i].body;
      
      if (uploadedResource){
        let tempContentResource;
        let specificResourceType = "none";
        
        if (uploadedResource.type == "SpecificResource"){
          specificResourceType = uploadedResource.source[0].type;
        }

        if (uploadedResource!.type == "Model" || specificResourceType == "Model"){
          tempContentResource = new ContentResource("", "", "");
          tempContentResource!.setAllValues(uploadedResource!);
        }
        else if(uploadedResource!.type.includes("Light") || specificResourceType.includes("Light")){
            tempContentResource = new Light("", "");
            tempContentResource!.setAllLightValues(uploadedResource! as Light)
        }
        else if (uploadedResource!.type.includes("Camera") || specificResourceType.includes("Camera")){
            tempContentResource = new Camera("");
            tempContentResource!.setAllCameraValues(uploadedResource! as Camera)
        }
        else if (uploadedResource!.type == "TextualBody" || specificResourceType == "TextualBody"){
          tempContentResource = new TextAnnotation;
          tempContentResource!.setAllTextAnnotationValues(uploadedResource! as TextAnnotation);
        }
        else{
          console.log(uploadedResource);
          console.log('Format not recognized');
        }

        const tempAnnotation = new Annotation(nextAnnotationIndex + 1);
        tempAnnotation.setContentResource(tempContentResource!);

        newManifest.getContainerObj().getAnnotationPage().addAnnotation(tempAnnotation);
        newManifest.getContainerObj().getAnnotationPage().getAnnotation(i).setAllValues(uploadedManifest.items[0].items[0].items[i]);
        endIndex++;
      }
      else if (uploadedManifest.items[0].items[0].items[i].bodyValue){
        try {
          const test = uploadedManifest.items[0].items[0].items[i];
          let tempContentResource;
          tempContentResource = new TextAnnotation;
          tempContentResource!.setAllTextAnnotationValuesTest(test! as TextAnnotation);
          const tempAnnotation = new Annotation(nextAnnotationIndex + 1);
          tempAnnotation.setContentResource(tempContentResource!);
          
          newManifest.getContainerObj().getAnnotationPage().addAnnotation(tempAnnotation);
        }
        catch(e){
          console.log(e);
        }
        endIndex++;
      }
    } catch(e){
      alert(e);
      return new ManifestObject("");
    }
  }

  //text annotation compatibility
  if (uploadedManifest.items[0].annotations){
    for (let i = 0; i < uploadedManifest.items[0].annotations[0].items.length; ++i){
      try {
        const nextAnnotationIndex = newManifest.getContainerObj().getAnnotationPage().getAllAnnotations().length;
        const uploadedResource = uploadedManifest.items[0].annotations[0].items[i];
        console.log(uploadedResource)

        const tempContentResource = new TextAnnotation;
        tempContentResource!.setAllTextAnnotationValuesTest(uploadedResource! as TextAnnotation);

        const tempAnnotation = new Annotation(nextAnnotationIndex + 1);
        tempAnnotation.setContentResource(tempContentResource!);

        newManifest.getContainerObj().getAnnotationPage().addAnnotation(tempAnnotation);
        newManifest.getContainerObj().getAnnotationPage().getAnnotation(endIndex).setAllValues(uploadedManifest.items[0].items[0].items[i])
      } catch(e){
        alert(e);
        return new ManifestObject("");
      }
    }
  }

  return newManifest;
}
