import Label from '../Label'
import Camera from './Camera'

class OrthographicCamera extends Camera{
	viewHeight: number;

	public constructor(viewHeight: number, id?: string, type?: string, near?: number, far?: number, label?: Label){
		super()
		type != undefined ? this.setType(type) : undefined;
		id != undefined ? this.setID(id) : undefined;
		near != undefined ? this.setNear(near) : undefined;
		far != undefined ? this.setFar(far) : undefined;
		label != undefined ? this.setLabel(label) : undefined;
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