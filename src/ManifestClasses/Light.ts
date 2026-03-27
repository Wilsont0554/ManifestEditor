import ContentResource from "./ContentResource.ts";
import type {
    IiifContentResource,
    IiifQuantity,
    IiifResourceReference,
} from "@/types/iiif";

interface LightIntensity extends IiifQuantity {
    quantityValue: number;
    unit: string;
}

class Light extends ContentResource {
    color?: string;
    intensity?: LightIntensity;
    lookAt?: IiifResourceReference;
    angle?: number;

    constructor(id: string, type: string) {
        super(id, type, undefined);
    }

    getColor(): string | undefined {
        return this.color;
    }

    getIntensity(): LightIntensity | undefined {
        return this.intensity;
    }

    getLookAtId(): string {
        return this.lookAt?.id ?? "";
    }

    getAngle(): number | undefined {
        return this.angle;
    }

    setColor(color: string): void {
        this.color = color;
    }

    setIntensity(type: string, quantityValue: number, unit: string): void {
        this.intensity = {
            id: this.intensity?.id ?? "",
            type: type as "Quantity",
            quantityValue,
            unit,
        };
    }

    removeIntensity(): void {
        this.intensity = undefined;
    }

    setLookAt(lookID: string, type: string = "Annotation"): void {
        const nextLookId = lookID.trim();

        if (!nextLookId) {
            this.removeLookAt();
            return;
        }

        this.lookAt = {
            id: nextLookId,
            type,
        };
    }

    setAngle(angle: number): void {
        this.angle = angle;
    }

    removeLookAt(): void {
        this.lookAt = undefined;
    }

    removeAngle(): void {
        this.angle = undefined;
    }

    synchronizeDerivedIds(): void {
        if (this.intensity) {
            this.intensity.id = `${this.id}/intensity`;
            this.intensity.type = "Quantity";
        }
    }

    toJSON(): IiifContentResource {
        this.synchronizeDerivedIds();

        const out = this.buildBaseJson();

        if (this.color) {
            out.color = this.color;
        }

        if (this.intensity) {
            out.intensity = this.intensity;
        }

        if (this.lookAt) {
            out.lookAt = this.lookAt;
        }

        if (this.angle !== undefined) {
            out.angle = this.angle;
        }

        return out;
    }
}

export type { LightIntensity };
export default Light;
