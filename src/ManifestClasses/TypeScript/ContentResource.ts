import Label from './Label.ts';

class ContentResource {
    id: string;
    type: string;
    format: string | undefined;
    height?: number;
    width?: number;
    label?: Label;
    duration?: number;
    summary?: string;

    constructor(id: string, type: string, format: string) {
        this.id = id;
        this.type = type;
        this.format = format;
        //this.label = this.createLabel("en");
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

    setFormat(format: string | undefined): void {
        this.format = format;
    }

    setDimensions(height: number, width: number): void {
        this.height = height;
        this.width = width;
    }

    setLabel(index: number, value: string): void {
        this.label?.changeLabelTest(value);
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
        this.label?.changeLabelTest(value);
        if (languageCode) {
            this.label?.setLanguage(languageCode);
        }
    }

    getLabel(index?: number): Label | undefined {
        if (index === undefined) {
            index = 0;
        }

        return this.label;
    }

    getAllLabels(): Label | undefined {
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
        return this.summary;
    }
    getID(){
        return this.id
    }
}

export default ContentResource;