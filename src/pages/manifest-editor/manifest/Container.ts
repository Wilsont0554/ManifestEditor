import type { IiifCanvasLike } from "../../../types/iiif";
import AnnotationPage from "./AnnotationPage";

class Container {
  type: string;
  items: AnnotationPage[];

  constructor(type: string) {
    this.type = type;
    this.items = [];
    this.addAnnotationPage(new AnnotationPage());
  }

  addAnnotationPage(annotationPage: AnnotationPage): void {
    this.items.push(annotationPage);
  }

  getAnnotationPage(index = 0): AnnotationPage {
    return this.items[index]!;
  }

  setType(type: string): void {
    this.type = type;
  }

  getType(): string {
    return this.type;
  }

  toJSON(): IiifCanvasLike {
    return {
      type: this.type,
      items: this.items.map((annotationPage) => annotationPage.toJSON()),
    };
  }
}

export default Container;
