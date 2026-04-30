import Label from './Label.ts';
import ContentResource from './ContentResource.ts';
import Target from "./Target.ts";
import TextAnnotation from './TextAnnotation.ts';

class Annotation {
    id: string;
    type: string;
    motivation: string[];
    body?: ContentResource;
    target: Target;
    label?: Label;

    constructor(index: number = 1, motivation: string[] = ["painting"]) {
        this.id = `https://example.org/iiif/manifest/1/scene/1/anno/${index}`;
        this.type = "Annotation";
        this.motivation = motivation;
        this.target = new Target();
        this.createLabel("en");
    }
    
    setContentResource(contentResource: ContentResource) {
        this.body = contentResource;
    }

    getContentResource(_index?: number): ContentResource | undefined | TextAnnotation {
        return this.body;
    }

    removeContentResource(): void {
        this.body = undefined;
    }

    getMotivation(): string[] {
        return this.motivation;
    }

    setLabel(index: number, value: string) {
        this.label?.changeLabelTest(value);
    }

    setTarget(target: Target): void {
        this.target = target;
    }

    setAllValues(newAnnotation: Annotation): void{
        try{

            this.id = newAnnotation.id;
            this.type = newAnnotation.type;
            this.motivation = newAnnotation.motivation;
            
            const tempTarget = new Target;

            if (newAnnotation.target.source != undefined){
                tempTarget.setSource(newAnnotation.target.source[0].id, newAnnotation.target.source[0].type);
                tempTarget.setSelectorType(newAnnotation.target.selector[0].type);
                tempTarget.setX(newAnnotation.target.selector[0].x);
                tempTarget.setY(newAnnotation.target.selector[0].y);
                tempTarget.setZ(newAnnotation.target.selector[0].z);

                this.setTarget(tempTarget);
            }

            if (newAnnotation.label != undefined){
                const labelCodeArray = Object.keys(newAnnotation.label!);
                const labelCode = labelCodeArray[0] as keyof Label;

                this.setLabel(0, (newAnnotation.label[labelCode][0] as unknown as string));
                this.label!.setLanguage(labelCode);
            }
        }catch(e){
            console.log(e);
        }
    }

    getTarget(): Target | null {
        return this.target instanceof Target ? this.target : null;
    }

    setX(x: number): void {
        this.getTarget()!.setX(x);
    }

    setY(y: number): void {
        this.getTarget()!.setY(y);
    }

    setZ(z: number): void {
        this.getTarget()!.setZ(z);
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

    clone(): Annotation {
        const nextAnnotation = new Annotation();

        nextAnnotation.id = this.id;
        nextAnnotation.type = this.type;
        nextAnnotation.motivation = [...this.motivation];
        nextAnnotation.body = this.body?.clone();
        //nextAnnotation.target = this.target.clone();
        nextAnnotation.label = this.label?.clone();

        return nextAnnotation;
    }
}

export default Annotation;