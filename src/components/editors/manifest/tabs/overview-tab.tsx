import InputWithLanguage from "@/components/shared/inputWithLanguage";
import { manifestObjContext } from "@/context/manifest-context";
import type ContentResource from "@/ManifestClasses/ContentResource";
import { getDisplayableContentResourceItems } from "@/utils/content-resource";
import {
  builtInManifestBehaviors,
  manifestAutoAdvanceBehaviors,
  manifestOrderingBehaviors,
  manifestRepeatBehaviors,
  manifestViewingDirections,
  type ManifestAutoAdvanceBehavior,
  type ManifestOrderingBehavior,
  type ManifestRepeatBehavior,
  type ManifestViewingDirection,
} from "@/types/iiif";
import { useContext, useState } from "react";
import ManifestCustomBehaviorEditor from "../shared/manifest-custom-behavior-editor";
import ContentResourceMediaList from "../shared/content-resource-media-list";
import ManifestInput from "../shared/manifest-input";
import ManifestTabBody from "../shared/manifest-tab-body";
import TechnicalOptionGroup from "../shared/technical-option-group";

const viewingDirectionOptions = manifestViewingDirections.map((value) => ({
  value,
  label: value
    .replace(/-/g, " ")
    .replace(/^\w/, (character: string) => character.toUpperCase()),
}));

const manifestOrderingOptions = [
  { value: "", label: "None" },
  ...manifestOrderingBehaviors.map((value) => ({
    value,
    label: value,
  })),
];

const repeatOptions = [
  { value: "", label: "None" },
  ...manifestRepeatBehaviors.map((value) => ({
    value,
    label: value,
  })),
];

const autoAdvanceOptions = [
  { value: "", label: "None" },
  ...manifestAutoAdvanceBehaviors.map((value) => ({
    value,
    label: value,
  })),
];

type TechnicalSectionId = "manifestOrdering" | "repeat" | "autoAdvance";

interface OverviewBehaviorSummaryItem {
  sectionId: TechnicalSectionId;
  value: string;
}

