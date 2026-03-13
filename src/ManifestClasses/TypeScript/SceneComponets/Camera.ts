import Label from '../ManifestClasses/TypeScript/Label.ts'


abstract class Camera{
	let type: string;
	let id?: string;
	let label?: Label;
	let lookAt?: LookAt;
	let near?: number;
	let far?: number;

	public constructor(type: string, id?: string, near?: number, far?: number){
		this.type = type;
		id == undefined ? this.id = "Default" : this.id = id;
		near == undefined ? this.near = 0.0 : this.near = near;
		far == undefined ? this.far = 0.0 : this.far = far;
	}

	addLabel(value: string, languageCode: string = 'en'): void{
		this.label = new Label(value, languageCode);
	}

	deleteLabel(): void{
		delete this.Label;
	}

}

class OrthographicCamera extends Camera{
	Camera.type = "OrthographicCamera";
	let viewHeight: number = 0.0;

	public constructor(type: string, id?: string, near?: number, far?: number, viewHeight: number){
		this.type = type;
		id == undefined ? this.id = "Default" : this.id = id;
		near == undefined ? this.near = 0.0 : this.near = near;
		far == undefined ? this.far = 0.0 : this.far = far;
		this.viewHeight = viewHeight;
	}

	getType(): string{
		return this.type;
	}


}