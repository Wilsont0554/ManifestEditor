import Label from './TypeScript/Label.ts';

class AgentClass{
	let type: string = "Agent Super Man";
	let label: Label;
	// let logo?: Logo;
	// let homePage?: HomePage; // HomePage type might need to be updated for syntax
	let ID?: string;
	// let seeAlso?: SeeAlso;
	let summary?: string;

	public constructor(type: string){
		this.type = type;
		this.label = this.createLabel("en");
	}

/*------------------------------------------------------------
    					DELETE FIELDS
--------------------------------------------------------------*/
	/* deleteHomePage(){
		delete this.homePage; // trent is making homepage.
	} */

	deleteID(){
		delete this.ID;
	}

	deleteLogo(){
		delete this.logo;
	}

	deleteSeeAlso(){
		delete this.seeAlso;
	}

	deleteSummary(){
		delete this.summary;
	}

/*------------------------------------------------------------
                          GETTERS
--------------------------------------------------------------*/
	getID(): string{
		return this.ID != undefined ? this.ID : "Default_ID_Field";
	}

	getLabel(): Label{
		return this.label;
	}

	getHomePage(): HomePage{
		return this.homePage;
	}

	getLogo(): Logo{
		return this.logo;
	}

	getSeeAlso(): SeeAlso{
		return this.seeAlso;
	}

	getSummaryFields(): string{
		return this.summary;
	}

/*------------------------------------------------------------
                          SETTERS
--------------------------------------------------------------*/
	// Also creates ID in this context
	setID(inputID: string){
		if(this.ID == undefined) let id: string = inputID;
		else this.ID = inputID;
	}

	setType(type: string){
		this.type = type;
	}

/*------------------------------------------------------------
                          CREATE
--------------------------------------------------------------*/	

	createLabel(languageCode: string = 'en'): Label {
		return new Label('', languageCode);
	}

} export default AgentClass