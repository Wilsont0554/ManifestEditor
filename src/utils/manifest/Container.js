import AnnotationPage from './AnnotationPage'

class Container{
    constructor(type){
        this.type = type;
        this.items = [];
        this.addAnnotationPage(new AnnotationPage());
    }

    addAnnotationPage(annotationPage){
        this.items.push(annotationPage)
    }

    getAnnotationPage(index){
        if (index == undefined){
            index = 0;
        }
        return this.items[index];
    }

    setType(type){
        this.type = type;
    }

    getType(){
        return this.type;
    }
} export default Container