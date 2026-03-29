import ContentResource from "./ContentResource";

class Light extends ContentResource {
    color?: string;
    intensity?: { type: string; value: number; unit: string };
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

    getIntensity(): { type: string; value: number; unit: string } | undefined {
        return this.intensity;
    }

    /*---------------------------------------------------
                        SETTERS
    ---------------------------------------------------*/
    setColor(color: string): void {
        this.color = color;
    }

    setIntensity(type: string, value: number, unit: string): void {
        this.intensity = {
            type: type,
            value: value,
            unit: unit
        };
    }

    setLookAt(lookID: string): void {
        this.lookAt = {
            id: lookID
        };
    }

    setType(type: string){
        if (type != "DirectionalLight"){
            this.lookAt = undefined;
        }
        if (type != "SpotLight"){
            this.angle = undefined;
        }
        this.type = type;
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