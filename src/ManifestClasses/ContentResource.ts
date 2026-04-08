import Label from './Label.ts';
import Metadata from "./Metadata.ts";
import Transform from './Transform.ts';
import type { 
    IiifContentResource,
    IiifSpecificResource
 } from "@/types/iiif";

class ContentResource {
    id: string;
    type: string;
    format?: string;
    height?: number;
    width?: number;
    label: Label;
    duration?: number;
    summary?: Label;
    metadata: Metadata;
    transforms: Transform[];

    constructor(id: string, type: string, format?: string) {
        this.id = id;
        this.type = type;
        this.format = format;
        this.label = this.createLabel("en");
        this.metadata = new Metadata();
        this.transforms = [];
    }

    /*---------------------------------------------------
                        SETTERS
    ---------------------------------------------------*/
    setID(value: string): void {
        this.id = value;
    }

    setType(type: string): void {
        this.type = type;
    }

    setFormat(format?: string): void {
        this.format = format;
    }

    setDimensions(height: number, width: number): void {
        this.height = height;
        this.width = width;
    }

    setLabel(index: number, value: string): void {
        this.label.changeLabelTest(value);
    }

    createLabel(languageCode: string = 'en'): Label {
        return new Label('', languageCode);
    }

    setDuration(duration: number): void {
        this.duration = duration;
    }

    setSummary(summary: string): void {
        if (!this.summary) {
            this.summary = new Label('', 'en');
        }

        this.summary.changeLabelTest(summary);
    }

    /*---------------------------------------------------
                        GETTERS
    ---------------------------------------------------*/
    
    //returns as 0:height, 1:width
    getDimensions(): [number | undefined, number | undefined] {
        return [this.height, this.width];
    }

    changeLabel(index: number, value: string, languageCode?: string): void {
        this.label.changeLabelTest(value);
        if (languageCode) {
            this.label.setLanguage(languageCode);
        }
    }

    getLabel(index?: number): Label {
        if (index === undefined) {
            index = 0;
        }
        return this.label;
    }

    getAllLabels(): Label {
        return this.label;
    }

    getType(): string {
        return this.type;
    }

    getFormat(): string | undefined {
        return this.format;
    }

    getDuration(): number | undefined {
        return this.duration;
    }

    getSummary(): string | undefined {
        return this.summary?.getValue();
    }

    getMetadata(): Metadata {
        return this.metadata;
    }

    isModelResource(): boolean {
        return this.type === "Model";
    }

    getTransforms(): Transform[] {
        return this.transforms;
    }

    getTransfroms(): Transform[] {
        return this.getTransforms();
    }

    addTransform(type: string = "RotateTransform"): Transform {
        const nextTransform = new Transform(Transform.isTransformType(type) ? type: "RotateTransform");
        this.transforms.push(nextTransform);
        return nextTransform;
    }

    removeTransform(index: number): void {
        if(index < 0 || index >= this.transforms.length) {
            return;
        }

        this.transforms.splice(index, 1);
    }

    clearTransforms(): void {
        this.transforms = [];
    }

    protected buildBaseJson(): IiifContentResource {
        const out: IiifContentResource = {
            id: this.id,
            type: this.type,
        };

        if (this.format) {
            out.format = this.format;
        }

        if (this.label.hasValue()) {
            out.label = this.label.toJSON();
        }

        if (this.metadata.getEntryCount() > 0) {
            out.metadata = this.metadata.toJSON();
        }

        if (this.height !== undefined) {
            out.height = this.height;
        }

        if (this.width !== undefined) {
            out.width = this.width;
        }

        if (this.duration !== undefined) {
            out.duration = this.duration;
        }

        if (this.summary?.hasValue()) {
            out.summary = this.summary.toJSON();
        }

        return out;
    }

    toAnnotationBodyJSON(): IiifContentResource | IiifSpecificResource {
        const baseJson = this.buildBaseJson();

        if (!this.isModelResource()) {
            return baseJson;
        }

        const transforms = this.transforms
            .filter((transform) => transform.hasValue())
            .map((transform) => transform.toJSON());

        return {
            type: "SpecificResource",
            source: [baseJson],
            ...(transforms.length > 0 ? { transform: transforms } : {}),
        };
    }

    toJSON(): IiifContentResource {
        return this.buildBaseJson();
    }
}

export default ContentResource;
