class Target{
    id: string;
    type?: string;
    source?: {id: string; type: string};
    selector: {type: string; x?: number; y?: number; z?: number; };

    constructor(id: string){
        this.type = "Scene";
        this.selector = {
            type: "Scene",
            x: 0,
            y: 0,
            z: 0
        };
        this.id = id;
    }

    /*---------------------------------------------------
                        GETTERS
    ---------------------------------------------------*/
    getSource(){
        return this.source;
    }

    getSelector(){
        return this.selector;
    }

    getCoordinates(){
        const coordinates: number[] = [];
        coordinates.push(this.selector?.x!);
        coordinates.push(this.selector?.y!);
        coordinates.push(this.selector?.z!);

        return coordinates;
        
    }

    /*---------------------------------------------------
                        SETTERS
    ---------------------------------------------------*/

    setSelectorType(type: string){
        this.selector!.type = type;
    }

    setCoordinates(x: number, y: number, z: number){
        this.selector!.x = x;
        this.selector!.y = y;
        this.selector!.z = z;
    }

    /*---------------------------------------------------
                        REMOVE
    ---------------------------------------------------*/

} export default Target