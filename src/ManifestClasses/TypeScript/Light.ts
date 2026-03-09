import ContentResource from "./ContentResource";

class Light extends ContentResource {
    color?: string;
    intensity?: { type: string; quantityValue: number; unit: string };
    lookAt?: { id: string };

    constructor(id: string, type: string) {
        super(id, type, "");
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

    /*---------------------------------------------------
                        REMOVE
    ---------------------------------------------------*/
    removeLookAt(): void {
        this.lookAt = undefined;
    }
}

export default Light;