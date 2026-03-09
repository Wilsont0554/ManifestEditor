import Container from './Container.js';
import Annotation from './ContentResource.js';
import Label from './Label.js';

class UtilityClass{
	let type: string = "Agent Super Man";
	let label: Label;

	public constructor(type: string){
		this.type = type;
		this.label = new Label('English', 'en');
	}

/*------------------------------------------------------------
    These delete fields if the user changes manifest types
--------------------------------------------------------------*/
	deleteHomePage(){
		delete this.homePage;
	}

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
		return this.ID;
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

	





} export default AgentClass