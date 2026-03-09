import type { IiifContentResource, IiifLanguageMap } from "../../types/iiif";
import Label from "./Label";

class ContentResource {
  id: string;
  type: string;
  format: string;
  label!: Label;
  height?: number;
  width?: number;
  duration?: number;
  summary?: IiifLanguageMap;

  constructor(id: string, type: string, format: string) {
    this.id = id;
    this.type = type;
    this.format = format;
    this.createLabel("en");
  }

  setID(value: string): void {
    this.id = value;
  }

  setType(type: string): void {
    this.type = type;
  }

  setFormat(format: string): void {
    this.format = format;
  }

  setDimensions(height: number, width: number): void {
    this.height = height;
    this.width = width;
  }

  setLabel(_index: number, value: string): void {
    this.label.changeLabelTest(value);
  }

  createLabel(languageCode = "en"): void {
    this.label = new Label("", languageCode);
  }

  setDuration(duration: number): void {
    this.duration = duration;
  }

  setSummary(summary: IiifLanguageMap): void {
    this.summary = summary;
  }

  getDimensions(): [number | undefined, number | undefined] {
    return [this.height, this.width];
  }

  changeLabel(_index: number | undefined, value: string, languageCode?: string): void {
    this.label.changeLabelTest(value);

    if (languageCode) {
      this.label.setLanguage(languageCode);
    }
  }

  getLabel(_index = 0): Label {
    return this.label;
  }

  getAllLabels(): Label {
    return this.label;
  }

  getType(): string {
    return this.type;
  }

  getFormat(): string {
    return this.format;
  }

  getDuration(): number | undefined {
    return this.duration;
  }

  getSummary(): IiifLanguageMap | undefined {
    return this.summary;
  }

  toJSON(): IiifContentResource {
    const contentResource: IiifContentResource = {
      id: this.id,
      type: this.type,
      format: this.format,
      label: this.label.toJSON(),
    };

    if (this.height !== undefined) {
      contentResource.height = this.height;
    }

    if (this.width !== undefined) {
      contentResource.width = this.width;
    }

    if (this.duration !== undefined) {
      contentResource.duration = this.duration;
    }

    if (this.summary !== undefined) {
      contentResource.summary = this.summary;
    }

    return contentResource;
  }
}

export default ContentResource;
