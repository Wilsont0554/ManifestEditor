import ContentResource from "./ContentResource";
import type { IiifContentResource } from "@/types/iiif";

const transformContentResourceTypeSet = new Set([
    "RotateTransform",
    "ScaleTransform",
    "TranslateTransform"
]);

export type TransformContentResourceType = "RotateTransform" | "ScaleTransform" | "TranslateTransfrom";

function normalizeTransformType(type: string): TransformContentResourceType {
    if(type === "RotateTransform") return "RotateTransform";
    else if(type === "ScaleTransform") return "ScaleTransform";
    else return "TranslateTransfrom";
}

class Transform extends ContentResource {
    x?: number;
    y?: number;
    z?: number;

    constructor(id:string, type: TransformContentResourceType = "RotateTransform") {
        super(id, normalizeTransformType(type), undefined);
        this.setType(type);
    }

    static isTransformType(type: string): type is TransformContentResourceType {
        return transformContentResourceTypeSet.has(type);
    }

    override setType(type: string): void {
        const normalizedType = normalizeTransformType(type);

        super.setType(normalizedType);
    }

    override getType(): TransformContentResourceType {
        return normalizeTransformType(super.getType());
    }

    setX(x?: number): void {
        this.x = x;
    }

    getX(): number | undefined {
        return this.x;
    }

    removeX(): void {
        this.x = undefined;
    }

    setY(y?: number): void {
        this.y = y;
    }

    getY(): number | undefined {
        return this.y;
    }

    removeY(): void {
        this.y = undefined;
    }

    setZ(z?: number): void {
        this.z = z;
    }

    getZ(): number | undefined {
        return this.z;
    }

    removeZ(): void {
        this.z = undefined;
    }

    override toJSON(): IiifContentResource {
        const out = this.buildBaseJson();

        if(this.x !== undefined){
            out.x = this.x;
        }

        if(this.y !== undefined){
            out.y = this.x;
        }

        if(this.z !== undefined){
            out.z = this.z;
        }

        return out;
    }
} export default Transform;