import type { IiifLanguageMap } from "@/types/iiif";

type LanguageFactory = new (value: string) => {
    changeValue(value: string): void;
};

function normalizeLanguageCode(languageCode: string): string {
    if (languageCode === "jp") {
        return "ja";
    }

    return languageCode;
}

class Label {
    public languageClasses: Record<string, LanguageFactory>;
    public currentLanguage?: string;
    public language: {
        changeValue(value: string): void;
    };

    constructor(value: string, languageCode: string = 'en') {
        this.languageClasses = {
            'en': English,
            'es': Spanish,
            'fr': French,
            'de': German,
            'it': Italian,
            'ru': Russian,
            'zh': Chinese,
            'ja': Japanese,
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

        const normalizedLanguageCode = normalizeLanguageCode(languageCode);
        this.currentLanguage = normalizedLanguageCode;
        this.language = new this.languageClasses[normalizedLanguageCode](value);
    }

    changeLabelTest(value: string) {
        this.language.changeValue(value);
    }

    setLanguage(languageCode: string) {
        const normalizedLanguageCode = normalizeLanguageCode(languageCode);

        if (this.languageClasses[normalizedLanguageCode]) {
            const currentLanguage = this.currentLanguage;
            const currentRecord = this.language as Record<string, unknown>;
            const currentArray = currentLanguage ? currentRecord[currentLanguage] : undefined;
            const currentValue = Array.isArray(currentArray) && typeof currentArray[0] === 'string'
                ? currentArray[0]
                : '';

            this.currentLanguage = normalizedLanguageCode;
            this.language = new this.languageClasses[normalizedLanguageCode](currentValue);
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

    getValue() {
        if (!this.currentLanguage) {
            return '';
        }

        const currentValue = (this.language as Record<string, unknown>)[this.currentLanguage];

        return Array.isArray(currentValue) && currentValue.length > 0
            ? String(currentValue[0])
            : '';
    }

    hasValue() {
        return this.getValue().length > 0;
    }

    toJSON(): IiifLanguageMap {
        return this.language as unknown as IiifLanguageMap;
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
    public es: string[];

    constructor(value: string) {
        this.es = value ? [value] : [];
    }

    changeValue(value: string) {
        this.es = value ? [value] : [];
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
    public ja: string[];

    constructor(value: string) {
        this.ja = value ? [value] : [];
    }

    changeValue(value: string) {
        this.ja = value ? [value] : [];
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
