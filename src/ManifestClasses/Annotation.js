import Label from './Label.js'
import ContentResource from './ContentResource.js';

class Annotation{
    constructor(){
        this.id = "https://example.org/iiif/3d/anno1";
        this.type = "Annotation";
        this.motivation = ["painting"];
        this.body=[];
    }

    addContentResource(contentResource){
        this.body.push(contentResource);
    }

    getContentResource(index){
        if (index == undefined){
            index = 0;
        }
        return this.body[index];
    }

    getAllContentResource(){
        return this.body;
    }

    changeID(value){
        this.id = value;
    }

    getID(){
        return this.id;
    }

    createLabelTest(){
        this.label.push(new Label()); 
    }

    changeLabel(index, value){
        this.label[index].changeLabelTest(value);
    }

    getLabel(index){
        if (index == undefined){
            index = 0;
        }
        return this.label[index];
    }

    getAllLabels(){
        return this.label;
    }

} export default Annotation