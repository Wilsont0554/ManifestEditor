class Label {
    private languageClasses: { [key: string]: any };
    private currentLanguage?: string;
    public language: any;

    constructor(value: string, languageCode: string = 'en') {
        this.languageClasses = {
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

        Object.defineProperty(this, 'languageClasses', {
            value: this.languageClasses,
            enumerable: false,
            writable: false
        });

        Object.defineProperty(this, 'currentLanguage', {
            value: languageCode,
            enumerable: false,
            writable: true
        });

        this.language = new this.languageClasses[languageCode](value);
    }

    changeLabelTest(value: string) {
        this.language.changeValue(value);
    }

    setLanguage(languageCode: string) {
        if (this.languageClasses[languageCode]) {
            this.currentLanguage = languageCode;
            const currentArray = this.language[Object.keys(this.language)[0]];
            const currentValue = currentArray && currentArray.length > 0 ? currentArray[0] : '';
            this.language = new this.languageClasses[languageCode](currentValue);
        } else {
            console.error(`Language code '${languageCode}' not supported`);
        }
    }

    getLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return Object.keys(this.languageClasses);
    }

    toJSON() {
        return this.language;
    }
}

export default Label;

class English {
    public en: string[];

    constructor(value: string) {
        this.en = value ? [value] : [];
    }

    changeValue(value: string) {
        this.en = value ? [value] : [];
    }
}

class Spanish {
    public sp: string[];

    constructor(value: string) {
        this.sp = value ? [value] : [];
    }

    changeValue(value: string) {
        this.sp = value ? [value] : [];
    }
}

class French {
    public fr: string[];

    constructor(value: string) {
        this.fr = value ? [value] : [];
    }

    changeValue(value: string) {
        this.fr = value ? [value] : [];
    }
}

class German {
    public de: string[];

    constructor(value: string) {
        this.de = value ? [value] : [];
    }

    changeValue(value: string) {
        this.de = value ? [value] : [];
    }
}

class Italian {
    public it: string[];

    constructor(value: string) {
        this.it = value ? [value] : [];
    }

    changeValue(value: string) {
        this.it = value ? [value] : [];
    }
}

class Russian {
    public ru: string[];

    constructor(value: string) {
        this.ru = value ? [value] : [];
    }

    changeValue(value: string) {
        this.ru = value ? [value] : [];
    }
}

class Chinese {
    public zh: string[];

    constructor(value: string) {
        this.zh = value ? [value] : [];
    }

    changeValue(value: string) {
        this.zh = value ? [value] : [];
    }
}

class Japanese {
    public jp: string[];

    constructor(value: string) {
        this.jp = value ? [value] : [];
    }

    changeValue(value: string) {
        this.jp = value ? [value] : [];
    }
}

class Portuguese {
    public pt: string[];

    constructor(value: string) {
        this.pt = value ? [value] : [];
    }

    changeValue(value: string) {
        this.pt = value ? [value] : [];
    }
}

class Arabic {
    public ar: string[];

    constructor(value: string) {
        this.ar = value ? [value] : [];
    }

    changeValue(value: string) {
        this.ar = value ? [value] : [];
    }
}

class Hindi {
    public hi: string[];

    constructor(value: string) {
        this.hi = value ? [value] : [];
    }

    changeValue(value: string) {
        this.hi = value ? [value] : [];
    }
}

class Swedish {
    public sv: string[];

    constructor(value: string) {
        this.sv = value ? [value] : [];
    }

    changeValue(value: string) {
        this.sv = value ? [value] : [];
    }
}

class Dutch {
    public nl: string[];

    constructor(value: string) {
        this.nl = value ? [value] : [];
    }

    changeValue(value: string) {
        this.nl = value ? [value] : [];
    }
}

class Korean {
    public ko: string[];

    constructor(value: string) {
        this.ko = value ? [value] : [];
    }

    changeValue(value: string) {
        this.ko = value ? [value] : [];
    }
}

class Turkish {
    public tr: string[];

    constructor(value: string) {
        this.tr = value ? [value] : [];
    }

    changeValue(value: string) {
        this.tr = value ? [value] : [];
    }
}

class Vietnamese {
    public vi: string[];

    constructor(value: string) {
        this.vi = value ? [value] : [];
    }

    changeValue(value: string) {
        this.vi = value ? [value] : [];
    }
}