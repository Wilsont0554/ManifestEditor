import { useState } from "react";
import Label from "../../../../utils/manifest/Label.js";
import Input from "../../../shared/input/index.jsx";

const SUPPORTED_LANGUAGES = new Label("").getSupportedLanguages();

const LANGUAGE_NAMES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  ru: "Russian",
  zh: "Chinese",
  jp: "Japanese",
  pt: "Portuguese",
  ar: "Arabic",
  hi: "Hindi",
  sv: "Swedish",
  nl: "Dutch",
  ko: "Korean",
  tr: "Turkish",
  vi: "Vietnamese",
};

function LabelEditor({ currentObject, labelIndex, setCount }) {
  const [labelValue, setLabelValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:shadow-[0_0_0_3px_rgba(148,163,184,0.25)]"
        value={selectedLanguage}
        onChange={(event) => {
          const nextLanguage = event.target.value;
          setSelectedLanguage(nextLanguage);
          currentObject.changeLabel(labelIndex, labelValue, nextLanguage);
          setCount((value) => value + 1);
        }}
      >
        {SUPPORTED_LANGUAGES.map((languageCode) => (
          <option key={languageCode} value={languageCode}>
            {LANGUAGE_NAMES[languageCode] ?? languageCode}
          </option>
        ))}
      </select>

      <Input
        className="max-w-lg"
        placeholder="A brief description"
        type="text"
        value={labelValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          setLabelValue(nextValue);
          currentObject.changeLabel(labelIndex, nextValue, selectedLanguage);
          setCount((value) => value + 1);
        }}
      />
    </div>
  );
}

export default LabelEditor;
