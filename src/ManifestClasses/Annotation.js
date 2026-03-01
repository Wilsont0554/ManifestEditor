import Label from "./Label.js";

class Annotation {
  constructor(targetId = "") {
    this.id = "https://example.org/iiif/3d/anno1";
    this.type = "Annotation";
    this.motivation = "painting";
    this.target = targetId;
    this.body = [];
    this.label = new Label("", "en");
  }

  addContentResource(contentResource) {
    this.body.push(contentResource);
  }

  getContentResource(index) {
    if (index == undefined) {
      index = 0;
    }
    return this.body[index];
  }

  getAllContentResource() {
    return this.body;
  }

  clearContentResources() {
    this.body = [];
  }

  replaceFirstContentResource(contentResource) {
    if (this.body.length === 0) {
      this.addContentResource(contentResource);
      return;
    }
    this.body[0] = contentResource;
  }

  setLabel(index, value) {
    this.label.changeLabelTest(value);
  }

  createLabel(languageCode = "en") {
    this.label = new Label("", languageCode);
  }

  createLabelTest(languageCode = "en") {
    this.createLabel(languageCode);
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

  getAllLabels() {
    return this.label ? [this.label] : [];
  }

  changeID(value) {
    this.id = value;
  }

  getID() {
    return this.id;
  }

  setTarget(targetId) {
    this.target = targetId;
  }

  setMotivation(motivation) {
    this.motivation = motivation;
  }

  setId(id) {
    this.id = id;
  }

  toJSON() {
    const output = {
      id: this.id,
      type: this.type,
      motivation: this.motivation,
      body: this.body.length === 1 ? this.body[0] : this.body,
      target: this.target,
    };

    if (this.label) {
      output.label = this.label;
    }

    return output;
  }
}
export default Annotation;
