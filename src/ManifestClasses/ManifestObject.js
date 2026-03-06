import Container from './Container.js'
import Annotation from './ContentResource.js';
import Metadata from './Metadata.js';

class ManifestObject{
    constructor(containerType){
        this.id = "https://example.org/to13swr5ws-mlwptp83";
        this.type = "Manifest";
        this.items = [];
        this.addContainer(new Container(this.id, containerType))
        this.metadata = new Metadata();
    }

    addContainer(container){
        this.items.push(container)
    }

    getContainerObj(index){
        if (index == undefined){
            index = 0;
        }
        return this.items[index];
    }

    getMetadata(){
        return this.metadata;
    }

} export default ManifestObject