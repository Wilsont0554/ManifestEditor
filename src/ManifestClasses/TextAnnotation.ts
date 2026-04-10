import ContentResource from "./ContentResource.ts";

class TextAnnotation extends ContentResource {
    private value: string;
    private language: string;
    //private position: Target;

    constructor(index: number = 1) {
        super(`https://example.org/iiif/manifest/1/scene/1/anno/${index}`, "TextualBody", "text/plain");
        this.value = "";
        this.language = "en";
        //this.position = new Target(`${this.id}/position`);
    }

    setBodyValue(value: string): void {
        this.value = value;
    }

    getBodyValue(): string {
        return this.value;
    }

    setBodyLanguage(languageCode: string): void {
        this.language = languageCode;
    }

    getBodyLanguage(): string {
        return this.language;
    }


    override clone(): TextAnnotation {
        const nextAnnotation = new TextAnnotation();

        nextAnnotation.id = this.id;
        nextAnnotation.type = this.type;
        nextAnnotation.label = this.label?.clone();
        nextAnnotation.value = this.value;
        nextAnnotation.language = this.language;

        return nextAnnotation;
    }
}

export default TextAnnotation;
