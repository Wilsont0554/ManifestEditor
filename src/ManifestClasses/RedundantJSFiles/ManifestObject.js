import Container from './Container.js'
import Annotation from './ContentResource.js';

class ManifestObject{
    constructor(containerType){
        this.id = "https://example.org/to13swr5ws-mlwptp83";
        this.type = "Manifest";
        this.items = [];
        this.addContainer(new Container(this.id, containerType))
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

} export default ManifestObject