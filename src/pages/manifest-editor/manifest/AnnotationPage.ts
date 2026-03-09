import type { IiifAnnotationPage } from "../../../types/iiif";
import Annotation from "./Annotation";

class AnnotationPage {
  id: string;
  type: string;
  items: Annotation[];

  constructor() {
    this.id = "https://example.org/iiif/scene1/page/p1/1";
    this.type = "AnnotationPage";
    this.items = [];
    this.addAnnotation(new Annotation());
  }

  addAnnotation(annotation: Annotation): void {
    this.items.push(annotation);
  }

  getAnnotation(index = 0): Annotation {
    return this.items[index]!;
  }

  getAllAnnotations(): Annotation[] {
    return this.items;
  }

  toJSON(): IiifAnnotationPage {
    return {
      id: this.id,
      type: this.type,
      items: this.items.map((annotation) => annotation.toJSON()),
    };
  }
}

export default AnnotationPage;
