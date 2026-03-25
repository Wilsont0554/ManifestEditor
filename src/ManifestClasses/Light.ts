import ContentResource from "./ContentResource.ts";

interface LightIntensity {
    type: string;
    quantityValue: number;
    unit: string;
}

class Light extends ContentResource {
    color?: string;
    intensity?: LightIntensity;
    lookAt?: { id: string };
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
            type,
            quantityValue,
            unit,
        };
    }

    removeIntensity(): void {
        this.intensity = undefined;
    }

    setLookAt(lookID: string): void {
        const nextLookId = lookID.trim();

        if (!nextLookId) {
            this.removeLookAt();
            return;
        }

        this.lookAt = {
            id: nextLookId,
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
}

export type { LightIntensity };
export default Light;
