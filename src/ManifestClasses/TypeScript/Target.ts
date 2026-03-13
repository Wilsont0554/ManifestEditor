class Target{
    type: string;
    source?: [{id: string; type: string}];
    selector: [{type: string; x?: number; y?: number; z?: number; }];

    constructor(){
        this.type = "SpecificResource";
        this.source = [{id : "https://example.org/iiif/scene1", type: "Scene"}]
        this.selector = [{
            type: "PointSelector",
            x: 0,
            y: 0,
            z: 0
        }];
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
        coordinates.push(this.selector[0]?.x!);
        coordinates.push(this.selector[0]?.y!);
        coordinates.push(this.selector[0]?.z!);

        return coordinates;
        
    }

    /*---------------------------------------------------
                        SETTERS
    ---------------------------------------------------*/

    setSelectorType(type: string){
        this.selector[0]!.type = type;
    }

    setX(x: number){
        this.selector[0]!.x = x;
    }
    setY(x: number){
        this.selector[0]!.y = x;
    }
    setZ(x: number){
        this.selector[0]!.z = x;
    }

    getX(){
        return this.selector[0]!.x
    }
    getY(){
        return this.selector[0]!.y
    }
    getZ(){
        return this.selector[0]!.z
    }

    /*---------------------------------------------------
                        REMOVE
    ---------------------------------------------------*/

} export default Target