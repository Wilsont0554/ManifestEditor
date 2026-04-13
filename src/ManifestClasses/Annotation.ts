import Label from './Label.ts';
import ContentResource from './ContentResource.ts';
import Target from "./Target.ts";
import type {
    IiifAnnotation,
    IiifContainerType,
    IiifContentResource,
    IiifResourceReference,
    IiifSpecificResource
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

    setContentResource(contentResource: ContentResource) {
        this.body = contentResource;
    }

    getContentResource(_index?: number): ContentResource | undefined {
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

    toJSON(): IiifAnnotation {
        const out = {
            id: this.id,
            type: this.type,
            motivation: this.motivation,
            body: this.body?.toAnnotationBodyJSON() as IiifContentResource | IiifSpecificResource,
            target: this.target instanceof Target ? this.target.toJSON() : this.target,
        } as Partial<IiifAnnotation>;

        if (this.label?.hasValue()) {
            out.label = this.label.toJSON();
        }

        return out as IiifAnnotation;
    }
}

export default Annotation;
