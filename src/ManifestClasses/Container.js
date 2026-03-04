import AnnotationPage from './AnnotationPage'

class Container{

    static VALID_TYPES = new Set(['Timeline', 'Canvas', 'Scene']);

    constructor(id, type){
        // Going to need better validation that the input here is a URL
        this.id = id == undefined ? 'https://example.org/manifest_Example.com' : id;
        this.type = Container.VALID_TYPES.has(type) ? type : 'Default Type';
        this.items = []; // this would/will contain any of the optional json objects
        this.addAnnotationPage(new AnnotationPage())
    }

/*------------------------------------------------------------
    These delete fields if the user changes manifest types
--------------------------------------------------------------*/

    deleteDimensions(){
        this.height = null;
        this.width = null;
    }

    deleteDuration(){
        this.duration = null;
    }

/*------------------------------------------------------------
                          GETTERS
--------------------------------------------------------------*/   

    getItems(){
        return this.items();
    }

    getType(){
        return this.type;
    }

    getID(){
        return this.id;
    }

    getDuration(){
        return this.duration;
    }

    getDimensions(){
        return [this.height, this.width];
    }

    getAnnotationPage(index){
        if(index == undefined) index = 0;
        return this.items[index];
    }

/*------------------------------------------------------------
                          SETTERS
--------------------------------------------------------------*/
    // This also will server as creating
    // the duration variable
    setDuration(duration){
        this.duration = duration;
    }
    // This also will server as creating
    // the dimesions
    setDimensions(height, width){
        this.height = height;
        this.width = width;
    }

    setType(type){
        this.type = type;
    }

/*------------------------------------------------------------
                Something else
--------------------------------------------------------------*/ 

     addAnnotationPage(annotation){
        this.items.push(annotation);
     }
    
} export default Container