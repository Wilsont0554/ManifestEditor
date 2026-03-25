interface TargetSource {
    id: string;
    type: string;
}

interface TargetSelector {
    type: string;
    x?: number;
    y?: number;
    z?: number;
}

class Target {
    type: string;
    source: [TargetSource];
    selector: [TargetSelector];

    constructor(
        sourceId: string = "https://example.org/iiif/scene1",
        sourceType: string = "Scene",
    ) {
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

    getSource(): [TargetSource] {
        return this.source;
    }

    getSelector(): [TargetSelector] {
        return this.selector;
    }

    getCoordinates(): [number, number, number] {
        return [this.getX(), this.getY(), this.getZ()];
    }

    setSelectorType(type: string): void {
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
}

export default Target;
