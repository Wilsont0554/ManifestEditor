import Container from "./Container.js";
import Label from "./Label.js";

class ManifestObject {
  constructor(containerType) {
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

  addContainer(container) {
    this.items.push(container);
  }

  getContainerObj(index) {
    if (index == undefined) {
      index = 0;
    }
    return this.items[index];
  }

  setID(value) {
    this.id = value;
  }

  getID() {
    return this.id;
  }

  changeLabel(index, value, languageCode) {
    this.label.changeLabelTest(value);
    if (languageCode) {
      this.label.setLanguage(languageCode);
    }
  }

  getLabel() {
    return this.label;
  }

  changeSummary(index, value, languageCode) {
    this.summary.changeLabelTest(value);
    if (languageCode) {
      this.summary.setLanguage(languageCode);
    }
  }

  getSummary() {
    return this.summary;
  }

  addMetadata(languageCode = "en") {
    this.metadata.push({
      label: new Label("", languageCode),
      value: new Label("", languageCode),
    });
  }

  removeMetadata(index) {
    this.metadata.splice(index, 1);
  }

  changeMetadataLabel(index, value, languageCode) {
    if (!this.metadata[index]) {
      this.addMetadata(languageCode);
    }

    this.metadata[index].label.changeLabelTest(value);
    if (languageCode) {
      this.metadata[index].label.setLanguage(languageCode);
    }
  }

  changeMetadataValue(index, value, languageCode) {
    if (!this.metadata[index]) {
      this.addMetadata(languageCode);
    }

    this.metadata[index].value.changeLabelTest(value);
    if (languageCode) {
      this.metadata[index].value.setLanguage(languageCode);
    }
  }

  getMetadata() {
    return this.metadata;
  }

  setHomepage(value) {
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

  getHomepage() {
    return this.homepage[0]?.id ?? "";
  }

  setSeeAlso(value) {
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

  getSeeAlso() {
    return this.seeAlso[0]?.id ?? "";
  }

  setNavPlace(value) {
    this.navPlace = value;
  }

  getNavPlace() {
    return this.navPlace;
  }

  getContext() {
    return this["@context"];
  }
}

export default ManifestObject;
