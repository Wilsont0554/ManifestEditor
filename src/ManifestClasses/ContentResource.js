import Label from './Label.js'

class ContentResource{
    constructor(id, type, format){
        this.id = id;
        this.type = type;
        this.format = format;
        this.label;
    }

/*---------------------------------------------------
                    SETTERS
---------------------------------------------------*/
    setID(value){
        this.id = value;
    }

    setType(type){
        this.type = type;
    }

    setFormat(format){
        this.format = format;
    }

    setDimensions(height, width){
        this.height = height;
        this.width = width;
    }

    setLabel(index, value){
        this.label[index].changeLabelTest(value);
    }
    
    createLabel(languageCode = 'en'){
        this.label = new Label('', languageCode); 
    }

    setDuration(duration){
        this.duration = duration;
    }

    setSummary(summary){
        this.summary = summary;
    }

/*---------------------------------------------------
                    GETTERS
---------------------------------------------------*/

    //returns as 0:height, 1:width
    getDimensions(){
        return [this.height, this.width];
    }

    changeLabel(index, value, languageCode){
        this.label.changeLabelTest(value);
        if(languageCode){
            this.label.setLanguage(languageCode);
        }
    }

    getLabel(index){
        if (index == undefined){
            index = 0;
        }
        return this.label;
    }
    
    getAllLabels(){
        return this.label;
    }

    getType(){
        return this.type;
    }

    getFormat(){
        return this.format;
    }

    getDuration(){
        return this.duration;
    }

    getSummary(){
        return this.summary;
    }


} export default ContentResource