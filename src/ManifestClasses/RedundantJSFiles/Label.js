class Label{
    constructor(value, languageCode = 'en'){
        const languageClasses = {
            'en': English,
            'es': Spanish,
            'fr': French,
            'de': German,
            'it': Italian,
            'ru': Russian,
            'zh': Chinese,
            'jp': Japanese,
            'pt': Portuguese,
            'ar': Arabic,
            'hi': Hindi,
            'sv': Swedish,
            'nl': Dutch,
            'ko': Korean,
            'tr': Turkish,
            'vi': Vietnamese
        };
        
        // Make languageClasses non-enumerable so it won't appear in JSON.stringify
        Object.defineProperty(this, 'languageClasses', {
            value: languageClasses,
            enumerable: false,
            writable: false
        });
        
        // Make currentLanguage non-enumerable
        Object.defineProperty(this, 'currentLanguage', {
            value: languageCode,
            enumerable: false,
            writable: true
        });
        
        this.language = new this.languageClasses[languageCode](value);
    }

    changeLabelTest(value){
        this.language.changeValue(value);
    }

    setLanguage(languageCode){
        if(this.languageClasses[languageCode]){
            this.currentLanguage = languageCode;
            // Get the current value before switching (extract from array)
            const currentArray = this.language[Object.keys(this.language)[0]];
            const currentValue = currentArray && currentArray.length > 0 ? currentArray[0] : '';
            this.language = new this.languageClasses[languageCode](currentValue);
        } else {
            console.error(`Language code '${languageCode}' not supported`);
        }
    }

    getLanguage(){
        return this.currentLanguage;
    }

    getValue(){
        const langKey = this.currentLanguage;
        if (this.language && this.language[langKey] && this.language[langKey].length > 0) {
            return this.language[langKey][0];
        }
        return '';
    }

    getSupportedLanguages(){
        return Object.keys(this.languageClasses);
    }
    
    toJSON(){
        // Return the inner language object so JSON shows { "en": ["text"] }
        return this.language;
    }
    
} export default Label

class English{
    constructor(value){
        this.en = value ? [value] : [];
    }
    changeValue(value){
        this.en = value ? [value] : [];
    }
}

class Spanish{
    constructor(value){
        this.sp = value ? [value] : [];
    }
    changeValue(value){
        this.sp = value ? [value] : [];
    }
}

class French{
    constructor(value){
        this.fr = value ? [value] : [];
    }
    changeValue(value){
        this.fr = value ? [value] : [];
    }
}

class German{
    constructor(value){
        this.de = value ? [value] : [];
    } 
    changeValue(value){
        this.de = value ? [value] : [];
    }
}

class Italian{
    constructor(value){
        this.it = value ? [value] : [];
    }
    changeValue(value){
        this.it = value ? [value] : [];
    }
}

class Russian{
    constructor(value){
        this.ru = value ? [value] : [];
    }
    changeValue(value){
        this.ru = value ? [value] : [];
    }
}

class Chinese{
    constructor(value){
        this.zh = value ? [value] : [];
    }
    changeValue(value){
        this.zh = value ? [value] : [];
    }
}

class Japanese{
    constructor(value){
        this.jp = value ? [value] : [];
    }
    changeValue(value){
        this.jp = value ? [value] : [];
    }
}

class Portuguese{
    constructor(value){
        this.pt = value ? [value] : [];
    }
    changeValue(value){
        this.pt = value ? [value] : [];
    }
}

class Arabic{
    constructor(value){
        this.ar = value ? [value] : [];
    }
    changeValue(value){
        this.ar = value ? [value] : [];
    }
}

class Hindi{
    constructor(value){
        this.hi = value ? [value] : [];
    }
    changeValue(value){
        this.hi = value ? [value] : [];
    }
}

class Swedish{
    constructor(value){
        this.sv = value ? [value] : [];
    }
    changeValue(value){
        this.sv = value ? [value] : [];
    }
}

class Dutch{
    constructor(value){
        this.nl = value ? [value] : [];
    }
    changeValue(value){
        this.nl = value ? [value] : [];
    }
}

class Korean{
    constructor(value){
        this.ko = value ? [value] : [];
    }
    changeValue(value){
        this.ko = value ? [value] : [];
    }
}

class Turkish{
    constructor(value){
        this.tr = value ? [value] : [];
    }
    changeValue(value){
        this.tr = value ? [value] : [];
    }
}

class Vietnamese{
    constructor(value){
        this.vi = value ? [value] : [];
    }
    changeValue(value){
        this.vi = value ? [value] : [];
    }
}
