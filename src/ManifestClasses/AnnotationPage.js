import Annotation from "./Annotation";
class AnnotationPage{
    constructor(){
        this.id = "https://example.org/iiif/scene1/page/p1/1";
        this.type = "AnnotationPage";
        this.items = [];
        this.addAnnotation(new Annotation());
    }

    addAnnotation(annotation){
        this.items.push(annotation);
    }

    getAnnotation(index){
        if (index == undefined){
            index = 0;
        }
        return this.items[0];
    }

    getAllAnnotations(){
        return this.items;
    }

} export default AnnotationPage