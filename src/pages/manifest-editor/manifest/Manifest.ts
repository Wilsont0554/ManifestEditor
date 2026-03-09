import type { IiifManifest } from "../../../types/iiif";

class Manifest {
  manifest: IiifManifest;

  constructor() {
    this.manifest = {
      "@context": "http://iiif.io/api/presentation/3/context.json",
      id: "https://example.org/to13swr5ws-mlwptp83",
      type: "Manifest",
      label: {
        en: ["Blank Manifest"],
      },
      items: [],
    };
  }

  createContainer(type: string): void {
    this.manifest.items.push({
      id: "https://example.org/iiif/scene1/page/p1/1",
      type,
      items: [],
    });
  }

  createAnnotationPage(): void {
    if (this.manifest.items.length === 0) {
      this.createContainer("Scene");
    }

    this.manifest.items[0]!.items.push({
      id: "https://example.org/iiif/scene1/page/p1/1",
      type: "AnnotationPage",
      items: [],
    });
  }

  createAnnotation(id: string, type: string, format: string): void {
    if (this.manifest.items.length === 0) {
      this.createContainer("Scene");
    }

    if (this.manifest.items[0]!.items.length === 0) {
      this.createAnnotationPage();
    }

    const container = this.manifest.items[0]!;
    const annotationPage = container.items[0]!;
    const targetURL = container.id ?? "";

    annotationPage.items.push({
      id: "https://example.org/iiif/scene1/page/p1/1",
      type: "Annotation",
      motivation: ["painting"],
      body: [
        {
          id,
          type,
          format,
        },
      ],
      target: targetURL,
    });
  }
}

export default Manifest;
