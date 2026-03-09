import Annotation from "./Annotation.ts";

class AnnotationPage {
    id: string;
    type: string;
    items: Annotation[];

    constructor() {
        this.id = "https://example.org/iiif/scene1/page/p1/1";
        this.type = "AnnotationPage";
        this.items = [];
        this.addAnnotation(new Annotation());
    }

    addAnnotation(annotation: Annotation): void {
        this.items.push(annotation);
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