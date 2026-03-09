import type { IiifAnnotation } from "../../../types/iiif";
import ContentResource from "./ContentResource";
import Label from "./Label";

class Annotation {
  id: string;
  type: string;
  motivation: string[];
  body: ContentResource[];
  target: string;
  label!: Label;

  constructor() {
    this.id = "https://example.org/iiif/3d/anno1";
    this.type = "Annotation";
    this.motivation = ["painting"];
    this.body = [];
    this.target = "https://example.org/iiif/scene1/page/p1/1";
    this.createLabel("en");
  }

  addContentResource(contentResource: ContentResource): void {
    this.body.push(contentResource);
  }

  getContentResource(index = 0): ContentResource {
    return this.body[index]!;
  }

  setLabel(_index: number, value: string): void {
    this.label.changeLabelTest(value);
  }

  createLabel(languageCode = "en"): void {
    this.label = new Label("", languageCode);
  }

  changeLabel(_index: number | undefined, value: string, languageCode?: string): void {
    this.label.changeLabelTest(value);

    if (languageCode) {
      this.label.setLanguage(languageCode);
    }
  }

  getLabel(): Label {
    return this.label;
  }

  getAllContentResource(): ContentResource[] {
    return this.body;
  }

  changeID(value: string): void {
    this.id = value;
  }

  getID(): string {
    return this.id;
  }

  createLabelTest(): void {
    this.label = new Label();
  }

  getAllLabels(): Label {
    return this.label;
  }

  toJSON(): IiifAnnotation {
    return {
      id: this.id,
      type: this.type,
      motivation: [...this.motivation],
      body: this.body.map((contentResource) => contentResource.toJSON()),
      target: this.target,
      label: this.label.toJSON(),
    };
  }
}

export default Annotation;
