import Container from './Container.ts';
import Metadata from './Metadata.ts';

class ManifestObject {
    id: string;
    type: string;
    items: Container[];
    metadata?: Metadata;

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

    getMetadata(): Metadata {
        if (!this.metadata) {
            this.metadata = new Metadata();
        }
        return this.metadata;
    }
}

export default ManifestObject;
