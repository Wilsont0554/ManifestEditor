import type {
    IiifContainerType,
    IiifPointSelector,
    IiifResourceReference,
    IiifSpecificResource,
} from "@/types/iiif";

class Target {
    id: string;
    type: string;
    source: [IiifResourceReference];
    selector: [IiifPointSelector];

    constructor(
        id: string = "https://example.org/iiif/manifest/1/scene/1/anno/1/target",
        sourceId: string = "https://example.org/iiif/manifest/1/scene/1",
        sourceType: IiifContainerType = "Scene",
    ) {
        this.id = id;
        this.type = "SpecificResource";
        this.source = [{ id: sourceId, type: sourceType }];
        this.selector = [
            {
                type: "PointSelector",
                x: 0,
                y: 0,
                z: 0,
            },
        ];
    }

    setID(id: string): void {
        this.id = id;
    }

    setSource(id: string, type: IiifContainerType): void {
        this.source = [{ id, type }];
    }

    getSource(): [IiifResourceReference] {
        return this.source;
    }

    getSelector(): [IiifPointSelector] {
        return this.selector;
    }

    getCoordinates(): [number, number, number] {
        return [this.getX(), this.getY(), this.getZ()];
    }

    setSelectorType(type: IiifPointSelector["type"]): void {
        this.selector[0].type = type;
    }

    setX(x: number): void {
        this.selector[0].x = x;
    }

    setY(y: number): void {
        this.selector[0].y = y;
    }

    setZ(z: number): void {
        this.selector[0].z = z;
    }

    getX(): number {
        return this.selector[0].x ?? 0;
    }

    getY(): number {
        return this.selector[0].y ?? 0;
    }

    getZ(): number {
        return this.selector[0].z ?? 0;
    }

    toJSON(): IiifSpecificResource {
        return {
            id: this.id,
            type: "SpecificResource",
            source: this.source,
            selector: this.selector,
        };
    }
}

export default Target;
