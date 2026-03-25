import InputWithLanguage from "@/components/shared/inputWithLanguage";
import { useState } from "react";
import ManifestTabBody from "../shared/manifest-tab-body";

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
    <ManifestTabBody>
      <InputWithLanguage
        label = "Label"
        languageCode={languageCode}
        value={value}
        onChange={handleInputChange}
        onLanguageChange={handleLanguageChange}
      />
    </ManifestTabBody>
  );
}

export default OverviewTab;
