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

    override clone(): TextAnnotation {
        const nextAnnotation = new TextAnnotation();

        nextAnnotation.id = this.id;
        nextAnnotation.type = this.type;
        nextAnnotation.motivation = [...this.motivation];
        nextAnnotation.target = this.target instanceof Target
            ? this.target.clone()
            : { ...this.target };
        nextAnnotation.label = this.label?.clone();
        nextAnnotation.bodyValue = this.bodyValue;
        nextAnnotation.bodyLanguage = this.bodyLanguage;
        nextAnnotation.position = this.position.clone();

        return nextAnnotation;
    }

    override toJSON(): IiifAnnotation {
        const body: IiifTextualBody = {
            id: `${this.id}/body`,
            type: "TextualBody",
            value: this.bodyValue,
            format: "text/plain",
            language: this.bodyLanguage,
            purpose: "commenting",
        };

        const fallbackLabel: IiifLanguageMap | undefined = this.bodyValue.trim()
            ? {
                [this.bodyLanguage]: [this.bodyValue],
            }
            : undefined;

        const out = {
            id: this.id,
            type: this.type,
            motivation: this.motivation,
            body,
            target: this.position.toJSON(),
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
