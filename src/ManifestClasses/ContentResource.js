import Label from "./Label.js";

class ContentResource {
  constructor(id = "", type = "Image", format = "image/jpeg") {
    this.id = id;
    this.type = type;
    this.format = format;
    this.label = new Label("", "en");
    this.service = [];
    this.height = undefined;
    this.width = undefined;
    this.duration = undefined;
    this.summary = undefined;
  }

  setID(value) {
    this.id = value;
  }

  changeID(value) {
    this.id = value;
  }

  getID() {
    return this.id;
  }

  setType(type) {
    this.type = type;
  }

  setFormat(format) {
    this.format = format;
  }

  getType() {
    return this.type;
  }

  getFormat() {
    return this.format;
  }

  setDimensions(height, width) {
    this.height = height;
    this.width = width;
  }

  getDimensions() {
    return [this.height, this.width];
  }

  setDuration(duration) {
    this.duration = duration;
  }

  getDuration() {
    return this.duration;
  }

  setSummary(summary) {
    this.summary = summary;
  }

  getSummary() {
    return this.summary;
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

  getLabel(index) {
    return this.label;
  }

  getAllLabels() {
    return this.label ? [this.label] : [];
  }

  setImageService(serviceId, serviceType = "ImageService3", profile = "level1") {
    if (!serviceId) {
      this.service = [];
      return;
    }

    this.service = [
      {
        id: serviceId,
        type: serviceType,
        profile,
      },
    ];
  }

  clearImageService() {
    this.service = [];
  }

  toJSON() {
    const output = {
      id: this.id,
      type: this.type,
      format: this.format,
    };

    if (this.label) {
      output.label = this.label;
    }

    if (this.service.length > 0) {
      output.service = this.service;
    }

    if (this.height != undefined) {
      output.height = this.height;
    }

    if (this.width != undefined) {
      output.width = this.width;
    }

    if (this.duration != undefined) {
      output.duration = this.duration;
    }

    if (this.summary != undefined) {
      output.summary = this.summary;
    }

    return output;
  }
}
export default ContentResource;
