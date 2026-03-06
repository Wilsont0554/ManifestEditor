import ContentResource from "./ContentResource";

class Light extends ContentResource{
    constructor(id, type){
        super(id, type);
    }

/*---------------------------------------------------
                    Getters
---------------------------------------------------*/
    getColor(){
        return this.color
    }

    getIntensity(){
        return this.intensity;
    }

/*---------------------------------------------------
                    SETTERS
---------------------------------------------------*/

    setColor(color){
        this.color = color;
    }

    setIntensity(intensity){
        this.intensity = intensity;
    }

} export default Light