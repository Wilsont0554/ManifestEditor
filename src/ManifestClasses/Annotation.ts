import Label from './Label.ts';
import ContentResource from './ContentResource.ts';
import Target from "./Target.ts";
import type {
    IiifAnnotation,
    IiifContainerType,
    IiifContentResource,
    IiifResourceReference,
} from "@/types/iiif";

type AnnotationTargetReference = IiifResourceReference;

class Annotation {
    id: string;
    type: string;
    motivation: string[];
    body?: ContentResource;
    target: AnnotationTargetReference | Target;
    label?: Label;

    constructor(index: number = 1) {
        this.id = `https://example.org/iiif/manifest/1/scene/1/anno/${index}`;
        this.type = "Annotation";
        this.motivation = ["painting"];
        this.target = {
            id: "https://example.org/iiif/manifest/1/scene/1",
            type: "Scene",
        };
        this.createLabel("en");
    }

    test(){
        alert('test');
    }
    
    setContentResource(contentResource: ContentResource) {
        this.body = contentResource;
    }

    getContentResource(_index?: number): ContentResource | undefined {
        return this.body;
    }

    getMotivation(): string[] {
        return this.motivation;
    }

    setLabel(index: number, value: string) {
        this.label?.changeLabelTest(value);
    }

    setTarget(target: AnnotationTargetReference | Target): void {
        this.target = target;
    }

    setTargetReference(id: string, type: IiifContainerType): void {
        this.target = { id, type };
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


    ensureSpatialTarget(
        targetId: string = `${this.id}/target`,
        sourceId: string = "https://example.org/iiif/manifest/1/scene/1",
        sourceType: IiifContainerType = "Scene",
    ): Target {
        if (this.target instanceof Target) {
            this.target.setID(targetId);
            this.target.setSource(sourceId, sourceType);
            return this.target;
        }

        const nextTarget = new Target(targetId, sourceId, sourceType);
        this.target = nextTarget;
        return nextTarget;
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

    toJSON(): IiifAnnotation {
        const out = {
            id: this.id,
            type: this.type,
            motivation: this.motivation,
            body: this.body?.toJSON() as IiifContentResource,
            target: this.target instanceof Target ? this.target.toJSON() : this.target,
        } as Partial<IiifAnnotation>;

        if (!this.body) {
            out.body = undefined;
        }

        if (this.label?.hasValue()) {
            out.label = this.label.toJSON();
        }

        return out as IiifAnnotation;
    }
}

export default Annotation;
