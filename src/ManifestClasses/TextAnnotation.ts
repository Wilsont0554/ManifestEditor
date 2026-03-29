import Annotation from "./Annotation.ts";
import Target from "./Target.ts";
import type { IiifAnnotation, IiifTextualBody } from "@/types/iiif";

class TextAnnotation extends Annotation {
    private bodyValue: string;
    private bodyLanguage: string;
    private position: Target;

    constructor(index: number = 1) {
        super(index);
        this.motivation = ["commenting"];
        this.bodyValue = "";
        this.bodyLanguage = "en";
        this.position = new Target(`${this.id}/position`);
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

    setCommentTargetReference(id: string, type: "Timeline" | "Canvas" | "Scene"): void {
        this.target = { id, type };
    }

    ensurePositionTarget(
        targetId: string = `${this.id}/position`,
        sourceId: string = "https://example.org/iiif/manifest/1/scene/1",
        sourceType: "Timeline" | "Canvas" | "Scene" = "Scene",
    ): Target {
        this.position.setID(targetId);
        this.position.setSource(sourceId, sourceType);
        return this.position;
    }

    override getTarget(): Target | null {
        return this.position;
    }

    override setX(x: number): void {
        this.position.setX(x);
    }

    override setY(y: number): void {
        this.position.setY(y);
    }

    override setZ(z: number): void {
        this.position.setZ(z);
    }

    override toJSON(): IiifAnnotation {
        const body: IiifTextualBody = {
            id: `${this.id}/body`,
            type: "TextualBody",
            value: this.bodyValue,
            format: "text/plain",
            language: this.bodyLanguage,
            purpose: "commenting",
            position: this.position.toJSON(),
        };

        const out = {
            id: this.id,
            type: this.type,
            motivation: this.motivation,
            body,
            target: this.target,
        } as Partial<IiifAnnotation>;

        if (this.label?.hasValue()) {
            out.label = this.label.toJSON();
        }

        return out as IiifAnnotation;
    }
}

export default TextAnnotation;
