import Label from './Label.ts';
import ContentResource from './ContentResource.js';

class Annotation {
    id: string;
    type: string;
    motivation: string[];
    body?: ContentResource;
    target: string;
    label?: Label;

    constructor() {
        this.id = "https://example.org/iiif/3d/anno1";
        this.type = "Annotation";
        this.motivation = ["painting"];
        this.target = "https://example.org/iiif/scene1/page/p1/1";
        this.label;
        this.createLabel("en");
    }

    setContentResource(contentResource: ContentResource) {
        this.body = contentResource;
    }

    getContentResource(index?: number) {
        return this.body;
    }

    setLabel(index: number, value: string) {
        this.label?.changeLabelTest(value);
    }

    createLabel(languageCode: string = 'en') {
        this.label = new Label('', languageCode);
    }

    changeLabel(index: number, value: string, languageCode?: string) {
        this.label?.changeLabelTest(value);
        if (languageCode) {
            this.label?.setLanguage(languageCode);
        }
    }

    getLabel() {
        return this.label;
    }

    getAllContentResource() {
        return this.body;
    }

    changeID(value: string) {
        this.id = value;
    }

    getID() {
        return this.id;
    }

    getAllLabels() {
        return this.label;
    }
}

export default Annotation;