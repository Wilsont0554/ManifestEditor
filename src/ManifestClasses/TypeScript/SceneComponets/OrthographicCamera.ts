import Label from '../Label'
import Camera from './Camera'

class OrthographicCamera extends Camera{
	viewHeight: number;

	public constructor(viewHeight: number, id?: string, type?: string, near?: number, far?: number, label?: Label){
		super()
		type != undefined ? this.setType(type) : undefined;
		id != undefined ? this.setID(id) : "https://iiif/camera/default.com";
		near != undefined ? this.setNear(near) : 0.0;
		far != undefined ? this.setFar(far) : 0.0;
		label != undefined ? this.setLabel(label) : "https://iiif/labelman.com";
		this.viewHeight = viewHeight;
	}

/*------------------------------------------------------------
    					GETTERS
--------------------------------------------------------------*/
	getViewHeight(): number{
		return this.viewHeight;
	}

/*------------------------------------------------------------
    					SETTERS
--------------------------------------------------------------*/
	setViewHeight(viewHeight: number){
		this.viewHeight = viewHeight;
	}

} export default OrthographicCamera