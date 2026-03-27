import InputWithLanguage from "@/components/shared/inputWithLanguage";
import type Annotation from "@/ManifestClasses/Annotation";
import type ContentResource from "@/ManifestClasses/ContentResource";
import Light from "@/ManifestClasses/Light";
import {
  contentResourceTypeToFormat,
} from "@/utils/content-resource";
import ManifestField from "./manifest-field";
import ManifestInput from "./manifest-input";
import SoftActionButton from "./soft-action-button";
import TechnicalOptionGroup from "./technical-option-group";

const contentResourceTypeOptions = Object.keys(contentResourceTypeToFormat).map(
  (value) => ({
    value,
    label: value,
  }),
);

interface ResourceLabelSyncPayload {
  previousValue: string;
  previousLanguageCode: string;
  value: string;
  languageCode: string;
}

interface ContentResourceEditorProps {
  annotation: Annotation;
  resource: ContentResource;
  idPrefix: string;
  onCommit: () => void;
  onResourceLabelSync?: (payload: ResourceLabelSyncPayload) => void;
  className?: string;
  showTypeSelector?: boolean;
  showMetadataAction?: boolean;
  onOpenMetadata?: () => void;
}

function ContentResourceEditor({
  annotation,
  resource,
  idPrefix,
  onCommit,
  onResourceLabelSync,
  className = "",
  showTypeSelector = true,
  showMetadataAction = true,
  onOpenMetadata,
}: ContentResourceEditorProps) {
  const isLightResource = resource instanceof Light;

  function getAnnotationLabel(): string {
    return annotation.getLabel()?.getValue() ?? "";
  }

  function getAnnotationLabelLanguage(): string {
    return annotation.getLabel()?.getLanguage() ?? "en";
  }

  function getResourceLabel(): string {
    return resource.getLabel().getValue();
  }

  function getResourceLabelLanguage(): string {
    return resource.getLabel().getLanguage() ?? "en";
  }

  function handleContentResourceTypeChange(nextType: string): void {
    if (!(nextType in contentResourceTypeToFormat)) {
      return;
    }

    const editableType = nextType as keyof typeof contentResourceTypeToFormat;
    resource.setType(editableType);
    resource.setFormat(contentResourceTypeToFormat[editableType]);
    onCommit();
  }

  function handleAnnotationLabelChange(newValue: string): void {
    annotation.changeLabel(0, newValue, getAnnotationLabelLanguage());
    onCommit();
  }

  function handleAnnotationLabelLanguageChange(newLanguageCode: string): void {
    annotation.changeLabel(0, getAnnotationLabel(), newLanguageCode);
    onCommit();
  }

  function handleResourceLabelChange(newValue: string): void {
    const previousValue = getResourceLabel();
    const languageCode = getResourceLabelLanguage();

    resource.changeLabel(0, newValue, languageCode);
    onResourceLabelSync?.({
      previousValue,
      previousLanguageCode: languageCode,
      value: newValue,
      languageCode,
    });
    onCommit();
  }

  function handleResourceLabelLanguageChange(newLanguageCode: string): void {
    const previousValue = getResourceLabel();
    const previousLanguageCode = getResourceLabelLanguage();

    resource.changeLabel(0, previousValue, newLanguageCode);
    onResourceLabelSync?.({
      previousValue,
      previousLanguageCode,
      value: previousValue,
      languageCode: newLanguageCode,
    });
    onCommit();
  }

  return (
    <section className={`space-y-6 ${className}`}>
      {showTypeSelector ? (
        <section className="space-y-3">
          <p className="text-base font-semibold text-slate-950">Type</p>
          <TechnicalOptionGroup
            options={contentResourceTypeOptions}
            value={resource.getType()}
            onChange={handleContentResourceTypeChange}
            orientation="horizontal"
            selectedVariant="pink"
          />
        </section>
      ) : null}

      {isLightResource ? (
        <ManifestInput
          label="Light Identifier"
          id={`${idPrefix}-light-identifier`}
          type="text"
          value={resource.id}
          onChange={() => {}}
          appearance="outline"
          readOnly
          inputClassName="bg-slate-50 text-slate-500"
        />
      ) : (
        <ManifestInput
          label="Resource URL"
          id={`${idPrefix}-resource-url`}
          type="text"
          value={resource.id}
          onChange={(newValue) => {
            resource.setID(newValue);
            onCommit();
          }}
        />
      )}

      <InputWithLanguage
        label="Annotation Label"
        languageCode={getAnnotationLabelLanguage()}
        value={getAnnotationLabel()}
        onChange={handleAnnotationLabelChange}
        onLanguageChange={handleAnnotationLabelLanguageChange}
      />

      <InputWithLanguage
        label="Content Resource Label"
        languageCode={getResourceLabelLanguage()}
        value={getResourceLabel()}
        onChange={handleResourceLabelChange}
        onLanguageChange={handleResourceLabelLanguageChange}
      />

      {showMetadataAction && onOpenMetadata ? (
        <section className="space-y-3 rounded-xl border border-dashed border-pink-200 bg-white p-4">
          <ManifestField label="Metadata">
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {resource.getMetadata().getEntryCount() > 0
                ? "Open the metadata editor to review or update existing entries."
                : "This resource does not have metadata yet. Start by creating your first entry."}
            </p>
          </ManifestField>
          <SoftActionButton onClick={onOpenMetadata}>
            {resource.getMetadata().getEntryCount() > 0
              ? "Edit Metadata"
              : "Add Metadata"}
          </SoftActionButton>
        </section>
      ) : null}
    </section>
  );
}

export default ContentResourceEditor;
