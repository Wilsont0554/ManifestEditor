import AnnotationPage from './AnnotationPage'

class Container{

    static VALID_TYPES = new Set(['Timeline', 'Canvas', 'Scene']);

    constructor(id, type){
        // Going to need better validation that the input here is a URL
        this.id = id == undefined ? "https://example.org/manifest_Example.com" : id;
        
        if(Container.VALID_TYPES.has(type)) {
            this.type = type;
        }
        else this.type = "Default Type"; // shouldnt reach here would require validation before hand

        this.items = []; // this would/will contain any of the optional json objects

    }

    getItems(){
        return Container.items();
    }

    getType(){
        return Container.type;
    }

    getID(){
        return Container.id;
    }

    
} export default Container