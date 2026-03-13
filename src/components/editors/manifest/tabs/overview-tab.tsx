import InputWithLanguage from "@/components/shared/inputWithLanguage";
import { manifestObjContext } from "@/context/manifest";
import { useContext } from "react";
import ManifestInput from "../shared/manifest-input";
import ManifestTabBody from "../shared/manifest-tab-body";

function OverviewTab() {
  const { manifestObj, updateManifestObj, isFieldEdited } =
    useContext(manifestObjContext);
  const hasEditedLabel = isFieldEdited("label");
  const hasEditedSummary = isFieldEdited("summary");
  const hasEditedRights = isFieldEdited("rights");
  const hasEditedNavDate = isFieldEdited("navDate");
  const hasEditedDescriptiveFields =
    hasEditedLabel ||
    hasEditedSummary ||
    hasEditedRights ||
    hasEditedNavDate;

  const handleLanguageChange = (newLanguageCode: string) => {
    manifestObj.setLabelLanguage(newLanguageCode);
    updateManifestObj(manifestObj.clone());
  };

  const handleInputChange = (newValue: string) => {
    manifestObj.setLabel(newValue);
    updateManifestObj(manifestObj.clone());
  };

  const handleSummaryLanguageChange = (newLanguageCode: string) => {
    manifestObj.setSummaryLanguage(newLanguageCode);
    updateManifestObj(manifestObj.clone());
  };

  const handleSummaryChange = (newValue: string) => {
    manifestObj.setSummary(newValue);
    updateManifestObj(manifestObj.clone());
  };

  const handleRightsChange = (newValue: string) => {
    manifestObj.setRights(newValue);
    updateManifestObj(manifestObj.clone());
  };

  const handleNavDateChange = (newValue: string) => {
    manifestObj.setNavDate(newValue);
    updateManifestObj(manifestObj.clone());
  };

  return (
    <ManifestTabBody className="pb-6">
      {hasEditedDescriptiveFields ? (
        <section className="space-y-6">
          {hasEditedLabel ? (
            <InputWithLanguage
              label="Label"
              languageCode={manifestObj.getLabelLanguage()}
              value={manifestObj.getLabelValue()}
              onChange={handleInputChange}
              onLanguageChange={handleLanguageChange}
            />
          ) : null}

          {hasEditedSummary ? (
            <InputWithLanguage
              label="Summary"
              languageCode={manifestObj.getSummaryLanguage()}
              value={manifestObj.getSummaryValue()}
              onChange={handleSummaryChange}
              onLanguageChange={handleSummaryLanguageChange}
              rows={3}
              textareaClassName="min-h-28"
            />
          ) : null}

          {hasEditedRights ? (
            <ManifestInput
              label="Rights"
              id="overview-manifest-rights"
              type="text"
              value={manifestObj.getRights()}
              onChange={handleRightsChange}
            />
          ) : null}

          {hasEditedNavDate ? (
            <ManifestInput
              label="Nav Date"
              id="overview-manifest-nav-date"
              type="datetime-local"
              value={manifestObj.getNavDate()}
              onChange={handleNavDateChange}
              appearance="outline"
            />
          ) : null}
        </section>
      ) : null}
    </ManifestTabBody>
  );
}

export default OverviewTab;
