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

    setAllValues(newContentResource: ContentResource): void{
        try{
            this.id = newContentResource.id;
            this.type = newContentResource.type;
            this.format = newContentResource.format;
            this.height = newContentResource.height;
            this.width = newContentResource.width;
            this.duration = newContentResource.duration;
            

            if (newContentResource.label != undefined){
                const labelCodeArray = Object.keys(newContentResource.label);
                const labelCode = labelCodeArray[0] as keyof Label;


                this.setLabel(0, (newContentResource.label[labelCode]![0] as keyof Label));
                this.label.setLanguage(labelCode);
            }

            if (newContentResource.metadata != undefined){
                for (let i = 0 ; i < newContentResource.metadata.length; i++){
                    const metadataCodeArray = Object.keys(newContentResource.metadata[i].label);
                    const metadataCode = metadataCodeArray[0] as keyof Label;
                    this.metadata.addEntry(newContentResource.metadata[i].label[metadataCode], newContentResource.metadata[i].value[metadataCode],  metadataCode)
                }
            }
        }catch(e){
            console.log(e);
        }

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

    protected cloneBaseProperties<T extends ContentResource>(target: T): T {
        target.id = this.id;
        target.type = this.type;
        target.format = this.format;
        target.height = this.height;
        target.width = this.width;
        target.label = this.label.clone();
        target.duration = this.duration;
        target.summary = this.summary?.clone();
        target.metadata = this.metadata.clone();
        target.transforms = this.transforms.map((transform) => transform.clone());

        return target;
    }

    clone(): ContentResource {
        return this.cloneBaseProperties(
            new ContentResource(this.id, this.type, this.format),
        );
    }
}

export default ContentResource;
