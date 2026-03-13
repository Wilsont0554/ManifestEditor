import Label from './Label.ts';
import ContentResource from './ContentResource.js';
import Target from './Target.ts';

class Annotation {
    id: string;
    type: string;
    motivation: string[];
    body?: ContentResource;
    target?: Target;
    label?: Label;

    constructor() {
        this.id = "https://example.org/iiif/3d/anno1";
        this.type = "Annotation";
        this.motivation = ["painting"];
        this.label;
        this.createLabel("en");
        this.setTarget();
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

    setTarget(){
        this.target = new Target("https://example.org/iiif/scene1");
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