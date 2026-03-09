import Container from './Container.ts';
import Annotation from './ContentResource.ts';
import Label from './Label.ts';

class AgentClass{
	let type: string = "Agent Super Man";
	let label: Label;

	public constructor(type: string){
		this.type = type;
		this.label = this.createLabel("en");
	}

/*------------------------------------------------------------
    These delete fields if the user changes manifest types
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

	deleteSummaryFields(){
		delete summaryFields;
	}

/*------------------------------------------------------------
                          GETTERS
--------------------------------------------------------------*/
	getID(){
		return this.ID != undefined ? this.ID : "DefaultIDField";
	}

	getLabel(){
		return this.label;
	}

	getHomePage(){
		return this.homePage;
	}

	getLogo(){
		return this.logo;
	}

	getSeeAlso(){
		return this.seeAlso;
	}

	getSummaryFields(){
		return this.summaryFields;
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