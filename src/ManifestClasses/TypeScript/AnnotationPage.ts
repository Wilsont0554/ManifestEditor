import Annotation from "./Annotation.ts";
import TextAnnotation from "./TextAnnotation.ts";
import OrthographicCamera from "./SceneComponets/OrthographicCamera.ts";

class AnnotationPage {
    id: string;
    type: string;
    items: any[];

    constructor() {
        this.id = "https://example.org/iiif/scene1/page/p1/1";
        this.type = "AnnotationPage";
        this.items = [];
    }

    addAnnotation(annotation: Annotation | TextAnnotation): void {
        this.items.push(annotation);
    }

    getAnnotation(index?: number): Annotation | TextAnnotation {
        if (index === undefined) {
            index = 0;
        }
        return this.items[index];
    }

    getAllAnnotations(): Annotation[] | TextAnnotation[] {
        return this.items;
    }

    addCamera(camera: OrthographicCamera /* || PerspectiveCamera */){
        this.items.push(camera);
    }
}

export default AnnotationPage;