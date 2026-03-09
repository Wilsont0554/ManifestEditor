import Container from './Container.ts';
import Annotation from './ContentResource.ts';

class ManifestObject {
    id: string;
    type: string;
    items: Container[];

    constructor(containerType: string) {
        this.id = "https://example.org/to13swr5ws-mlwptp83";
        this.type = "Manifest";
        this.items = [];
        this.addContainer(new Container(this.id, containerType));
    }
    
    addContainer(container: Container): void {
        this.items.push(container);
    }

    getContainerObj(index?: number): Container {
        if (index === undefined) {
            index = 0;
        }
        return this.items[index];
    }
}

export default ManifestObject;