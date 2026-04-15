import Annotation from "./Annotation.ts";

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

    getPaintingAnnotations(): Annotation[] {
        return this.items.filter(
            (annotation) => !annotation.getMotivation().includes("commenting"),
        );
    }

    getCommentingAnnotations(): Annotation[] {
        return this.items.filter((annotation) =>
            annotation.getMotivation().includes("commenting"),
        );
    }

    clone(): AnnotationPage {
        const nextAnnotationPage = new AnnotationPage();

        nextAnnotationPage.id = this.id;
        nextAnnotationPage.type = this.type;
        nextAnnotationPage.items = this.items.map((item) => item.clone());

        return nextAnnotationPage;
    }
}

export default AnnotationPage;