interface OverviewMetadataSummaryItem {
  resourceIndex: number;
  resource: ContentResource;
}

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

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      viewBox="0 0 12 8"
      className={`h-3 w-3 text-slate-500 transition-transform ${
        isOpen ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <path
        d="M1 1.5 6 6.5 11 1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OverviewTab() {
  const { manifestObj, updateManifestObj, isFieldEdited } =
    useContext(manifestObjContext);
  const [openSections, setOpenSections] = useState<
    Record<TechnicalSectionId, boolean>
  >({
    manifestOrdering: false,
    repeat: false,
    autoAdvance: false,
  });
  const hasEditedId = isFieldEdited("id");
  const hasEditedLabel = isFieldEdited("label");
  const hasEditedSummary = isFieldEdited("summary");
  const hasEditedRights = isFieldEdited("rights");
  const hasEditedNavDate = isFieldEdited("navDate");
  const hasEditedContentResources = isFieldEdited("contentResources");
  const hasEditedViewingDirection = isFieldEdited("viewingDirection");
  const hasEditedManifestOrderingBehavior = isFieldEdited(
    "manifestOrderingBehavior",
  );
  const hasEditedRepeatBehavior = isFieldEdited("repeatBehavior");
  const hasEditedAutoAdvanceBehavior = isFieldEdited("autoAdvanceBehavior");
  const hasEditedCustomBehaviors = isFieldEdited("customBehaviors");
  const hasEditedMetadata = isFieldEdited("metadata");
  const hasEditedDescriptiveFields =
    hasEditedLabel ||
    hasEditedSummary ||
    hasEditedRights ||
    hasEditedNavDate;
  const hasEditedBuiltInBehaviorFields =
    hasEditedManifestOrderingBehavior ||
    hasEditedRepeatBehavior ||
    hasEditedAutoAdvanceBehavior;
  const hasEditedTechnicalFields =
    hasEditedId ||
    hasEditedViewingDirection ||
    hasEditedBuiltInBehaviorFields ||
    hasEditedCustomBehaviors;
  const behaviorSummaryItems: OverviewBehaviorSummaryItem[] = [];
  const metadataSummaryItems: OverviewMetadataSummaryItem[] = manifestObj
    .getContainerObj()
    .getAnnotationPage()
    .getAllAnnotations()
    .map((annotation, resourceIndex) => ({
      resourceIndex,
      resource: annotation.getContentResource(),
    }))
    .filter(
      (item): item is OverviewMetadataSummaryItem =>
        !!item.resource &&
        item.resource.getMetadata().getEntryCount() > 0,
    );
  const contentResourceMediaItems =
    getDisplayableContentResourceItems(manifestObj);

  if (hasEditedManifestOrderingBehavior) {
    behaviorSummaryItems.push({
      sectionId: "manifestOrdering",
      value: manifestObj.getManifestOrderingBehavior(),
    });
  }

  if (hasEditedRepeatBehavior) {
    behaviorSummaryItems.push({
      sectionId: "repeat",
      value: manifestObj.getRepeatBehavior(),
    });
  }

  if (hasEditedAutoAdvanceBehavior) {
    behaviorSummaryItems.push({
      sectionId: "autoAdvance",
      value: manifestObj.getAutoAdvanceBehavior(),
    });
  }

  function commitManifestChange(): void {
    updateManifestObj(manifestObj.clone());
  }

  function toggleSection(sectionId: TechnicalSectionId): void {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [sectionId]: !currentSections[sectionId],
    }));
  }

  function openSection(sectionId: TechnicalSectionId): void {
    setOpenSections((currentSections) => ({
      ...currentSections,
      [sectionId]: true,
    }));
  }

  function handleLanguageChange(newLanguageCode: string): void {
    manifestObj.setLabelLanguage(newLanguageCode);
    commitManifestChange();
  }

  function handleInputChange(newValue: string): void {
    manifestObj.setLabel(newValue);
    commitManifestChange();
  }

  function handleSummaryLanguageChange(newLanguageCode: string): void {
    manifestObj.setSummaryLanguage(newLanguageCode);
    commitManifestChange();
  }

  function handleSummaryChange(newValue: string): void {
    manifestObj.setSummary(newValue);
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

  function handleIdentifierChange(newValue: string): void {
    manifestObj.setId(newValue);
    commitManifestChange();
  }

  function handleViewingDirectionChange(newValue: string): void {
    manifestObj.setViewingDirection(newValue as ManifestViewingDirection | "");
    commitManifestChange();
  }

  function handleManifestOrderingChange(newValue: string): void {
    manifestObj.setManifestOrderingBehavior(
      newValue as ManifestOrderingBehavior | "",
    );
    commitManifestChange();
  }

  function handleRepeatChange(newValue: string): void {
    manifestObj.setRepeatBehavior(newValue as ManifestRepeatBehavior | "");
    commitManifestChange();
  }

  function handleAutoAdvanceChange(newValue: string): void {
    manifestObj.setAutoAdvanceBehavior(
      newValue as ManifestAutoAdvanceBehavior | "",
    );
    commitManifestChange();
  }

  function handleAddCustomBehavior(value: string): boolean {
    const wasAdded = manifestObj.addCustomBehavior(value);

    if (wasAdded) {
      commitManifestChange();
    }

    return wasAdded;
  }

  function handleRemoveCustomBehavior(value: string): void {
    manifestObj.removeCustomBehavior(value);
    commitManifestChange();
  }

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

      {hasEditedContentResources && contentResourceMediaItems.length > 0 ? (
        <section
          className={`space-y-4 ${
            hasEditedDescriptiveFields ? "border-t border-slate-200 pt-8" : ""
          }`}
        >
          <p className="text-lg font-medium text-slate-950">Media</p>

          <ContentResourceMediaList items={contentResourceMediaItems} />
        </section>
      ) : null}

      {hasEditedMetadata ? (
        <section
          className={`space-y-4 ${
            hasEditedDescriptiveFields ||
            (hasEditedContentResources && contentResourceMediaItems.length > 0)
              ? "border-t border-slate-200 pt-8"
              : ""
          }`}
        >
          <div className="space-y-1">
            <p className="text-lg font-medium text-slate-950">Metadata</p>
            <p className="text-sm leading-6 text-slate-500">
              Metadata changes from the Metadata tab are summarized here.
            </p>
          </div>

          <div className="space-y-4">
            {metadataSummaryItems.map(({ resourceIndex, resource }) => (
              <section
                key={`overview-metadata-resource-${resourceIndex}`}
                className="overflow-hidden rounded-md border border-slate-200"
              >
                <div className="border-b border-slate-200 bg-white px-4 py-3">
                  <p className="text-[15px] font-semibold text-slate-950">
                    Content Resource {resourceIndex + 1}
                  </p>
                  {resource.id ? (
                    <p className="mt-1 text-sm text-slate-500">{resource.id}</p>
                  ) : null}
                </div>

                <div className="divide-y divide-slate-200">
                  {resource
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
        </section>
      ) : null}

      {hasEditedTechnicalFields ? (
        <section
          className={`space-y-6 ${
            hasEditedDescriptiveFields || hasEditedMetadata
            || (hasEditedContentResources && contentResourceMediaItems.length > 0)
              ? "border-t border-slate-200 pt-8"
              : ""
          }`}
        >
          {hasEditedId ? (
            <ManifestInput
              label="Identifier"
              id="overview-manifest-identifier"
              type="text"
              value={manifestObj.getId()}
              onChange={handleIdentifierChange}
            />
          ) : null}

          {hasEditedViewingDirection ? (
            <section className="space-y-3">
              <p className="text-lg font-medium text-slate-950">
                Viewing direction
              </p>
              <TechnicalOptionGroup
                options={viewingDirectionOptions}
                value={manifestObj.getViewingDirection()}
                onChange={handleViewingDirectionChange}
                allowDeselect
              />
            </section>
          ) : null}

          {hasEditedBuiltInBehaviorFields ? (
            <section className="space-y-2">
              <p className="text-lg font-medium text-slate-950">
                Built-in behaviors
              </p>

              {hasEditedManifestOrderingBehavior ? (
                <section className="border-t border-slate-200">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    onClick={() => toggleSection("manifestOrdering")}
                    aria-expanded={openSections.manifestOrdering}
                  >
                    <span className="text-[15px] font-semibold uppercase tracking-[0.02em] text-slate-500">
                      Manifest ordering
                    </span>
                    <ChevronIcon isOpen={openSections.manifestOrdering} />
                  </button>
                  {openSections.manifestOrdering ? (
                    <div className="pb-4">
                      <TechnicalOptionGroup
                        options={manifestOrderingOptions}
                        value={manifestObj.getManifestOrderingBehavior()}
                        onChange={handleManifestOrderingChange}
                      />
                    </div>
                  ) : null}
                </section>
              ) : null}

              {hasEditedRepeatBehavior ? (
                <section className="border-t border-slate-200">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    onClick={() => toggleSection("repeat")}
                    aria-expanded={openSections.repeat}
                  >
                    <span className="text-[15px] font-semibold uppercase tracking-[0.02em] text-slate-500">
                      Repeat
                    </span>
                    <ChevronIcon isOpen={openSections.repeat} />
                  </button>
                  {openSections.repeat ? (
                    <div className="pb-4">
                      <TechnicalOptionGroup
                        options={repeatOptions}
                        value={manifestObj.getRepeatBehavior()}
                        onChange={handleRepeatChange}
                        orientation="horizontal"
                      />
                    </div>
                  ) : null}
                </section>
              ) : null}

              {hasEditedAutoAdvanceBehavior ? (
                <section className="border-t border-slate-200">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    onClick={() => toggleSection("autoAdvance")}
                    aria-expanded={openSections.autoAdvance}
                  >
                    <span className="text-[15px] font-semibold uppercase tracking-[0.02em] text-slate-500">
                      Auto-advance
                    </span>
                    <ChevronIcon isOpen={openSections.autoAdvance} />
                  </button>
                  {openSections.autoAdvance ? (
                    <div className="pb-4">
                      <TechnicalOptionGroup
                        options={autoAdvanceOptions}
                        value={manifestObj.getAutoAdvanceBehavior()}
                        onChange={handleAutoAdvanceChange}
                        orientation="horizontal"
                      />
                    </div>
                  ) : null}
                </section>
              ) : null}
            </section>
          ) : null}

          {behaviorSummaryItems.length > 0 || hasEditedCustomBehaviors ? (
            <section className="space-y-4">
              <p className="text-lg font-medium text-slate-950">Behaviors</p>

              {behaviorSummaryItems.length > 0 ? (
                <div className="overflow-hidden border-t border-slate-200">
                  {behaviorSummaryItems.map((item) => (
                    <div
                      key={`${item.sectionId}-${item.value}`}
                      className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4"
                    >
                      <span className="text-base text-slate-900">
                        {item.value}
                      </span>
                      <button
                        type="button"
                        className="text-base font-medium text-slate-500 transition hover:text-slate-700"
                        onClick={() => openSection(item.sectionId)}
                      >
                        edit -&gt;
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <ManifestCustomBehaviorEditor
                behaviors={manifestObj.getCustomBehaviors()}
                reservedBehaviors={builtInManifestBehaviors}
                onAddBehavior={handleAddCustomBehavior}
                onRemoveBehavior={handleRemoveCustomBehavior}
              />
            </section>
          ) : null}
        </section>
      ) : null}
    </ManifestTabBody>
  );
}

export default OverviewTab;
