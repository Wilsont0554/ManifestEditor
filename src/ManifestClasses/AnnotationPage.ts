import Annotation from "./Annotation.ts";

class AnnotationPage {
    id: string;
    type: string;
    items: Annotation[];

    constructor() {
        this.id = "https://example.org/iiif/scene1/page/p1/1";
        this.type = "AnnotationPage";
        this.items = [];
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
}

export default AnnotationPage;
