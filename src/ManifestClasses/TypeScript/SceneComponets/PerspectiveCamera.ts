import Label from '../Label'
import Camera from './Camera'

class PerspectiveCamera extends Camera{
    fieldOfView: number;

    public constructor(fieldOfView: number, id?: string, near?: number, far?: number, label?: Label){
        super();
        this.type = "PerspectiveCamera";
        this.fieldOfView = fieldOfView;
        id != undefined ? this.setID(id) : id = "https://iiif/camera/default.com";
		near != undefined ? this.setNear(near) : 0.0;
		far != undefined ? this.setFar(far) : 0.0;
		label != undefined ? this.setLabel(0, "") : "https://iiif/labelman.com";
    }

/*------------------------------------------------------------
    					GETTERS
--------------------------------------------------------------*/
    getFieldOfView(): number{
        return this.fieldOfView;
    }

/*------------------------------------------------------------
    					SETTERS
--------------------------------------------------------------*/
    setFieldOfView(fieldOfView: number): void{
        this.fieldOfView = fieldOfView;
    }

} export default PerspectiveCamera;