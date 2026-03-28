import Label from '../Label'


abstract class Camera{
	type: string = "DefaultCamera"; // camera type ortho or perspective
	id?: string;
	label?: Label;
	// lookAt?: LookAt; // needs to be created
	near?: number; // floating point number 
	far?: number; // floating point number 
	// interactionMode?: InteractionMode // needs to be created

	public constructor(){
		this.label = this.createLabel("en");
		this.id = "https://example.org/iiif/3d/cameras/1";
	};

/*------------------------------------------------------------
    						LABEL
--------------------------------------------------------------*/

    setLabel(index: number, value: string): void {
        this.label?.changeLabelTest(value);
    }

    createLabel(languageCode: string = 'en'): Label {
        return new Label('', languageCode);
    }

    changeLabel(index: number, value: string, languageCode?: string): void {
        this.label?.changeLabelTest(value);
        if (languageCode) {
            this.label?.setLanguage(languageCode);
        }
    }

    getLabel(index?: number): Label | undefined {
        if (index === undefined) {
            index = 0;
        }

        return this.label;
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

} export default Camera