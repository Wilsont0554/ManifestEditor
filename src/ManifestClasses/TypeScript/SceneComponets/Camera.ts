import Label from '../Label'


abstract class Camera{
	type: string = "DefaultCamera"; // camera type ortho or perspective
	id?: string;
	label?: Label;
	// lookAt?: LookAt; // needs to be created
	near?: number; // floating point number // see bottom of file
	far?: number; // floating point number // see bottom of file
	// interactionMode?: InteractionMode // needs to be created

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

	deleteID(){
		delete this.id;
	}

	deleteNear(){
		delete this.near;
	}

	deleteFar(){
		delete this.far;
	}

	// deleteLookAt(){
	// 	delete this.lookAt;
	// }

	// deleteInteractionMode(){
	// 	delete this.interactionMode;
	// }
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

	// setLookAt(lookAt: LookAt){
	// 	this.lookAt = lookAt;
	// }

	// setInteractionMode(interactionMode: InteractionMode){
	// 	this.interactionMode = interactionMode;
	// }
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

	// getLookAt(){
	// 	return this.lookAt;
	// }

	// getInteractionMode(){
	// 	return this.interactionMode;
	// }
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