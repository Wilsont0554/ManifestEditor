import AnnotationPage from './AnnotationPage'

class Container{

    static VALID_TYPES = new Set(['timeline', 'canvas', 'scene']);

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
        delete this.height;
        delete this.width;
    }

    deleteDuration(){
        delete this.duration;
    }

/*------------------------------------------------------------
                          GETTERS
--------------------------------------------------------------*/   

    getItems(){
        return this.items;
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
        if(type == "canvas"){
            this.setDimensions(0,0);
            this.deleteDuration();
        }
        else if(type == "timeline"){
            this.setDuration(0);
            this.deleteDimensions();
        }
        else{ // Scene
            this.deleteDimensions();
            this.deleteDuration();
        }
    }

/*------------------------------------------------------------
                Something else
--------------------------------------------------------------*/ 

     addAnnotationPage(annotation){
        this.items.push(annotation);
     }

     toJSON() {
        const out = {
            id: this.id,
            type: this.type,
        };

        if(this.type === "timeline" && this.duration !== undefined) {
            out.duration = this.duration;
        }

        if(this.type === "canvas" && this.height !== undefined && this.width !== undefined){
            out.height = this.height;
            out.width = this.width;
        }
        out.item = this.items;
        return out;
     }
    
} export default Container