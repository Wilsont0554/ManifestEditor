import InputWithLanguage from "@components/shared/inputWithLanguage";
import { manifestObjContext } from "@/context/manifest";
import { type ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import EmptyStateCard from "../shared/empty-state-card";
import ManifestField from "../shared/manifest-field";
import ManifestInput from "../shared/manifest-input";
import ManifestTabBody from "../shared/manifest-tab-body";
import SoftActionButton from "../shared/soft-action-button";

function DescriptiveTab() {
  const { manifestObj, updateManifestObj } = useContext(manifestObjContext);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const labelLanguageCode = manifestObj.getLabelLanguage();
  const labelValue = manifestObj.getLabelValue();
  const summaryLanguageCode = manifestObj.getSummaryLanguage();
  const summaryValue = manifestObj.getSummaryValue();
  const rightsValue = manifestObj.getRights();
  const navDate = manifestObj.getNavDate();

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreviewUrl(null);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [thumbnailFile]);

  function handleThumbnailChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextFile = event.target.files?.[0] ?? null;
    setThumbnailFile(nextFile);
  }

  function commitManifestChange(): void {
    updateManifestObj(manifestObj.clone());
  }

  function handleLabelChange(newValue: string): void {
    manifestObj.setLabel(newValue);
    commitManifestChange();
  }

  function handleLabelLanguageChange(newLanguageCode: string): void {
    manifestObj.setLabelLanguage(newLanguageCode);
    commitManifestChange();
  }

  function handleSummaryChange(newValue: string): void {
    manifestObj.setSummary(newValue);
    commitManifestChange();
  }

  function handleSummaryLanguageChange(newLanguageCode: string): void {
    manifestObj.setSummaryLanguage(newLanguageCode);
    commitManifestChange();
  }

  function handleRightsChange(newValue: string): void {
    manifestObj.setRights(newValue);
    commitManifestChange();
  }

  function handleNavDateChange(newValue: string): void {
    manifestObj.setNavDate(newValue);
    commitManifestChange();
  }

  return (
    <ManifestTabBody>
      <InputWithLanguage
        label="Label"
        languageCode={labelLanguageCode}
        value={labelValue}
        onChange={handleLabelChange}
        onLanguageChange={handleLabelLanguageChange}
      />

      <InputWithLanguage
        label="Summary"
        languageCode={summaryLanguageCode}
        value={summaryValue}
        onChange={handleSummaryChange}
        onLanguageChange={handleSummaryLanguageChange}
        rows={3}
        textareaClassName="min-h-28"
      />

      <ManifestField label="Thumbnail" className="space-y-3">
        <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
          {thumbnailPreviewUrl ? (
            <img
              src={thumbnailPreviewUrl}
              alt="Manifest thumbnail preview"
              className="h-48 w-full object-cover"
            />
          ) : (
            <EmptyStateCard
              title="No thumbnail"
              className="bg-slate-50"
              titleClassName="text-slate-400"
            />
          )}
        </div>
        <SoftActionButton onClick={() => fileInputRef.current?.click()}>
          <span className="text-2xl leading-none">+</span>
          <span className="text-base">Add Thumbnail</span>
        </SoftActionButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleThumbnailChange}
        />
      </ManifestField>

      <ManifestInput
        label="Rights"
        id="manifest-rights"
        type="text"
        value={rightsValue}
        onChange={handleRightsChange}
      />

      <ManifestInput
        label="Nav Date"
        id="manifest-nav-date"
        type="datetime-local"
        value={navDate}
        onChange={handleNavDateChange}
        appearance="outline"
      />

      <ManifestField label="Required statement" className="space-y-3">
        <EmptyStateCard
          title="No required statement"
          className="bg-slate-200"
          contentClassName="min-h-36 gap-6"
          action={
            <SoftActionButton className="bg-white px-6 py-3 text-xl hover:bg-rose-50">
              Add new
            </SoftActionButton>
          }
        />
      </ManifestField>

      <ManifestField label="Provider" className="space-y-3">
        <EmptyStateCard
          description="Add a provider to attach your institution name and logo to this Manifest."
          align="left"
          className="border border-slate-200 bg-slate-50"
        />
        <SoftActionButton>
          <span className="text-2xl leading-none">+</span>
          <span className="text-base">Add Provider</span>
        </SoftActionButton>
      </ManifestField>
    </ManifestTabBody>
  );
}

export default DescriptiveTab;
