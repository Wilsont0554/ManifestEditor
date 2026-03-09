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

    setIntensity(type, quantityValue, unit){
        this.intensity = {
            "type" : type,
            "quantityValue" : quantityValue,
            "unit" : unit
        }
    }

    setLookAt(lookID){
        this.lookAt = {
            "id" : lookID
        };
    }

/*---------------------------------------------------
                    REMOVE
---------------------------------------------------*/

    removeLookAt(){
        this.lookAt = undefined;
    }

} export default Light