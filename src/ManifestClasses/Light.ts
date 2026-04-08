import ContentResource from "./ContentResource.ts";
import type {
    IiifContentResource,
    IiifQuantity,
    IiifResourceReference,
} from "@/types/iiif";

interface LightIntensity extends IiifQuantity {}

class Light extends ContentResource {
    color?: string;
    intensity?: LightIntensity;
    lookAt?: IiifResourceReference;
    angle?: number;

    constructor(id: string, type: string) {
        super(id, type, undefined);
    }

    setAllLightValues(newLight: Light): void{
        try{
            this.setAllValues(newLight as ContentResource);
            this.color = newLight.color;
            this.angle = newLight.angle;

            this.setIntensity(newLight.intensity?.type as string, Number(newLight.intensity?.value), newLight.intensity?.unit as string);
            if (newLight.lookAt?.id != undefined){
                this.setLookAt(newLight.lookAt?.id as string);
            }
        }catch(e){
            console.log(e);
        }
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
}

export type { LightIntensity };
export default Light;
