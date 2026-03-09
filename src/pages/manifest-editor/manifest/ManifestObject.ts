import type { IiifLinkedResource, IiifManifest } from "../../../types/iiif";
import Container from "./Container";
import Label from "./Label";

interface ManifestMetadataEntry {
  label: Label;
  value: Label;
}

class ManifestObject {
  "@context": string;
  id: string;
  type: string;
  label: Label;
  summary: Label;
  metadata: ManifestMetadataEntry[];
  homepage: IiifLinkedResource[];
  seeAlso: IiifLinkedResource[];
  navPlace: string;
  items: Container[];

  constructor(containerType: string) {
    this["@context"] = "https://iiif.io/api/presentation/4/context.json";
    this.id = "https://example.org/to13swr5ws-mlwptp83";
    this.type = "Manifest";
    this.label = new Label("Blank Manifest", "en");
    this.summary = new Label("", "en");
    this.metadata = [];
    this.homepage = [];
    this.seeAlso = [];
    this.navPlace = "";
    this.items = [];
    this.addContainer(new Container(containerType));
  }

  addContainer(container: Container): void {
    this.items.push(container);
  }

  getContainerObj(index = 0): Container {
    return this.items[index]!;
  }

  setID(value: string): void {
    this.id = value;
  }

  getID(): string {
    return this.id;
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

  changeSummary(_index: number | undefined, value: string, languageCode?: string): void {
    this.summary.changeLabelTest(value);

    if (languageCode) {
      this.summary.setLanguage(languageCode);
    }
  }

  getSummary(): Label {
    return this.summary;
  }

  addMetadata(languageCode = "en"): void {
    this.metadata.push({
      label: new Label("", languageCode),
      value: new Label("", languageCode),
    });
  }

  removeMetadata(index: number): void {
    this.metadata.splice(index, 1);
  }

  changeMetadataLabel(index: number, value: string, languageCode?: string): void {
    if (!this.metadata[index]) {
      this.addMetadata(languageCode);
    }

    this.metadata[index]!.label.changeLabelTest(value);

    if (languageCode) {
      this.metadata[index]!.label.setLanguage(languageCode);
    }
  }

  changeMetadataValue(index: number, value: string, languageCode?: string): void {
    if (!this.metadata[index]) {
      this.addMetadata(languageCode);
    }

    this.metadata[index]!.value.changeLabelTest(value);

    if (languageCode) {
      this.metadata[index]!.value.setLanguage(languageCode);
    }
  }

  getMetadata(): ManifestMetadataEntry[] {
    return this.metadata;
  }

  setHomepage(value: string): void {
    this.homepage = value
      ? [
          {
            id: value,
            type: "Text",
            format: "text/html",
          },
        ]
      : [];
  }

  getHomepage(): string {
    return this.homepage[0]?.id ?? "";
  }

  setSeeAlso(value: string): void {
    this.seeAlso = value
      ? [
          {
            id: value,
            type: "Dataset",
            format: "application/json",
          },
        ]
      : [];
  }

  getSeeAlso(): string {
    return this.seeAlso[0]?.id ?? "";
  }

  setNavPlace(value: string): void {
    this.navPlace = value;
  }

  getNavPlace(): string {
    return this.navPlace;
  }

  getContext(): string {
    return this["@context"];
  }

  toJSON(): IiifManifest {
    const manifest: IiifManifest = {
      "@context": this["@context"],
      id: this.id,
      type: this.type,
      label: this.label.toJSON(),
      summary: this.summary.toJSON(),
      items: this.items.map((container) => container.toJSON()),
    };

    if (this.metadata.length > 0) {
      manifest.metadata = this.metadata.map((entry) => ({
        label: entry.label.toJSON(),
        value: entry.value.toJSON(),
      }));
    }

    if (this.homepage.length > 0) {
      manifest.homepage = [...this.homepage];
    }

    if (this.seeAlso.length > 0) {
      manifest.seeAlso = [...this.seeAlso];
    }

    if (this.navPlace) {
      manifest.navPlace = this.navPlace;
    }

    return manifest;
  }
}

export default ManifestObject;
