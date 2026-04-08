import type { IiifTransForm } from "@/types/iiif";

const transformTypeSet = new Set([
    "RotateTransform",
    "ScaleTransform",
    "TranslateTransform"
]);

export type TransformType = "RotateTransform" | "ScaleTransform" | "TranslateTransfrom";

function normalizeTransformType(type: string): TransformType {
    if(type === "ScaleTransform" || type === "TranslateTransform") {
        return type;
    }
    else return "RotateTransfrom";
}

class Transform {
    type: TransformType;
    x?: number;
    y?: number;
    z?: number;

    constructor(type: TransformType = "RotateTransform") {
        this.type = normalizeTransformType(type);
    }

    static isTransformType(type: string): type is TransformType {
        return transformTypeSet.has(type);
    }

    setType(type: string): void {
        this.type = normalizeTransformType(type);
    }

    getType(): TransformType {
        return this.type;
    }

    setX(x?: number): void {
        this.x = x;
    }

    getX(): number | undefined {
        return this.x;
    }

    setY(y?: number): void {
        this.y = y;
    }

    getY(): number | undefined {
        return this.y;
    }

    setZ(z?: number): void {
        this.z = z;
    }

    getZ(): number | undefined {
        return this.z;
    }

    toJSON(): IiifTransForm {
        const out: IiifTransForm = {
            type: this.type,
        };

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