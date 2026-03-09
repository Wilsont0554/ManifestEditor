import Container from './Container.js';
import Annotation from './ContentResource.js';
import Label from './Label.js';

class UtilityClass{
	this.type = "Example/Blank";

	constructor(type){
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
		retunr this.summaryFields;
	}

/*------------------------------------------------------------
                          SETTERS
--------------------------------------------------------------*/
	// Also creates ID in this context
	setID(id){
		this.ID = id;
	}

	setType(type){
		this.type = type;
	}

	



} export default AgentClass