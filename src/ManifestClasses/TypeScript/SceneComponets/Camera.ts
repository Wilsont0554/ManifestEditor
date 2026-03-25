import Label from '../Label'


abstract class Camera{
	type: string = "Default_Value";
	id?: string;
	label?: Label;
	// lookAt?: LookAt;
	near?: number;
	far?: number;

/*------------------------------------------------------------
    						ADD/CREATE
--------------------------------------------------------------*/

	addLabel(value: string, languageCode: string = 'en'): void{
		this.label = new Label(value, languageCode);
	}

/*------------------------------------------------------------
    						DELETE
--------------------------------------------------------------*/

	deleteLabel(): void{
		delete this.label;
	}
/*------------------------------------------------------------
    						SETTERS
--------------------------------------------------------------*/
	setType(type: string){
		this.type = type;
	}

	setID(id: string){
		this.id = id;
	}

	setLabel(label: Label){
		this.label = label;
	}

	setNear(near: number){
		this.near = near;
	}

	setFar(far: number){
		this.far = far;
	}
/*------------------------------------------------------------
    						GETTERS
--------------------------------------------------------------*/
	getType(): string{
		return this.type;
	}

	getID(){
		return this.id;
	}

	getLabel(){
		return this.label;
	}

	getNear(){
		return this.near;
	}

	getFar(){
		return this.far;
	}
}

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

} export default Camera