import { IiifAnnotation, IiifLanguageMap, IiifTextualBody } from "@/types/iiif.ts";
import ContentResource from "./ContentResource.ts";

class TextAnnotation extends ContentResource {
    private value: string;
    private language: string;
    private purpose: string;
    //private position: Target;

    constructor(index: number = 1) {
        super(`https://example.org/iiif/manifest/1/scene/1/anno/${index}/body`, "TextualBody", "text/plain");
        this.value = "";
        this.language = "en";
        this.purpose = "commenting";
        //this.position = new Target(`${this.id}/position`);
    }

    setAllTextAnnotationValues(newTextAnnotation: TextAnnotation): void{
        try{
            this.setAllValues(newTextAnnotation as ContentResource);
            this.value = newTextAnnotation.value;
            this.language = newTextAnnotation.language;
        }catch(e){
            console.log(e);
        }
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

    override toJSON(): IiifAnnotation {
        const body: IiifTextualBody = {
            id: `${this.id}/body`,
            type: "TextualBody",
            value: this.value,
            format: "text/plain",
            language: this.language,
            purpose: "commenting",
        };

        const fallbackLabel: IiifLanguageMap | undefined = this.value.trim()
            ? {
                [this.language]: [this.value],
            }
            : undefined;

        const out = {
            id: this.id,
            type: this.type,
            body,
        } as Partial<IiifAnnotation>;

        if (this.label?.hasValue()) {
            out.label = this.label.toJSON();
        } else if (fallbackLabel) {
            out.label = fallbackLabel;
        }

        return out as IiifAnnotation;
    }
}

export default TextAnnotation;
