import React, { useMemo, useState } from "react";
import Label from "../ManifestClasses/Label.js";

function LabelElement(props) {
  const [labelValue, setlabelValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const tempLabel = useMemo(() => new Label(""), []);
  const supportedLanguages = tempLabel.getSupportedLanguages();

  const languageNames = {
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

  const canvasIndex = props.canvasIndex ?? 0;
  const fallbackObject = props.manifestObj
    ?.getContainerObj(canvasIndex)
    ?.getAnnotationPage()
    ?.getAnnotation(0)
    ?.getContentResource(props.contentResourceIndex);
  const currentObject = props.currentObject || fallbackObject;
  const labelIndex = props.labelIndex ?? 0;

  const bumpCount = () => {
    if (typeof props.setcount === "function") {
      props.setcount(props.count + 1);
    }
  };

  if (!currentObject || typeof currentObject.changeLabel !== "function") {
    return null;
  }

  return (
    <li>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <select
          value={selectedLanguage}
          onChange={(event) => {
            const nextLanguage = event.target.value;
            setSelectedLanguage(nextLanguage);
            currentObject.changeLabel(labelIndex, labelValue, nextLanguage);
            bumpCount();
          }}
          style={{ padding: "5px" }}
        >
          {supportedLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {languageNames[lang] || lang}
            </option>
          ))}
        </select>
        <input
          placeholder="A brief description"
          type="text"
          value={labelValue}
          onChange={(event) => {
            const nextValue = event.target.value;
            setlabelValue(nextValue);
            currentObject.changeLabel(labelIndex, nextValue, selectedLanguage);
            bumpCount();
          }}
        />
      </div>
    </li>
  );
}

export default LabelElement;
