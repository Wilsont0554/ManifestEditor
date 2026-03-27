import Label from './Label.ts';
import ContentResource from './ContentResource.js';
import Target from './Target.ts';

class TextAnnotation {
    id: string;
    type: string;
    motivation: string[];
    bodyValue?: string;
    target?: Target;
    label?: Label;

    constructor(index: number) {
        this.id = "https://example.org/iiif/3d/anno" + index;
        this.type = "Annotation";
        this.motivation = ["commenting"];
        this.label;
        this.createLabel("en");
        this.setTarget();
    }

    setBodyValue(value: string) {
        this.bodyValue = value;
    }

    getBodyValue() {
        return this.bodyValue;
    }

    setLabel(index: number, value: string) {
        this.label?.changeLabelTest(value);
    }

    setTarget(){
        this.target = new Target(); //"https://example.org/iiif/scene1"
    }

    getTarget(){
        return this.target;
    }

    getType(){
        return this.type;
    }

    getMotivation(){
        return this.motivation;
    }

    setX(x: number){
        this.target?.setX(x);
    }
    setY(x: number){
        this.target?.setY(x);
    }
    setZ(x: number){
        this.target?.setZ(x);
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
        return this.bodyValue;
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

    
    getContentResource(){
        return null;
    }
}

export default TextAnnotation;