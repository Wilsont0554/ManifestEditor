import ContentResource from "./ContentResource.ts";
import type {
    IiifContentResource,
    IiifQuantity,
    IiifResourceReference,
} from "@/types/iiif";

type LightIntensity = IiifQuantity;

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

    setIntensity(type: string, value: number, unit: string): void {
        this.intensity = {
            type: type as "Value",
            value,
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
            this.intensity.type = "Value";
        }
    }

    override clone(): Light {
        const nextLight = this.cloneBaseProperties(
            new Light(this.id, this.type),
        );

        nextLight.color = this.color;
        nextLight.intensity = this.intensity
            ? { ...this.intensity }
            : undefined;
        nextLight.lookAt = this.lookAt ? { ...this.lookAt } : undefined;
        nextLight.angle = this.angle;

        return nextLight;
    }
}

export type { LightIntensity };
export default Light;
