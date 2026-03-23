import { useState } from "react";
import Label from "../ManifestClasses/TypeScript/Label.ts";
import type { LabelElementProps } from "./types.ts";

const languageNames: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  ru: "Russian",
  zh: "Chinese",
  ja: "Japanese",
  pt: "Portuguese",
  ar: "Arabic",
  hi: "Hindi",
  sv: "Swedish",
  nl: "Dutch",
  ko: "Korean",
  tr: "Turkish",
  vi: "Vietnamese",
};

function LabelElement({
  currentObject,
  count,
  setcount,
  labelIndex = 0,
}: LabelElementProps) {
  const [labelValue, setLabelValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const supportedLanguages = new Label("").getSupportedLanguages();

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <select
        value={selectedLanguage}
        onChange={(event) => {
          const nextLanguage = event.target.value;
          setSelectedLanguage(nextLanguage);
          currentObject.changeLabel(labelIndex, labelValue, nextLanguage);
          setcount(count + 1);
        }}
        style={{ padding: "5px" }}
      >
        {supportedLanguages.map((languageCode) => (
          <option key={languageCode} value={languageCode}>
            {languageNames[languageCode] ?? languageCode}
          </option>
        ))}
      </select>
      <input
        placeholder="A brief description"
        type="text"
        value={labelValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          setLabelValue(nextValue);
          currentObject.changeLabel(labelIndex, nextValue, selectedLanguage);
          setcount(count + 1);
        }}
      />
    </div>
  );
}

export default LabelElement;
