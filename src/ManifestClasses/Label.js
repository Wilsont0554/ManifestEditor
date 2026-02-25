class Label{
    constructor(value){
        this.language = new English(value);
    }

    changeLabelTest(value){
        this.language.changeValue(value);
    }
    
} export default Label

class English{
    constructor(value){
        this.en = value;
    }
    changeValue(value){
        this.en = value;
    }
}