import Label from './Label.js'
import ContentResource from './ContentResource.js';

class Annotation{
    constructor(){
        this.id = "https://example.org/iiif/3d/anno1";
        this.type = "Annotation";
        this.motivation = ["painting"];
        this.body=[];
        this.target = "https://example.org/iiif/scene1/page/p1/1";
        this.label;
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

    setLabel(index, value){
        this.label.changeLabelTest(value);
    }
    
    createLabel(languageCode = 'en'){
        this.label = (new Label('', languageCode)); 
    }

    changeLabel(index, value, languageCode){
        this.label.changeLabelTest(value);
        if(languageCode){
            this.label.setLanguage(languageCode);
        }
    }

    getLabel(){
        return this.label;
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
        this.label = new Label(); 
    }

    getAllLabels(){
        return this.label;
    }

} export default Annotation