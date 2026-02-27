import AnnotationPage from './AnnotationPage'

class Container{

    static VALID_TYPES = new Set(['Timeline', 'Canvas', 'Scene']);

    constructor(id, type){
        // Going to need better validation that the input here is a URL
        this.id = id == undefined ? 'https://example.org/manifest_Example.com' : id;
        
        this.type = Container.VALID_TYPES.has(type) ? type : 'Default Type';
        
        if(this.type === 'Timeline') this.duration;
        else if(this.type == 'Canvas') {
            this.width;
            this.height;
        }

        this.items = []; // this would/will contain any of the optional json objects

    }

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

    getWidth(){
        return this.width;
    }

    getHeight(){
        return this.height;
    }

    
} export default Container