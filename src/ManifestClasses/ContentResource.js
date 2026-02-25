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

    createLabelTest(languageCode = 'en'){
        this.label.push(new Label('', languageCode)); 
    }

    changeLabel(index, value, languageCode){
        this.label[index].changeLabelTest(value);
        if(languageCode){
            this.label[index].setLanguage(languageCode);
        }
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