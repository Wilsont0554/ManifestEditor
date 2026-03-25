import Label from '../Label'

class SeeAlso{
	ID: string  = "example.text.org";
	type: string;
	label: Label;
	format: string;
	profile: string;

	public constructor(type: string, label: Label, format: string, profile: string){
		this.type = type;
		this.label = label;
		this.format = format;
		this.profile = profile;
	}

};