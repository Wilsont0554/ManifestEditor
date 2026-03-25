import Label from './Label.ts';
import Metadata from "./Metadata.ts";

class ContentResource {
    id: string;
    type: string;
    format: string;
    height?: number;
    width?: number;
    label: Label;
    duration?: number;
    summary?: string;
    metadata: Metadata;

    constructor(id: string, type: string, format: string) {
        this.id = id;
        this.type = type;
        this.format = format;
        this.label = this.createLabel("en");
        this.metadata = new Metadata();
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

    setFormat(format: string): void {
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
        this.summary = summary;
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

    getFormat(): string {
        return this.format;
    }

    getDuration(): number | undefined {
        return this.duration;
    }

    getSummary(): string | undefined {
        return this.summary;
    }

    getMetadata(): Metadata {
        return this.metadata;
    }
}

export default ContentResource;
