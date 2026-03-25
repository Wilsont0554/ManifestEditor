import ContentResource from "./ContentResource";

class Light extends ContentResource {
    color?: string;
    intensity?: { type: string; quantityValue: number; unit: string };
    lookAt?: { id: string };
    angle?: number;

    constructor(id: string, type: string) {
        super(id, type, "");
        this.setFormat(undefined);
    }

    /*---------------------------------------------------
                        Getters
    ---------------------------------------------------*/
    getColor(): string | undefined {
        return this.color;
    }

    getIntensity(): { type: string; quantityValue: number; unit: string } | undefined {
        return this.intensity;
    }

    /*---------------------------------------------------
                        SETTERS
    ---------------------------------------------------*/
    setColor(color: string): void {
        this.color = color;
    }

    setIntensity(type: string, quantityValue: number, unit: string): void {
        this.intensity = {
            type: type,
            quantityValue: quantityValue,
            unit: unit
        };
    }

    setLookAt(lookID: string): void {
        this.lookAt = {
            id: lookID
        };
    }

    setAngle(angle: number): void{
        this.angle = angle;
    }

    /*---------------------------------------------------
                        REMOVE
    ---------------------------------------------------*/
    removeLookAt(): void {
        this.lookAt = undefined;
    }

    removeAngle(): void{
        this.angle = undefined;
    }
}

export default Light;