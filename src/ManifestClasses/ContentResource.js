import Label from './Label.js'

class ContentResource{
    constructor(id, type, format){
        this.id = id;
        this.type = type;
        this.format = format;
        this.label=[];
    }

/*---------------------------------------------------
                    SETTERS
---------------------------------------------------*/
    setID(value){
        this.id = value;
    }

    setDimensions(height, width){
        this.height = height;
        this.width = width;
    }

    setLabel(index, value){
        this.label[index].changeLabelTest(value);
    }

    createLabel(){
        this.label.push(new Label()); 
    }

    setDuration(duration){
        this.duration = duration;
    }

/*---------------------------------------------------
                    GETTERS
---------------------------------------------------*/

    //returns as 0:height, 1:width
    getDimensions(){
        return [this.height, this.width];
    }

    //returns as 0:x, 1:y, 2:z
    getCoordinates(){
        return [this.x,this.y, this.z];
    }

    getID(){
        return this.id;
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

    getDuration(){
        return this.duration;
    }

} export default ContentResource