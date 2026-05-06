import Label from './Label.ts';
import ContentResource from './ContentResource.ts';
import Target from "./Target.ts";
import type {
    IiifContainerType,
    IiifAnnotation,
    IiifLanguageMap,
    IiifResourceReference,
    IiifSpecificResource
} from "@/types/iiif";
import TextAnnotation from './TextAnnotation.ts';

type AnnotationTargetReference = IiifResourceReference | IiifSpecificResource;

function isSpecificResourceTarget(
    target: AnnotationTargetReference | Target,
): target is IiifSpecificResource {
    return !(target instanceof Target) && target.type === "SpecificResource";
}

function getFirstLanguageValue(label: IiifLanguageMap): [string, string] | null {
    const [languageCode] = Object.keys(label);
    const value = languageCode ? label[languageCode]?.[0] : undefined;

    return languageCode && value !== undefined ? [languageCode, value] : null;
}

class Annotation {
    id: string;
    type: string;
    motivation: string[];
    body?: ContentResource;
    target: AnnotationTargetReference | Target;
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

    setTarget(target: AnnotationTargetReference | Target): void {
        this.target = target;
    }

    setTargetReference(id: string, type: IiifContainerType): void {
        this.target = { id, type };
    }

    setAllValues(newAnnotation: Annotation | IiifAnnotation): void{
        try{

            this.id = newAnnotation.id;
            this.type = newAnnotation.type;
            this.motivation = newAnnotation.motivation;
            
            const tempTarget = new Target;

            if (isSpecificResourceTarget(newAnnotation.target) && newAnnotation.target.source[0] != undefined){
                const source = newAnnotation.target.source[0];
                const selector = newAnnotation.target.selector?.[0];

                tempTarget.setSource(source.id, source.type as IiifContainerType);

                if (selector != undefined) {
                    tempTarget.setSelectorType(selector.type);
                    tempTarget.setX(selector.x ?? 0);
                    tempTarget.setY(selector.y ?? 0);
                    tempTarget.setZ(selector.z ?? 0);
                }

                this.setTarget(tempTarget);
            }

            if (newAnnotation.label instanceof Label) {
                this.setLabel(0, newAnnotation.label.getValue());
                this.label!.setLanguage(newAnnotation.label.getLanguage() ?? "en");
            } else if (newAnnotation.label != undefined) {
                const firstLabelValue = getFirstLanguageValue(newAnnotation.label);

                if (firstLabelValue) {
                    const [labelCode, labelValue] = firstLabelValue;
                    this.setLabel(0, labelValue);
                    this.label!.setLanguage(labelCode);
                }
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

    clone(): Annotation {
        const nextAnnotation = new Annotation();

        nextAnnotation.id = this.id;
        nextAnnotation.type = this.type;
        nextAnnotation.motivation = [...this.motivation];
        nextAnnotation.body = this.body?.clone();
        nextAnnotation.target = this.target instanceof Target
            ? this.target.clone()
            : { ...this.target };
        nextAnnotation.label = this.label?.clone();

        return nextAnnotation;
    }
}

export default Annotation;
