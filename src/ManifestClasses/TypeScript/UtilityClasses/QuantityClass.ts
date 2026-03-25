import Label from '../Label'

class Quantity{
	type: string = "Quantity";
	quantityValue: number;
	unit: string;
	ID?: string;
	quantityLabel?: Label;

	public constructor(value: number, unit: string){
		this.quantityValue = value;
		this.unit = unit;
	}

/*------------------------------------------------------------
    					DELETE FIELDS
--------------------------------------------------------------*/

	public deleteID(){ delete this.ID; }	

	public deleteLabel(){ delete this.quantityLabel; }

/*------------------------------------------------------------
    					GETTERS
--------------------------------------------------------------*/

	public getType(): string{ 
		return this.type; 
	}

	public getQuantityValue(): number{
		return this.quantityValue;
	}

	public getUnit(): string{
		return this.unit;
	}

	public getID(){
		return this.ID;
	}

	public getLabel(){
		return this.quantityLabel;
	}

/*------------------------------------------------------------
    					SETTERS
--------------------------------------------------------------*/

	/**
	 * public setType(type: string){
	 * this.type = type;
	 * }
	 * Shouldn't be able to change the type since it is only quantity.
	 */

	public setQuantityValue(value: number){
		this.quantityValue = value;
	}

	public setUnit(unit: string){
		this.unit = unit;
	}

	public setID(ID: string){
		this.ID = ID;
	}

/*------------------------------------------------------------
                          CREATE
--------------------------------------------------------------*/	

	createLabel(languageCode: string = 'en'): Label {
		return new Label('', languageCode);
	}


}