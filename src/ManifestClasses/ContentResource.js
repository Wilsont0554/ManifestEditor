import Label from './Label.js'

class ContentResource{
    constructor(id, type, format){
        this.id = id;
        this.type = type;
        this.format = format;
        this.label=[];
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

} export default ContentResource