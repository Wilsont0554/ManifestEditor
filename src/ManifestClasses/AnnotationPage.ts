import Annotation from "./Annotation.ts";
import type { IiifAnnotationPage } from "@/types/iiif";

class AnnotationPage {
    id: string;
    type: string;
    items: Annotation[];

    constructor() {
        this.id = "https://example.org/iiif/manifest/1/scene/1/page/1";
        this.type = "AnnotationPage";
        this.items = [];
    }

    setID(id: string): void {
        this.id = id;
    }

    addAnnotation(annotation: Annotation): void {
        this.items.push(annotation);
    }

    removeAnnotation(index: number): void {
        if (index < 0 || index >= this.items.length) {
            return;
        }

        this.items.splice(index, 1);
    }

    getAnnotation(index?: number): Annotation {
        if (index === undefined) {
            index = 0;
        }
        return this.items[index];
    }

    getAllAnnotations(): Annotation[] {
        return this.items;
    }

    toJSON(): IiifAnnotationPage {
        return {
            id: this.id,
            type: this.type,
            items: this.items.map((item) => item.toJSON()),
        };
    }
}

export default AnnotationPage;
