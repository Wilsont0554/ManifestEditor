import InputWithLanguage from "@/components/shared/inputWithLanguage";
import { manifestObjContext } from "@/context/manifest-context";
import { useContext } from "react";
import ManifestTabBody from "../shared/manifest-tab-body";
import ManifestField from "../shared/manifest-field";

function OverviewMetadataField({
  label,
  value,
  languageCode,
  multiline = false,
}: {
  label: string;
  value: string;
  languageCode?: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <div className="relative overflow-hidden border-b-2 border-pink-500 bg-slate-100">
        <p
          className={`px-4 py-3 text-base text-slate-900 ${
            languageCode ? "pr-16" : ""
          } ${multiline ? "whitespace-pre-wrap leading-6" : ""}`}
        >
          {value}
        </p>

        {languageCode ? (
          <span className="absolute right-2 top-2 rounded-md bg-slate-200 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {languageCode}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function OverviewTab() {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const metadataSummaryItems = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations()
    .map((annotation, resourceIndex) => ({
      resourceIndex,
      resource: annotation.getContentResource(),
    }))

  function handleLanguageChange(newLanguageCode: string) {
    manifestObj.setLabelLanguage(newLanguageCode);
    updateManifestObj();
  };

  function handleInputChange(newValue: string){
    manifestObj.setLabel(newValue);
    updateManifestObj();
  };

  function handleSummaryLanguageChange(newLanguageCode: string) {
    manifestObj.setSummaryLanguage(newLanguageCode);
    updateManifestObj();
  };

  function handleSummaryChange(newValue: string) {
    manifestObj.setSummary(newValue);
    updateManifestObj();
  };

  return (
    <ManifestTabBody className="pb-6">
        <section className="space-y-6">
            <InputWithLanguage
              label="Label"
              languageCode={manifestObj.getLabelLanguage()}
              value={manifestObj.getLabelValue()}
              onChange={handleInputChange}
              onLanguageChange={handleLanguageChange}
            />
            {manifestObj.getSummaryValue() && 
              <InputWithLanguage
                label="Summary"
                languageCode={manifestObj.getSummaryLanguage()}
                value={manifestObj.getSummaryValue()}
                onChange={handleSummaryChange}
                onLanguageChange={handleSummaryLanguageChange}
              rows={3}
              textareaClassName="min-h-28"
            /> }
        </section>
        
        {metadataSummaryItems.length > 0 && 
          <ManifestField label="Metadata" className="space-y-4 border-t border-slate-200 pt-8">   
            <p className="text-sm leading-6 text-slate-500">
              Metadata changes from the Metadata tab are summarized here.
            </p>
            <div className="space-y-4">
              { metadataSummaryItems.map(({ resourceIndex, resource }) => (
                <section
                  key={`overview-metadata-resource-${resourceIndex}`}
                  className="overflow-hidden rounded-md border border-slate-200"
                >
                  <div className="border-b border-slate-200 bg-white px-4 py-3">
                    <p className="text-[15px] font-semibold text-slate-950">
                      Content Resource {resourceIndex + 1}
                    </p>
                    {resource!.id ? (
                      <p className="mt-1 text-sm text-slate-500">{resource!.id}</p>
                    ) : null}
                  </div>

                  <div className="divide-y divide-slate-200">
                    {resource!
                      .getMetadata()
                      .getAllEntries()
                      .map((entry, entryIndex) => (
                        <div
                          key={`overview-metadata-entry-${resourceIndex}-${entryIndex}`}
                          className="space-y-4 bg-white px-4 py-4"
                        >
                          <OverviewMetadataField
                            label="Label"
                            value={entry.getLabelText() || "Untitled metadata"}
                            languageCode={entry.getLabelLanguage()}
                          />

                          <OverviewMetadataField
                            label="Value"
                            value={entry.getValueText() || "No value"}
                            multiline
                          />
                        </div>
                      ))}
                  </div>
                </section>
              ))}
            </div>
          </ManifestField> }
        <section className="space-y-6 border-t border-slate-200 pt-8">
        </section> 
    </ManifestTabBody>
  );
}

export default OverviewTab;
