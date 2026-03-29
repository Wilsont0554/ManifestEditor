import AnnotationPage from './AnnotationPage.ts';
import type {
    IiifAnnotationPage,
    IiifCanvasLike,
    IiifContainerType,
} from "@/types/iiif";

function normalizeContainerType(type?: string): IiifContainerType {
    if (type === "canvas" || type === "Canvas") {
        return "Canvas";
    }

    if (type === "timeline" || type === "Timeline") {
        return "Timeline";
    }

    return "Scene";
}

class Container {
    static VALID_TYPES: Set<IiifContainerType> = new Set(['Timeline', 'Canvas', 'Scene']);

    id: string;
    type: IiifContainerType;
    items: AnnotationPage[];
    duration?: number;
    height?: number;
    width?: number;

    constructor(id?: string, type?: string) {
        this.id = id === undefined ? 'https://example.org/iiif/manifest/1/scene/1' : id;
        this.type = normalizeContainerType(type);
        this.items = [];
        this.addAnnotationPage(new AnnotationPage());
    }

    deleteDimensions() {
        delete this.height;
        delete this.width;
    }

    deleteDuration() {
        delete this.duration;
    }

    getItems(): AnnotationPage[] {
        return this.items;
    }

    setID(id: string): void {
        this.id = id;
    }

    getType(): IiifContainerType {
        return this.type;
    }

    getID(): string {
        return this.id;
    }

    getDuration(): number | undefined {
        return this.duration;
    }

    getDimensions(): (number | undefined)[] {
        return [this.height, this.width];
    }

    getAnnotationPage(index?: number): AnnotationPage {
        if (index === undefined) index = 0;
        return this.items[index];
    }

    setDuration(duration: number) {
        this.duration = duration;
    }

    setDimensions(height: number, width: number) {
        this.height = height;
        this.width = width;
    }

    setType(type: string) {
        const normalizedType = normalizeContainerType(type);

        this.type = normalizedType;
        if (normalizedType === "Canvas") {
            this.setDimensions(0, 0);
            this.deleteDuration();
        } else if (normalizedType === "Timeline") {
            this.setDuration(0);
            this.deleteDimensions();
        } else {
            this.deleteDimensions();
            this.deleteDuration();
        }
    }

    addAnnotationPage(annotation: AnnotationPage) {
        this.items.push(annotation);
    }

    toJSON(): IiifCanvasLike {
        const paintingAnnotationPages = this.items
            .map((item) => item.toFilteredJSON(item.getPaintingAnnotations(), item.id))
            .filter((item): item is IiifAnnotationPage => !!item);

        const out: IiifCanvasLike = {
            id: this.id,
            type: this.type,
            items: paintingAnnotationPages,
        };

        if (this.type === "Timeline" && this.duration !== undefined) {
            out.duration = this.duration;
        }

        if (this.type === "Canvas" && this.height !== undefined && this.width !== undefined) {
            out.height = this.height;
            out.width = this.width;
        }

        return out;
    }
}

export default Container;
