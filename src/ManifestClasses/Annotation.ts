import Label from './Label.ts';
import ContentResource from './ContentResource.ts';
import Target from "./Target.ts";

class Annotation {
    id: string;
    type: string;
    motivation: string[];
    body?: ContentResource;
    target: string | Target;
    label?: Label;

    constructor(index: number = 1) {
        this.id = `https://example.org/iiif/3d/anno${index}`;
        this.type = "Annotation";
        this.motivation = ["painting"];
        this.target = "https://example.org/iiif/scene1/page/p1/1";
        this.createLabel("en");
    }

    setContentResource(contentResource: ContentResource) {
        this.body = contentResource;
    }

    getContentResource(_index?: number) {
        return this.body;
    }

    setLabel(index: number, value: string) {
        this.label?.changeLabelTest(value);
    }

    setTarget(target?: Target | string): void {
        this.target = target ?? new Target();
    }

    ensureSpatialTarget(): Target {
        if (this.target instanceof Target) {
            return this.target;
        }

        this.target = new Target();
        return this.target;
    }

    getTarget(): Target | null {
        return this.target instanceof Target ? this.target : null;
    }

    setX(x: number): void {
        this.ensureSpatialTarget().setX(x);
    }

    setY(y: number): void {
        this.ensureSpatialTarget().setY(y);
    }

    setZ(z: number): void {
        this.ensureSpatialTarget().setZ(z);
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
