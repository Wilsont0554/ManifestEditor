import Annotation from "./Annotation.js";
class AnnotationPage{
    constructor(canvasId = "https://example.org/iiif/canvas/1", annotationPageId){
        this.id = annotationPageId || `${canvasId}/page/p1/1`;
        this.type = "AnnotationPage";
        this.items = [];
        this.addAnnotation(new Annotation(canvasId));
    }

    addAnnotation(annotation){
        this.items.push(annotation);
    }

    setCanvasId(canvasId){
        this.id = `${canvasId}/page/p1/1`;
        this.items.forEach((annotation) => {
            if (annotation?.setTarget){
                annotation.setTarget(canvasId);
            }
        });
    }

    setId(id){
        this.id = id;
    }

    getAnnotation(index){
        if (index == undefined){
            index = 0;
        }
        return this.items[index];
    }

    getAllAnnotations(){
        return this.items;
    }

    toJSON(){
        return {
            id: this.id,
            type: this.type,
            items: this.items,
        };
    }

} export default AnnotationPage
