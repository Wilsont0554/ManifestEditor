import Label from '../Label'
import Camera from './Camera'

class OrthographicCamera extends Camera{
	viewHeight: number;

	public constructor(id: string, type: string, near: number, far: number, viewHeight: number, label: Label){
		super()
		if(type != undefined) this.setType(type);
		if(id != undefined) this.setID(id);
		if(near != undefined) this.setNear(near);
		if(far != undefined) this.setFar(far);
		if(label != undefined) this.setLabel(label);
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