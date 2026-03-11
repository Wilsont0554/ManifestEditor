import type { ManifestTabProps } from "../manifest-component-constants";
import InputWithLanguage from "@/components/shared/inputWithLanguage";
import { useState } from "react";

function OverviewTab() {
  const [languageCode, setLanguageCode] = useState("none");
  const [value, setValue] = useState("");
  const handleLanguageChange = (newLanguageCode: string) => {
    setLanguageCode(newLanguageCode);
  };
  const handleInputChange = (newValue: string) => {
    setValue(newValue);
  }

  return (
    <div className="min-h-40">
      <InputWithLanguage
        label = "Label"
        languageCode={languageCode}
        value={value}
        onChange={handleInputChange}
        onLanguageChange={handleLanguageChange}
      />
    </div>
  );
}

export default OverviewTab;
