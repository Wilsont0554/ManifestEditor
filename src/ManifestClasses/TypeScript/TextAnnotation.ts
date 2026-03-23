import Label from './Label.ts';
import ContentResource from './ContentResource.js';

class Annotation {
    id: string;
    type: string;
    motivation: string[];
    bodyValue?: string;
    target: string;

    constructor(index: number) {
        this.id = "https://example.org/iiif/3d/anno" + index;
        this.type = "Annotation";
        this.motivation = ["commenting"];
        this.target = "https://example.org/iiif/scene1";
        //this.createLabel("en");
    }

    setContentResource(value: string) {
        this.bodyValue = value;
    }

    getContentResource() {
        return this.bodyValue;
    }

    changeID(value: string) {
        this.id = value;
    }

    getID() {
        return this.id;
    }

}

export default Annotation;