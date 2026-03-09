import { supportedLanguageCodes, type IiifLanguageMap, type SupportedLanguageCode } from "../../types/iiif";

class SingleLanguageValue {
  #languageCode: SupportedLanguageCode;
  [key: string]: unknown;

  constructor(languageCode: SupportedLanguageCode, value: string) {
    this.#languageCode = languageCode;
    this.changeValue(value);
  }

  changeValue(value: string): void {
    this[this.#languageCode] = value ? [value] : [];
  }

  getValue(): string {
    const currentValue = this[this.#languageCode];

    if (!Array.isArray(currentValue) || currentValue.length === 0) {
      return "";
    }

    return typeof currentValue[0] === "string" ? currentValue[0] : "";
  }

  toJSON(): IiifLanguageMap {
    const currentValue = this[this.#languageCode];

    return {
      [this.#languageCode]: Array.isArray(currentValue) ? [...(currentValue as string[])] : [],
    };
  }
}

function isSupportedLanguageCode(languageCode: string): languageCode is SupportedLanguageCode {
  return supportedLanguageCodes.includes(languageCode as SupportedLanguageCode);
}

class Label {
  language: SingleLanguageValue;
  #currentLanguage: SupportedLanguageCode;

  constructor(value = "", languageCode: string = "en") {
    const nextLanguageCode = isSupportedLanguageCode(languageCode) ? languageCode : "en";

    this.#currentLanguage = nextLanguageCode;
    this.language = new SingleLanguageValue(nextLanguageCode, value);
  }

  changeLabelTest(value: string): void {
    this.language.changeValue(value);
  }

  setLanguage(languageCode: string): void {
    if (!isSupportedLanguageCode(languageCode)) {
      console.error(`Language code '${languageCode}' not supported`);
      return;
    }

    const currentValue = this.language.getValue();
    this.#currentLanguage = languageCode;
    this.language = new SingleLanguageValue(languageCode, currentValue);
  }

  getLanguage(): SupportedLanguageCode {
    return this.#currentLanguage;
  }

  getSupportedLanguages(): SupportedLanguageCode[] {
    return [...supportedLanguageCodes];
  }

  getValue(): string {
    return this.language.getValue();
  }

  toJSON(): IiifLanguageMap {
    return this.language.toJSON();
  }
}

export default Label;
