import Container from './Container.ts';
import Annotation from './ContentResource.ts';
import Metadata from './Metadata.ts';

class ManifestObject {
    id: string;
    type: string;
    items: Container[];
    metadata: Metadata | undefined;

    constructor(containerType: string) {
        this.id = "https://example.org/iiif/3d/model_origin.json";
        this.type = "Manifest";
        this.items = [];
        this.metadata = undefined;
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

    getMetadata(): Metadata | undefined {
        return this.metadata;
    }
}

export default ManifestObject;