import Annotation from "./Annotation.ts";
import type { IiifAnnotation, IiifTextualBody } from "@/types/iiif";

class TextAnnotation extends Annotation {
    private bodyValue: string;
    private bodyLanguage: string;

    constructor(index: number = 1) {
        super(index);
        this.motivation = ["commenting"];
        this.bodyValue = "";
        this.bodyLanguage = "en";
        this.ensureSpatialTarget();
    }

    setBodyValue(value: string): void {
        this.bodyValue = value;
    }

    getBodyValue(): string {
        return this.bodyValue;
    }

    setBodyLanguage(languageCode: string): void {
        this.bodyLanguage = languageCode;
    }

    getBodyLanguage(): string {
        return this.bodyLanguage;
    }

    override getContentResource() {
        return undefined;
    }

    override toJSON(): IiifAnnotation {
        const body: IiifTextualBody = {
            type: "TextualBody",
            value: this.bodyValue,
            format: "text/plain",
            language: this.bodyLanguage,
            purpose: "commenting",
        };
        const spatialTarget = this.getTarget();

        const out = {
            id: this.id,
            type: this.type,
            motivation: this.motivation,
            body,
            target: spatialTarget ? spatialTarget.toJSON() : this.target,
        } as Partial<IiifAnnotation>;

        if (this.label?.hasValue()) {
            out.label = this.label.toJSON();
        }

        return out as IiifAnnotation;
    }
}

export default TextAnnotation;
